import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Shield, Users, CreditCard } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.username === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [user, setLocation]);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          walletAddress: null
        })
      });

      if (response.ok) {
        const user = await response.json();
        
        toast({
          title: "Registration Successful",
          description: `Account created for ${user.username}!`,
        });

        setLocation('/dashboard');
      } else {
        const error = await response.text();
        toast({
          title: "Registration Failed",
          description: error || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const adminLogin = () => {
    setLoginData({
      username: "admin",
      password: "admin@123"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-8">
        
        {/* Hero Section */}
        <div className="hidden lg:flex flex-1 flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to DeFi Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The future of decentralized finance at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Secure Transactions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Advanced blockchain security</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">User Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Complete user transaction control</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Admin Controls</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Monitor and manage all activities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Access Your Account</CardTitle>
              <CardDescription>
                Sign in or create a new account to get started
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">Or</span>
                      </div>
                    </div>

                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full h-11"
                      onClick={adminLogin}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Quick Admin Login
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        required
                        className="h-11"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Admin credentials: username "admin", password "admin@123"
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}