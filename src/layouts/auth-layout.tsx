import { Outlet, Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border p-4">
        <div className="container flex items-center">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Home className="h-5 w-5" />
            <span className="font-bold text-lg">Rent Ease</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </main>
      
      <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} RentEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};