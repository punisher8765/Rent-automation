import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Building, DoorOpen as Door, Users, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ownerNavItems = [
  { path: '/owner', label: 'Dashboard', icon: Home },
  { path: '/owner/properties', label: 'Properties', icon: Building },
  { path: '/owner/rooms', label: 'Rooms', icon: Door },
  { path: '/owner/tenants', label: 'Tenants', icon: Users },
  { path: '/owner/payments', label: 'Payments', icon: CreditCard },
  { path: '/owner/profile', label: 'Profile', icon: User },
];

const tenantNavItems = [
  { path: '/tenant', label: 'Dashboard', icon: Home },
  { path: '/tenant/room', label: 'My Room', icon: Door },
  { path: '/tenant/payments', label: 'Payments', icon: CreditCard },
  { path: '/tenant/profile', label: 'Profile', icon: User },
];

export const DashboardLayout = ({ userRole }: { userRole: 'owner' | 'tenant' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navItems = userRole === 'owner' ? ownerNavItems : tenantNavItems;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-8 flex items-center">
        <Home className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-xl">Rent Ease</span>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const ItemIcon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary/20'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <ItemIcon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto px-4">
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 border-r border-border">
        <SidebarContent />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-semibold text-lg">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user?.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="md:hidden">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};