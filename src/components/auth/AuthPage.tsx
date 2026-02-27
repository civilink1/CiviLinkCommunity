import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Eye, EyeOff, Sparkles, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { mockUsers } from '../../lib/mockData';
import logo from '../../assets/logo.png';

interface AuthPageProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    unit: ''
  });

  // Real-time validation for signup
  const validatePassword = (password: string) => {
    if (!password) return '';
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return '';
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Update validation errors when password fields change
  const handlePasswordChange = (password: string) => {
    setSignupData({ ...signupData, password });
    const passwordError = validatePassword(password);
    const confirmError = signupData.confirmPassword
      ? validateConfirmPassword(signupData.confirmPassword, password)
      : '';
    setValidationErrors({ password: passwordError, confirmPassword: confirmError });
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setSignupData({ ...signupData, confirmPassword });
    const confirmError = validateConfirmPassword(confirmPassword, signupData.password);
    setValidationErrors({ ...validationErrors, confirmPassword: confirmError });
  };

  // Check if signup form is valid
  const isSignupValid = () => {
    return (
      signupData.name &&
      signupData.email &&
      signupData.password.length >= 6 &&
      signupData.password === signupData.confirmPassword &&
      !validationErrors.password &&
      !validationErrors.confirmPassword
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check for admin credentials
    if (loginEmail === 'civilink1357@gmail.com' && loginPassword === 'AryanVrinda1') {
      const adminUser = mockUsers.find(u => u.email === loginEmail);
      if (adminUser) {
        toast.success('Welcome back, Admin!');
        setTimeout(() => {
          setIsLoading(false);
          onLogin(adminUser);
        }, 300);
      }
      return;
    }

    // Check mock users
    const user = mockUsers.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(user);
      }, 300);
    } else {
      setIsLoading(false);
      toast.error('Invalid email or password');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setIsLoading(false);
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setIsLoading(false);
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Check if email already exists
    if (mockUsers.find(u => u.email === signupData.email)) {
      setIsLoading(false);
      toast.error('Email already registered');
      return;
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email: signupData.email,
      password: signupData.password,
      name: signupData.name,
      role: 'RESIDENT' as const,
      communityId: 'comm-1',
      approvalStatus: 'APPROVED' as const,
      unit: signupData.unit || undefined,
      joinDate: new Date().toISOString().split('T')[0],
      contributionScore: 0,
      badges: []
    };

    mockUsers.push(newUser);
    toast.success('Account created successfully!');
    setTimeout(() => {
      setIsLoading(false);
      onLogin(newUser);
    }, 300);
  };

  const benefits = [
    'Report neighborhood issues instantly',
    'Track resolutions in real-time',
    'Connect with your HOA board',
    'Earn contribution points'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden relative">
      {/* Back Button */}
      {onBack && (
        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding & Info */}
            <motion.div
              className="hidden lg:block space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <img src={logo} alt="CiviLink" className="h-12" />
              </div>

              <div>
                {/* "Join the Movement" badge removed for better visual hierarchy */}
                <h1 className="text-5xl mb-4">
                  Welcome to
                  <br />
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CiviLink Community
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                  Your voice matters. Connect with your neighborhood and keep it running smoothly.
                </p>
              </div>

              {/* Benefits */}
              <Card className="bg-white/60 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Why Join CiviLink Community?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Stats */}
              {/* ... remove this code ... */}
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-2 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                    <img src={logo} alt="CiviLink Logo" className="w-full h-full" />
                  </div>
                  <CardTitle className="text-3xl">Welcome</CardTitle>
                  <CardDescription>
                    Sign in to continue or create your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="login-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              required
                              className="h-11 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                          size="lg"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input
                            id="signup-name"
                            placeholder="Enter your full name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              value={signupData.password}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
                              required
                              className="h-11 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">
                              {validationErrors.password}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              value={signupData.confirmPassword}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                              required
                              className="h-11 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {validationErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {validationErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit">Unit / Lot # (optional)</Label>
                          <Input
                            id="unit"
                            placeholder="e.g., Unit 4B or Lot 12"
                            value={signupData.unit}
                            onChange={(e) => setSignupData({ ...signupData, unit: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                          size="lg"
                          disabled={isLoading || !isSignupValid()}
                        >
                          {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}