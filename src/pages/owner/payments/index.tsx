import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, FileText, ArrowDownToLine, ArrowUpToLine, Calendar } from "lucide-react";

// Mock data for payments
const payments = [
  {
    id: "1",
    tenant: "Jane Cooper",
    property: "Sunset Apartments",
    room: "A101",
    amount: 850,
    date: "2023-07-01",
    status: "paid",
    type: "rent",
    method: "bank transfer"
  },
  {
    id: "2",
    tenant: "Robert Fox",
    property: "Willow Creek",
    room: "B205",
    amount: 1200,
    date: "2023-07-02",
    status: "paid",
    type: "rent",
    method: "credit card"
  },
  {
    id: "3",
    tenant: "Esther Howard",
    property: "Sunset Apartments",
    room: "A102",
    amount: 950,
    date: "2023-07-05",
    status: "pending",
    type: "rent",
    method: "bank transfer"
  },
  {
    id: "4",
    tenant: "Jane Cooper",
    property: "Sunset Apartments",
    room: "A101",
    amount: 50,
    date: "2023-07-01",
    status: "paid",
    type: "maintenance",
    method: "bank transfer"
  },
  {
    id: "5",
    tenant: "Robert Fox",
    property: "Willow Creek",
    room: "B205",
    amount: 75,
    date: "2023-07-02",
    status: "paid",
    type: "maintenance",
    method: "credit card"
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

const rooms = [
  { id: "1", property: "1", name: "A101" },
  { id: "2", property: "1", name: "A102" },
  { id: "3", property: "2", name: "B205" }
];

export function OwnerPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProperty = propertyFilter === "all" || payment.property === propertyFilter;
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    
    return matchesSearch && matchesProperty && matchesStatus && matchesType;
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter(payment => payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>
                  Add the details of the payment here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <Select>
                    <SelectTrigger id="paymentType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="$" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input id="paymentDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {filteredPayments.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'paid').length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'pending').length} transactions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search payments..." 
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
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Transactions</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Tenant</th>
                        <th className="p-3 text-left font-medium">Property</th>
                        <th className="p-3 text-left font-medium">Room</th>
                        <th className="p-3 text-left font-medium">Type</th>
                        <th className="p-3 text-left font-medium">Amount</th>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Method</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="p-3 font-medium">{payment.tenant}</td>
                          <td className="p-3">{payment.property}</td>
                          <td className="p-3">{payment.room}</td>
                          <td className="p-3 capitalize">{payment.type}</td>
                          <td className="p-3">${payment.amount.toFixed(2)}</td>
                          <td className="p-3">{formatDate(payment.date)}</td>
                          <td className="p-3 capitalize">{payment.method.replace('_', ' ')}</td>
                          <td className="p-3">
                            {payment.status === 'paid' ? 
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                Paid
                              </span> : 
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                Pending
                              </span>
                            }
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rent" className="pt-4">
          {/* Similar content but filtered for rent payments */}
          <Card>
            <CardHeader>
              <CardTitle>Rent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Tenant</th>
                        <th className="p-3 text-left font-medium">Property</th>
                        <th className="p-3 text-left font-medium">Room</th>
                        <th className="p-3 text-left font-medium">Amount</th>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Method</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments
                        .filter(payment => payment.type === 'rent')
                        .map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="p-3 font-medium">{payment.tenant}</td>
                            <td className="p-3">{payment.property}</td>
                            <td className="p-3">{payment.room}</td>
                            <td className="p-3">${payment.amount.toFixed(2)}</td>
                            <td className="p-3">{formatDate(payment.date)}</td>
                            <td className="p-3 capitalize">{payment.method.replace('_', ' ')}</td>
                            <td className="p-3">
                              {payment.status === 'paid' ? 
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                  Paid
                                </span> : 
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                  Pending
                                </span>
                              }
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="pt-4">
          {/* Similar content but filtered for maintenance payments */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Tenant</th>
                        <th className="p-3 text-left font-medium">Property</th>
                        <th className="p-3 text-left font-medium">Room</th>
                        <th className="p-3 text-left font-medium">Amount</th>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Method</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments
                        .filter(payment => payment.type === 'maintenance')
                        .map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="p-3 font-medium">{payment.tenant}</td>
                            <td className="p-3">{payment.property}</td>
                            <td className="p-3">{payment.room}</td>
                            <td className="p-3">${payment.amount.toFixed(2)}</td>
                            <td className="p-3">{formatDate(payment.date)}</td>
                            <td className="p-3 capitalize">{payment.method.replace('_', ' ')}</td>
                            <td className="p-3">
                              {payment.status === 'paid' ? 
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                  Paid
                                </span> : 
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                  Pending
                                </span>
                              }
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}