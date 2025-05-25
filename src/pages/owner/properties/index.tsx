import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Building, Edit, Trash2, MapPin } from "lucide-react";

// Mock data for properties
const properties = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "123 Main Street, Anytown, USA",
    rooms: 5,
    occupiedRooms: 4,
    image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "2",
    name: "Willow Creek",
    address: "456 Oak Avenue, Somewhere, USA",
    rooms: 3,
    occupiedRooms: 2,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "3",
    name: "Riverside Manor",
    address: "789 River Road, Elsewhere, USA",
    rooms: 4,
    occupiedRooms: 3,
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export function OwnerProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Properties</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
                <DialogDescription>
                  Add the details of your new property here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input id="name" placeholder="e.g., Sunset Apartments" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Full address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipcode">Zip Code</Label>
                    <Input id="zipcode" placeholder="Zip Code" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your property"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Property</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search properties..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-40 grid-cols-2">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {property.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Rooms</p>
                      <p className="text-2xl font-bold">{property.rooms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Occupied</p>
                      <p className="text-2xl font-bold">{property.occupiedRooms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vacancy</p>
                      <p className="text-2xl font-bold">{property.rooms - property.occupiedRooms}</p>
                    </div>
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
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">Address</th>
                    <th className="p-3 text-left font-medium">Total Rooms</th>
                    <th className="p-3 text-left font-medium">Occupied</th>
                    <th className="p-3 text-left font-medium">Vacancy</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b">
                      <td className="p-3 font-medium">{property.name}</td>
                      <td className="p-3">{property.address}</td>
                      <td className="p-3">{property.rooms}</td>
                      <td className="p-3">{property.occupiedRooms}</td>
                      <td className="p-3">{property.rooms - property.occupiedRooms}</td>
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