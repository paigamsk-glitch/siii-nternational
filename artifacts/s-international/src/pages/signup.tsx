import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plane, AlertCircle } from "lucide-react";
import { useAuthSignup, getGetSessionQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

export function Signup() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const signupMutation = useAuthSignup({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey() });
        setLocation("/bookings");
      },
      onError: (error) => {
        setErrorMsg((error?.data as any)?.error || (error?.data as any)?.message || "Registration failed. Please try again.");
      }
    }
  });

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    setErrorMsg("");
    signupMutation.mutate({ data });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 order-2 md:order-1">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Plane className="h-6 w-6 rotate-45" />
              <span className="font-serif text-xl font-bold tracking-tight">S International</span>
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Create an Account</h2>
            <p className="text-muted-foreground">Join S International to start planning your next journey.</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a secure password" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg mt-6 hover-elevate" 
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-accent items-center justify-center overflow-hidden order-1 md:order-2">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-l from-accent/90 to-accent/40" />
        
        <div className="relative z-10 max-w-xl px-12 text-accent-foreground text-right ml-auto">
          <div className="flex justify-end mb-12">
            <Link href="/" className="flex items-center gap-2 text-accent-foreground">
              <Plane className="h-8 w-8 rotate-45 text-secondary" />
              <span className="font-serif text-2xl font-bold tracking-tight">S International</span>
            </Link>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
            Your passport to the world.
          </h1>
          <p className="text-lg text-accent-foreground/80">
            Join an exclusive community of travelers. Enjoy expedited booking, priority support, and curated recommendations tailored to your preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
