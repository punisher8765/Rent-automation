import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, User, DollarSign, DoorOpen as Door, Building, Edit, Trash2 } from "lucide-react";

// Mock data for rooms
const rooms = [
  {
    id: "1",
    name: "A101",
    property: "Sunset Apartments",
    size: "1 BHK",
    rent: 850,
    maintenance: 50,
    status: "occupied",
    tenant: "Jane Cooper",
    image: "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "2",
    name: "A102",
    property: "Sunset Apartments",
    size: "2 BHK",
    rent: 950,
    maintenance: 50,
    status: "vacant",
    tenant: null,
    image: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "3",
    name: "B205",
    property: "Willow Creek",
    size: "3 BHK",
    rent: 1200,
    maintenance: 75,
    status: "occupied",
    tenant: "Robert Fox",
    image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

// Mock data for properties and tenants
const properties = [
  { id: "1", name: "Sunset Apartments" },
  { id: "2", name: "Willow Creek" },
  { id: "3", name: "Riverside Manor" }
];

const tenants = [
  { id: "1", name: "Jane Cooper" },
  { id: "2", name: "Robert Fox" },
  { id: "3", name: "Esther Howard" }
];

export function OwnerRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.tenant && room.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProperty = propertyFilter === "all" || room.property === propertyFilter;
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    
    return matchesSearch && matchesProperty && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Add the details of your new room here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                  <Label htmlFor="roomName">Room Name/Number</Label>
                  <Input id="roomName" placeholder="e.g., A101" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Room Size</Label>
                  <Input id="size" placeholder="e.g., 1 BHK, Studio" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rent">Rent Amount</Label>
                    <Input id="rent" placeholder="$" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Maintenance Charge</Label>
                    <Input id="maintenance" placeholder="$" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant (if occupied)</Label>
                  <Select>
                    <SelectTrigger id="tenant">
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map(tenant => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="waterIncluded" />
                  <Label htmlFor="waterIncluded">Water charges included in rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="electricityIncluded" />
                  <Label htmlFor="electricityIncluded">Electricity charges included in rent</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Room</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search rooms..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-full">
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
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-40 grid-cols-2">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium bg-background/80">
                    {room.status === 'occupied' ? 
                      <span className="text-green-500">Occupied</span> : 
                      <span className="text-blue-500">Vacant</span>
                    }
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Building className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {room.property}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${room.rent}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium flex items-center">
                        <Door className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Size
                      </p>
                      <p>{room.size}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center">
                        <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Maintenance
                      </p>
                      <p>${room.maintenance}/mo</p>
                    </div>
                    {room.tenant && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium flex items-center">
                          <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Tenant
                        </p>
                        <p>{room.tenant}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Room</th>
                    <th className="p-3 text-left font-medium">Property</th>
                    <th className="p-3 text-left font-medium">Size</th>
                    <th className="p-3 text-left font-medium">Rent</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Tenant</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="border-b">
                      <td className="p-3 font-medium">{room.name}</td>
                      <td className="p-3">{room.property}</td>
                      <td className="p-3">{room.size}</td>
                      <td className="p-3">${room.rent}</td>
                      <td className="p-3">
                        {room.status === 'occupied' ? 
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            Occupied
                          </span> : 
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Vacant
                          </span>
                        }
                      </td>
                      <td className="p-3">{room.tenant || '-'}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}