'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Users, TrendingUp, ArrowRight, Loader2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    // Check localStorage for theme preference on client side only
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        const isDark = savedTheme === 'dark';
        setDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Default to dark mode
        setDarkMode(true);
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    
try {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('Sign In Data:', formData);
} catch {
  setError('Invalid email or password. Please try again.');
} finally {
  setIsLoading(false);
}
  };

  const navigateToSignUp = () => {
    router.push('/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
    } flex items-center justify-center p-4 relative`}>
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="sm"
        className={`absolute top-4 right-4 z-50 transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
        }`}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <div className={`absolute inset-0 opacity-30 ${
        darkMode 
          ? "bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
          : "bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
      }`}></div>
      
      <div className={`w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${
        darkMode 
          ? 'bg-black/40 backdrop-blur-lg border-gray-800' 
          : 'bg-white/80 backdrop-blur-lg border-gray-200'
      }`}>
        <div className={`hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 to-black' 
            : 'bg-gradient-to-br from-blue-600 to-blue-800'
        }`}>
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 ${
            darkMode ? 'bg-white/5' : 'bg-white/10'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 ${
            darkMode ? 'bg-white/5' : 'bg-white/10'
          }`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="flex items-center">
                <span className="text-white font-bold text-2xl tracking-wide">
                  ROSTER<span className="text-red-500">RUMBLE</span>
                </span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome Back, Champion
            </h2>
            <p className={`text-lg leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-blue-100'
            }`}>
              Sign in to continue your journey to fantasy sports greatness and compete for real cash prizes.
            </p>
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
                  darkMode ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-semibold">10M+</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-100'}`}>Active Players</p>
              </div>
              <div className="text-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
                  darkMode ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-semibold">₹5000Cr+</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-100'}`}>Prize Pool</p>
              </div>
            </div>
          </div>
        </div>

  
        <div className="w-full lg:w-1/2 p-2 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
       
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="flex items-center">
                <span className={`font-bold text-2xl tracking-wide ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ROSTER<span className="text-red-500">RUMBLE</span>
                </span>
              </div>
            </div>

            <Card className={`transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-900/50 border-gray-800 backdrop-blur-sm' 
                : 'bg-white/70 border-gray-200 backdrop-blur-sm'
            }`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Back
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert className={`${
                    darkMode 
                      ? 'bg-red-500/10 border-red-500/20' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <AlertDescription className={darkMode ? 'text-red-400' : 'text-red-600'}>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-12 transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className={`h-5 w-5 transition-colors ${
                          darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`} />
                      ) : (
                        <Eye className={`h-5 w-5 transition-colors ${
                          darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`} />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setFormData(prev => ({ ...prev, rememberMe: isChecked }));
                      }}
                      className={`transition-colors ${
                        darkMode 
                          ? 'border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600' 
                          : 'border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                      }`}
                    />
                    <Label 
                      htmlFor="rememberMe" 
                      className={`text-sm cursor-pointer transition-colors select-none ${
                        darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className={`p-0 h-auto transition-colors ${
                      darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>

              <CardFooter className="justify-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Don&apos;t have an account?{' '}
                  <Button
                    variant="link"
                    onClick={navigateToSignUp}
                    className={`p-0 h-auto font-medium transition-colors ${
                      darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Sign Up
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;