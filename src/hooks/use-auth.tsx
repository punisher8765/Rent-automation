import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'owner' | 'tenant') => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!authUser) throw new Error('No user returned after login');

      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, full_name')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not found');

      // Store user role in localStorage
      localStorage.setItem('rentease-user', JSON.stringify({ 
        role: profile.user_type,
        name: profile.full_name 
      }));
      
      toast({
        title: 'Welcome back!',
        description: `You've successfully logged in as ${profile.full_name}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'owner' | 'tenant') => {
    try {
      setIsLoading(true);
      setError(null);

      // Sign up the user
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            user_type: role
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('No user returned after signup');

      // Check if email verification is required and not yet completed
      // Supabase returns a user object but no session if email confirmation is pending
      const isEmailVerified = newUser.email_confirmed_at;

      if (!isEmailVerified) {
        toast({
          title: 'Account Created - Verification Pending',
          description: "We've sent a verification link to your email. Please verify your email to complete the signup process.",
        });
        // Do not proceed to create profile or set localStorage until email is verified.
        // The user will be able to log in after verification.
        // The onAuthStateChange listener will handle session setup upon successful verification and login.
        return; // Exit signup process here
      }

      // This part will typically only be reached if "Email auto-confirmation" is enabled in Supabase
      // AND the email was successfully auto-confirmed, OR if the user somehow re-triggers this flow after verification.
      // For most setups where email verification is enforced, the user needs to verify first, then log in.
      
      // Create profile record - only if email is verified
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: newUser.id,
              full_name: name,
              user_type: role,
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(`Failed to create user profile: ${profileError.message}`);
        }
        
        // Store user role in localStorage - only if profile creation was successful
        localStorage.setItem('rentease-user', JSON.stringify({ 
          role,
          name 
        }));

        toast({
          title: 'Welcome to RentEase!',
          description: 'Your account has been created and verified successfully.',
        });

      } catch (profileErr) {
        // Handle errors specifically from profile creation or localStorage
        const profileMessage = profileErr instanceof Error ? profileErr.message : 'Failed to finalize user profile.';
        setError(profileMessage);
        toast({
          variant: 'destructive',
          title: 'Profile Setup Error',
          description: profileMessage,
        });
        // If profile creation fails, it's a significant issue.
        // We might want to sign out the user to ensure a clean state,
        // or let them try to log in again which might trigger profile creation if it's idempotent.
        // For now, just re-throw.
        throw profileErr;
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear stored user data
      localStorage.removeItem('rentease-user');
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to logout';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};