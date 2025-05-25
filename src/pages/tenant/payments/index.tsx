import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Calendar, 
  CreditCard, 
  ArrowDownToLine, 
  ChevronDown, 
  ChevronUp,
  DollarSign 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for payments
const payments = [
  {
    id: "1",
    amount: 900,
    breakdown: { rent: 850, maintenance: 50 },
    date: "2023-07-01",
    dueDate: "2023-07-05",
    status: "paid",
    type: "rent",
    method: "bank transfer",
    month: "July 2023",
    receiptNo: "RNT-2023-07-001"
  },
  {
    id: "2",
    amount: 900,
    breakdown: { rent: 850, maintenance: 50 },
    date: "2023-06-01",
    dueDate: "2023-06-05",
    status: "paid",
    type: "rent",
    method: "credit card",
    month: "June 2023",
    receiptNo: "RNT-2023-06-001"
  },
  {
    id: "3",
    amount: 900,
    breakdown: { rent: 850, maintenance: 50 },
    date: "2023-05-01",
    dueDate: "2023-05-05",
    status: "paid",
    type: "rent",
    method: "bank transfer",
    month: "May 2023",
    receiptNo: "RNT-2023-05-001"
  },
  {
    id: "4",
    amount: 900,
    breakdown: { rent: 850, maintenance: 50 },
    date: "2023-04-01",
    dueDate: "2023-04-05",
    status: "paid",
    type: "rent",
    method: "bank transfer",
    month: "April 2023",
    receiptNo: "RNT-2023-04-001"
  },
  {
    id: "5",
    amount: 900,
    breakdown: { rent: 850, maintenance: 50 },
    date: "2023-03-01",
    dueDate: "2023-03-05",
    status: "paid",
    type: "rent",
    method: "credit card",
    month: "March 2023",
    receiptNo: "RNT-2023-03-001"
  },
  {
    id: "6",
    amount: 900,
    breakdown: { rent: 850, maintenance: 50 },
    date: "2023-08-01",
    dueDate: "2023-08-05",
    status: "upcoming",
    type: "rent",
    method: null,
    month: "August 2023",
    receiptNo: null
  }
];

// Mock data for upcoming payment
const upcomingPayment = {
  id: "6",
  amount: 900,
  breakdown: { rent: 850, maintenance: 50 },
  dueDate: "2023-08-05",
  month: "August 2023"
};

export function TenantPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  
  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "last3" && new Date(payment.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "last6" && new Date(payment.date) >= new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  }).filter(payment => payment.status !== "upcoming"); // Exclude upcoming from history
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  const toggleExpand = (id: string) => {
    if (expandedPayment === id) {
      setExpandedPayment(null);
    } else {
      setExpandedPayment(id);
    }
  };
  
  // Calculate days until next payment
  const nextPaymentDate = new Date(upcomingPayment.dueDate);
  const today = new Date();
  const daysUntilPayment = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Download All Receipts
        </Button>
      </div>
      
      {/* Upcoming Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payment</CardTitle>
          <CardDescription>Your next rent payment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{upcomingPayment.month}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${upcomingPayment.amount}</span>
                <span className="text-muted-foreground">due</span>
              </div>
              <p className="text-sm text-muted-foreground">Due by {formatDate(upcomingPayment.dueDate)}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Payment Breakdown</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Rent</span>
                  <span>${upcomingPayment.breakdown.rent}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance</span>
                  <span>${upcomingPayment.breakdown.maintenance}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${upcomingPayment.amount}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="text-center mb-3">
                <span className="text-lg font-medium">{daysUntilPayment} days remaining</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Make Payment</DialogTitle>
                    <DialogDescription>
                      Complete your payment for {upcomingPayment.month}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Payment Amount</Label>
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-muted text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          value={upcomingPayment.amount} 
                          className="rounded-l-none" 
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select>
                        <SelectTrigger id="payment-method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      <p className="font-medium mb-1">Payment Breakdown:</p>
                      <div className="flex justify-between">
                        <span>Rent</span>
                        <span>${upcomingPayment.breakdown.rent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance</span>
                        <span>${upcomingPayment.breakdown.maintenance}</span>
                      </div>
                      <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${upcomingPayment.amount}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Proceed to Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Your past payment transactions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last3">Last 3 Months</SelectItem>
                  <SelectItem value="last6">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search payments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="oldest">Oldest</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg">
                    <div 
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(payment.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.month}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.date)} • {payment.receiptNo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <div className="text-right">
                          <p className="font-bold">${payment.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            via {payment.method?.replace('_', ' ')}
                          </p>
                        </div>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Paid
                        </span>
                        {expandedPayment === payment.id ? 
                          <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        }
                      </div>
                    </div>
                    
                    {expandedPayment === payment.id && (
                      <div className="px-4 pb-4 border-t pt-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Date:</span>
                                <span>{formatDate(payment.date)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Due Date:</span>
                                <span>{formatDate(payment.dueDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Method:</span>
                                <span className="capitalize">{payment.method?.replace('_', ' ')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Receipt No:</span>
                                <span>{payment.receiptNo}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Payment Breakdown</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Rent:</span>
                                <span>${payment.breakdown.rent.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Maintenance:</span>
                                <span>${payment.breakdown.maintenance.toFixed(2)}</span>
                              </div>
                              <div className="border-t pt-1 flex justify-between font-medium">
                                <span>Total:</span>
                                <span>${payment.amount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Download Receipt
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="pt-4">
              <div className="space-y-4">
                {filteredPayments
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((payment) => (
                    <div key={payment.id} className="border rounded-lg">
                      <div 
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                        onClick={() => toggleExpand(payment.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.month}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(payment.date)} • {payment.receiptNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                          <div className="text-right">
                            <p className="font-bold">${payment.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              via {payment.method?.replace('_', ' ')}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Paid
                          </span>
                          {expandedPayment === payment.id ? 
                            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          }
                        </div>
                      </div>
                      
                      {expandedPayment === payment.id && (
                        <div className="px-4 pb-4 border-t pt-4">
                          {/* Same expanded content as above */}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment Date:</span>
                                  <span>{formatDate(payment.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Due Date:</span>
                                  <span>{formatDate(payment.dueDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Method:</span>
                                  <span className="capitalize">{payment.method?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Receipt No:</span>
                                  <span>{payment.receiptNo}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Payment Breakdown</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rent:</span>
                                  <span>${payment.breakdown.rent.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maintenance:</span>
                                  <span>${payment.breakdown.maintenance.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-1 flex justify-between font-medium">
                                  <span>Total:</span>
                                  <span>${payment.amount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Download Receipt
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="oldest" className="pt-4">
              <div className="space-y-4">
                {filteredPayments
                  .slice()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 3)
                  .map((payment) => (
                    <div key={payment.id} className="border rounded-lg">
                      <div 
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                        onClick={() => toggleExpand(payment.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.month}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(payment.date)} • {payment.receiptNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                          <div className="text-right">
                            <p className="font-bold">${payment.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              via {payment.method?.replace('_', ' ')}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Paid
                          </span>
                          {expandedPayment === payment.id ? 
                            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          }
                        </div>
                      </div>
                      
                      {expandedPayment === payment.id && (
                        <div className="px-4 pb-4 border-t pt-4">
                          {/* Same expanded content as above */}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment Date:</span>
                                  <span>{formatDate(payment.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Due Date:</span>
                                  <span>{formatDate(payment.dueDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Method:</span>
                                  <span className="capitalize">{payment.method?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Receipt No:</span>
                                  <span>{payment.receiptNo}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Payment Breakdown</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rent:</span>
                                  <span>${payment.breakdown.rent.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maintenance:</span>
                                  <span>${payment.breakdown.maintenance.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-1 flex justify-between font-medium">
                                  <span>Total:</span>
                                  <span>${payment.amount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Download Receipt
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}