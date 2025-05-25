import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Mail, Phone, MapPin, Calendar, Building, DoorOpen as Door } from "lucide-react";

// Mock data for tenants
const tenants = [
  {
    id: "1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "(555) 123-4567",
    property: "Sunset Apartments",
    room: "A101",
    moveInDate: "2023-01-15",
    leaseEnd: "2024-01-14",
    status: "active",
    image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=256"
  },
  {
    id: "2",
    name: "Robert Fox",
    email: "robert.fox@example.com",
    phone: "(555) 234-5678",
    property: "Willow Creek",
    room: "B205",
    moveInDate: "2023-03-01",
    leaseEnd: "2024-02-29",
    status: "active",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=256"
  },
  {
    id: "3",
    name: "Esther Howard",
    email: "esther.howard@example.com",
    phone: "(555) 345-6789",
    property: "Sunset Apartments",
    room: "A102",
    moveInDate: "2023-05-10",
    leaseEnd: "2023-11-09",
    status: "active",
    image: "https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=256"
  }
];

// Mock data for properties and rooms
const properties = [
  { id: "1", name: "Sunset Apartments" },
  { id: "2", name: "Willow Creek" },
  { id: "3", name: "Riverside Manor" }
];

const rooms = [
  { id: "1", property: "1", name: "A101" },
  { id: "2", property: "1", name: "A102" },
  { id: "3", property: "2", name: "B205" }
];

export function OwnerTenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm);
    
    const matchesProperty = propertyFilter === "all" || tenant.property === propertyFilter;
    
    return matchesSearch && matchesProperty;
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
                <DialogDescription>
                  Add the details of your new tenant here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property">Property</Label>
                  <Select>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Select>
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="moveInDate">Move-in Date</Label>
                    <Input id="moveInDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaseEnd">Lease End Date</Label>
                    <Input id="leaseEnd" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Tenant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tenants..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map(property => (
              <SelectItem key={property.id} value={property.name}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src={tenant.image} 
                    alt={tenant.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="h-3.5 w-3.5 mr-1" />
                    {tenant.property} - {tenant.room}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>Move-in: {formatDate(tenant.moveInDate)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>Lease ends: {formatDate(tenant.leaseEnd)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}