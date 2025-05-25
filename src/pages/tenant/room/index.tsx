import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownToLine, 
  FileText, 
  Ruler, 
  Droplet, 
  Zap, 
  Calendar, 
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Camera
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for tenant's room
const roomData = {
  property: "Sunset Apartments",
  room: "A101",
  address: "123 Main Street, Anytown, USA",
  size: "1 BHK",
  rent: 850,
  maintenance: 50,
  isWaterIncluded: true,
  isElectricityIncluded: false,
  leaseStart: "2023-01-15",
  leaseEnd: "2024-01-14",
  description: "A well-maintained 1 bedroom apartment with a kitchen, living room, and balcony. The apartment has good natural lighting and is located on the first floor with easy access.",
  amenities: [
    "Air Conditioning",
    "Water Supply 24/7",
    "Parking Space",
    "Security",
    "Garbage Collection",
    "Internet Connection"
  ],
  rules: [
    "No pets allowed",
    "No smoking inside the apartment",
    "Quiet hours from 10 PM to 6 AM",
    "No alterations to the property without permission",
    "Maximum of 2 residents"
  ],
  images: [
    "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  landlord: {
    name: "John Smith",
    phone: "(555) 987-6543",
    email: "john.smith@example.com",
    preferredContactTime: "9 AM - 6 PM on weekdays"
  }
};

export function TenantRoom() {
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
        <div>
          <h1 className="text-3xl font-bold">My Room</h1>
          <p className="text-muted-foreground">
            {roomData.property} - {roomData.room}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Report an Issue</DialogTitle>
                <DialogDescription>
                  Describe the issue you're experiencing with your room.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="issue-title">Issue Title</Label>
                  <input
                    id="issue-title"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g., Leaking Faucet, Power Outage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-description">Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Please provide as much detail as possible..."
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-photos">Photos (Optional)</Label>
                  <div className="border border-dashed border-input rounded-md p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop photos here or click to upload
                    </p>
                    <Button size="sm" variant="secondary">
                      Choose Files
                    </Button>
                    <input
                      id="issue-photos"
                      type="file"
                      multiple
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-urgency">Urgency Level</Label>
                  <select
                    id="issue-urgency"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low - Not urgent</option>
                    <option value="medium">Medium - Needs attention within a week</option>
                    <option value="high">High - Needs immediate attention</option>
                    <option value="emergency">Emergency - Serious issue requiring immediate action</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Download Lease
          </Button>
        </div>
      </div>
      
      {/* Room Images */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 rounded-lg overflow-hidden h-64">
          <img 
            src={roomData.images[0]} 
            alt="Room main view" 
            className="w-full h-full object-cover"
          />
        </div>
        {roomData.images.slice(1, 4).map((image, index) => (
          <div key={index} className="rounded-lg overflow-hidden h-64">
            <img 
              src={image} 
              alt={`Room view ${index + 2}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="details">Room Details</TabsTrigger>
          <TabsTrigger value="amenities">Amenities & Rules</TabsTrigger>
          <TabsTrigger value="contact">Landlord Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
              <CardDescription>Details about your current accommodation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Property Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{roomData.property}</p>
                          <p className="text-sm text-muted-foreground">{roomData.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Ruler className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Size: {roomData.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Financial Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rent Amount:</span>
                        <span className="font-medium">${roomData.rent}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maintenance Charge:</span>
                        <span className="font-medium">${roomData.maintenance}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Monthly Payment:</span>
                        <span className="font-medium">${roomData.rent + roomData.maintenance}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Water Charges:</span>
                        <span className="font-medium">{roomData.isWaterIncluded ? 'Included in rent' : 'Not included'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Electricity Charges:</span>
                        <span className="font-medium">{roomData.isElectricityIncluded ? 'Included in rent' : 'Not included'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lease Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Lease Start: {formatDate(roomData.leaseStart)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Lease End: {formatDate(roomData.leaseEnd)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Room Description</h3>
                    <p className="text-muted-foreground">{roomData.description}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      View Payment History
                    </Button>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Lease Agreement
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amenities" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Rules</CardTitle>
              <CardDescription>Facilities available and rules to follow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Amenities</h3>
                  <ul className="space-y-2">
                    {roomData.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Utilities</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                        <span>Water: {roomData.isWaterIncluded ? 'Included in rent' : 'Not included'}</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                        <span>Electricity: {roomData.isElectricityIncluded ? 'Included in rent' : 'Not included'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">House Rules</h3>
                  <div className="space-y-2">
                    {roomData.rules.map((rule, index) => (
                      <div key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Important Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Please ensure compliance with all the house rules. Any violations may result in penalties
                      as specified in your lease agreement. For any clarifications, please contact your landlord.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Landlord Information</CardTitle>
              <CardDescription>Contact details of your property owner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">{roomData.landlord.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{roomData.landlord.name}</h3>
                  <p className="text-muted-foreground">Property Owner</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{roomData.landlord.phone}</p>
                      <p className="text-xs text-muted-foreground">Call for urgent matters</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{roomData.landlord.email}</p>
                      <p className="text-xs text-muted-foreground">Email for non-urgent matters</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Preferred Contact Hours</p>
                      <p className="text-xs text-muted-foreground">{roomData.landlord.preferredContactTime}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Report Issue
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Note</h4>
                  <p className="text-sm text-muted-foreground">
                    For emergency situations outside contact hours (e.g., water leakage, fire, etc.), 
                    please contact emergency services first, then notify your landlord as soon as possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}