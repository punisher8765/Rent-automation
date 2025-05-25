import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, FileText, Clock, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Mock data for tenant
const roomData = {
  property: "Sunset Apartments",
  room: "A101",
  rent: 850,
  maintenance: 50,
  leaseStart: "2023-01-15",
  leaseEnd: "2024-01-14",
  nextPaymentDue: "2023-08-01",
  landlord: {
    name: "John Smith",
    phone: "(555) 987-6543",
    email: "john.smith@example.com"
  }
};

// Mock payment data
const paymentHistory = [
  {
    id: "1",
    amount: 900,
    date: "2023-07-01",
    status: "paid",
    type: "rent"
  },
  {
    id: "2",
    amount: 900,
    date: "2023-06-01",
    status: "paid",
    type: "rent"
  },
  {
    id: "3",
    amount: 900,
    date: "2023-05-01",
    status: "paid",
    type: "rent"
  }
];

// Mock notice data
const notices = [
  {
    id: "1",
    title: "Maintenance Work",
    content: "There will be maintenance work in the building on July 15 from 9 AM to 3 PM. Water supply may be temporarily affected.",
    date: "2023-07-10"
  },
  {
    id: "2",
    title: "Rent Increase Notice",
    content: "Please be informed that there will be a 3% rent increase effective from September 1st as per the lease agreement.",
    date: "2023-07-05"
  }
];

export function TenantDashboard() {
  const { user } = useAuth();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Calculate days until next payment
  const nextPaymentDate = new Date(roomData.nextPaymentDue);
  const today = new Date();
  const daysUntilPayment = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your rental information</p>
        </div>
        <Button>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Download Lease
        </Button>
      </div>
      
      {/* Room Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Overview</CardTitle>
            <CardDescription>Details about your current accommodation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Room Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property:</span>
                    <span className="font-medium">{roomData.property}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Number:</span>
                    <span className="font-medium">{roomData.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="font-medium">${roomData.rent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance:</span>
                    <span className="font-medium">${roomData.maintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Monthly:</span>
                    <span className="font-medium">${roomData.rent + roomData.maintenance}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Lease Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lease Start:</span>
                    <span className="font-medium">{formatDate(roomData.leaseStart)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lease End:</span>
                    <span className="font-medium">{formatDate(roomData.leaseEnd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Payment:</span>
                    <span className="font-medium">{formatDate(roomData.nextPaymentDue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Landlord:</span>
                    <span className="font-medium">{roomData.landlord.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{roomData.landlord.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Payment</CardTitle>
            <CardDescription>Your upcoming rent payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center pt-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{daysUntilPayment}</div>
                <div className="text-sm text-muted-foreground">days remaining</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{formatDate(roomData.nextPaymentDue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${roomData.rent + roomData.maintenance}</span>
              </div>
            </div>
            
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            Your payment history for the last 3 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Description</th>
                    <th className="p-3 text-left font-medium">Amount</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-3">{formatDate(payment.date)}</td>
                      <td className="p-3">
                        Rent and Maintenance for {new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="p-3 font-medium">${payment.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          Paid
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              View All History
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Notices */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notices</CardTitle>
          <CardDescription>
            Recent notifications from your landlord
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                    {notice.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(notice.date)}
                  </span>
                </div>
                <p className="text-sm">{notice.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Button variant="outline" className="h-24 flex-col">
          <FileText className="h-5 w-5 mb-2" />
          <span>Download Receipts</span>
        </Button>
        <Button variant="outline" className="h-24 flex-col">
          <Calendar className="h-5 w-5 mb-2" />
          <span>View Lease Agreement</span>
        </Button>
        <Button variant="outline" className="h-24 flex-col">
          <AlertCircle className="h-5 w-5 mb-2" />
          <span>Report an Issue</span>
        </Button>
      </div>
    </div>
  );
}