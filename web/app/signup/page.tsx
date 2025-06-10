'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Users, TrendingUp, ArrowRight, Loader2, Check, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  useEffect(() => {
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
    if (success) setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email) {
      setError('Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    
 try {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Sign Up Data:', {
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password
  });
  
  setSuccess('Account created successfully! Please check your email to verify your account.');
  
} catch {
  setError('Failed to create account. Please try again.');
} finally {
  setIsLoading(false);
}
  };

  const navigateToSignIn = () => {
    router.push('/signin');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const getPasswordStrength = (): PasswordStrength => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { 
      strength: 1, 
      text: 'Weak', 
      color: darkMode ? 'text-red-400' : 'text-red-500' 
    };
    if (password.length < 8) return { 
      strength: 2, 
      text: 'Fair', 
      color: darkMode ? 'text-yellow-400' : 'text-yellow-600' 
    };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { 
        strength: 4, 
        text: 'Strong', 
        color: darkMode ? 'text-green-400' : 'text-green-600' 
      };
    }
    return { 
      strength: 3, 
      text: 'Good', 
      color: darkMode ? 'text-blue-400' : 'text-blue-600' 
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
    } flex items-center justify-center p-4 relative`}>
      
      {/* Theme Toggle */}
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
      
      <div className={`w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${
        darkMode 
          ? 'bg-black/40 backdrop-blur-lg border-gray-800' 
          : 'bg-white/80 backdrop-blur-lg border-gray-200'
      }`}>
        
   
        <div className={`hidden lg:flex lg:w-2/5 p-12 flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
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
            <div className="flex items-center space-x-3 mb-8 ">
              <div className="flex items-center">
                <span className="text-white font-bold text-2xl tracking-wide">
                  ROSTER<span className="text-red-500">RUMBLE</span>
                </span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Join the Championship
            </h2>
            <p className={`text-lg leading-relaxed mb-6 ${
              darkMode ? 'text-gray-300' : 'text-blue-100'
            }`}>
              Create your account and start building winning fantasy teams with real cash prizes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className={darkMode ? 'text-gray-300' : 'text-blue-100'}>
                  Free to join & play practice games
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className={darkMode ? 'text-gray-300' : 'text-blue-100'}>
                  Win real cash prizes daily
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className={darkMode ? 'text-gray-300' : 'text-blue-100'}>
                  Expert analysis & insights
                </span>
              </div>
            </div>
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

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-3/5 p-2 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
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
                  Create Account
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Join millions of players and start winning today
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
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

                {success && (
                  <Alert className={`${
                    darkMode 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <AlertDescription className={darkMode ? 'text-green-400' : 'text-green-600'}>
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pl-10 transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
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
                  {formData.password && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              level <= passwordStrength.strength
                                ? passwordStrength.strength === 1
                                  ? 'bg-red-400'
                                  : passwordStrength.strength === 2
                                  ? 'bg-yellow-400'
                                  : passwordStrength.strength === 3
                                  ? 'bg-blue-400'
                                  : 'bg-green-400'
                                : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs transition-colors ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-12 transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={toggleConfirmPasswordVisibility}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
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

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      setFormData(prev => ({ ...prev, agreeToTerms: isChecked }));
                    }}
                    className={`mt-1 transition-colors ${
                      darkMode 
                        ? 'border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600' 
                        : 'border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                    }`}
                  />
                  <Label 
                    htmlFor="agreeToTerms" 
                    className={`text-sm leading-relaxed cursor-pointer transition-colors select-none ${
                      darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    I agree to the{' '}
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto transition-colors ${
                        darkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle terms link click
                        console.log('Terms of Service clicked');
                      }}
                    >
                      Terms of Service
                    </Button>
                    {' '}and{' '}
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto transition-colors ${
                        darkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                      }}
                    >
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>

              <CardFooter className="justify-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    onClick={navigateToSignIn}
                    className={`p-0 h-auto font-medium transition-colors ${
                      darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Sign In
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

export default SignUpPage;