import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AppRoutes } from '@/routes';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="rentease-theme">
      <AppRoutes />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;