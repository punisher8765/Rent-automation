/*
  # Initial Schema Setup for RentEase

  1. Tables
    - properties
      - Basic property information
      - Ownership and location details
    - rooms
      - Room details within properties
      - Pricing and occupancy status
    - tenants
      - Tenant information
      - Contact details and documents
    - payments
      - Payment records
      - Transaction details
    - maintenance_requests
      - Maintenance ticket system
      - Issue tracking

  2. Security
    - Enable RLS on all tables
    - Set up access policies for owners and tenants
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  size text NOT NULL,
  rent numeric NOT NULL,
  maintenance_fee numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('vacant', 'occupied')),
  water_included boolean DEFAULT false,
  electricity_included boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  lease_start date NOT NULL,
  lease_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_date timestamptz NOT NULL,
  due_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'failed')),
  payment_method text,
  transaction_id text,
  receipt_no text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Policies for Properties
CREATE POLICY "Owners can CRUD their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policies for Rooms
CREATE POLICY "Owners can CRUD rooms in their properties"
  ON rooms
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = rooms.property_id
    AND properties.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = rooms.property_id
    AND properties.owner_id = auth.uid()
  ));

CREATE POLICY "Tenants can view their assigned room"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tenants
    WHERE tenants.room_id = rooms.id
    AND tenants.user_id = auth.uid()
  ));

-- Policies for Tenants
CREATE POLICY "Owners can view tenants in their properties"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rooms
    JOIN properties ON rooms.property_id = properties.id
    WHERE rooms.id = tenants.room_id
    AND properties.owner_id = auth.uid()
  ));

CREATE POLICY "Tenants can view their own information"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for Payments
CREATE POLICY "Owners can view payments for their properties"
  ON payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rooms
    JOIN properties ON rooms.property_id = properties.id
    WHERE rooms.id = payments.room_id
    AND properties.owner_id = auth.uid()
  ));

CREATE POLICY "Tenants can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tenants
    WHERE tenants.id = payments.tenant_id
    AND tenants.user_id = auth.uid()
  ));

-- Policies for Maintenance Requests
CREATE POLICY "Owners can CRUD maintenance requests for their properties"
  ON maintenance_requests
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rooms
    JOIN properties ON rooms.property_id = properties.id
    WHERE rooms.id = maintenance_requests.room_id
    AND properties.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM rooms
    JOIN properties ON rooms.property_id = properties.id
    WHERE rooms.id = maintenance_requests.room_id
    AND properties.owner_id = auth.uid()
  ));

CREATE POLICY "Tenants can CRUD their own maintenance requests"
  ON maintenance_requests
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tenants
    WHERE tenants.id = maintenance_requests.tenant_id
    AND tenants.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM tenants
    WHERE tenants.id = maintenance_requests.tenant_id
    AND tenants.user_id = auth.uid()
  ));