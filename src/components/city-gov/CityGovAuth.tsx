import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building2, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../../assets/logo.png';

interface CityGovAuthProps {
  onBack: () => void;
  onSuccess: (cityName: string) => void;
}

export function CityGovAuth({ onBack, onSuccess }: CityGovAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    email?: string;
  }>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cityName: '',
    state: '',
    department: '',
    officialTitle: '',
    contactPhone: ''
  });

  const positions = [
    'Mayor',
    'Commissioner',
    'Infrastructure Department',
    'Transportation Department',
    'Parks & Recreation',
    'Public Safety',
    'Commerce Department',
    'Other'
  ];

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Real-time validation
  const validatePassword = (password: string) => {
    if (!password) return '';
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email) return '';
    // Check if it's a government email
    if (!email.endsWith('.gov') && !email.includes('.gov.')) {
      return 'Must be an official government email address';
    }
    return '';
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    const passwordError = validatePassword(password);
    setValidationErrors({ ...validationErrors, password: passwordError });
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    const emailError = validateEmail(email);
    setValidationErrors({ ...validationErrors, email: emailError });
  };

  // Check if forms are valid
  const isStep1Valid = () => {
    return (
      formData.cityName &&
      formData.state &&
      formData.email &&
      formData.password.length >= 6 &&
      !validationErrors.password &&
      !validationErrors.email
    );
  };

  const isStep2Valid = () => {
    return (
      formData.name &&
      formData.department &&
      formData.officialTitle &&
      formData.contactPhone
    );
  };

  const isLoginValid = () => {
    return formData.email && formData.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp && step === 1) {
      // Validate before moving to step 2
      if (!isStep1Valid()) {
        setIsLoading(false);
        toast.error('Please fix the errors before continuing');
        return;
      }
      // Move to step 2
      setStep(2);
      setIsLoading(false);
      return;
    }

    if (isSignUp && step === 2) {
      // Create account and go directly to dashboard
      toast.success('Account created successfully!');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(formData.cityName);
      }, 1000);
      return;
    }

    // Login flow
    if (!isSignUp) {
      if (formData.email && formData.password) {
        toast.success('Logged in successfully!');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(formData.cityName || 'San Francisco');
        }, 1000);
      } else {
        setIsLoading(false);
        toast.error('Please enter your credentials');
      }
    }
  };

  const benefits = [
    'Real-time issue tracking and analytics',
    'Heat maps showing problem areas',
    'Direct citizen engagement metrics',
    'Priority ranking by community support',
    'Category-based filtering and sorting',
    'Export reports for city planning'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Info */}
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
              <h1 className="text-5xl mb-4">
                City Government
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Portal
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Gain comprehensive insights into your community's needs and priorities
              </p>
            </div>

            <Card className="bg-white/60 backdrop-blur-sm border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  What You Get
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
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-2 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  {isSignUp ? 'City Government Sign Up' : 'Government Portal Login'}
                </CardTitle>
                <CardDescription>
                  {isSignUp
                    ? step === 1
                      ? 'Create your city government account'
                      : 'Complete your account details'
                    : 'Access your city dashboard'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp ? (
                    step === 1 ? (
                      // Sign Up - Step 1: Basic Info
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Enter your city"
                            value={formData.cityName}
                            onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData({ ...formData, state: value })}
                            required
                          >
                            <SelectTrigger id="state" className="h-11">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                              {usStates.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Official Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="official@city.gov"
                            value={formData.email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Must be an official government email address
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a secure password"
                            value={formData.password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            required
                          />
                          {validationErrors.password && (
                            <p className="text-xs text-red-500">{validationErrors.password}</p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          Continue
                        </Button>
                      </>
                    ) : (
                      // Sign Up - Step 2: Verification
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department">Position</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                            required
                          >
                            <SelectTrigger id="department" className="h-11">
                              <SelectValue placeholder="Select your position" />
                            </SelectTrigger>
                            <SelectContent>
                              {positions.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title">Official Title</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Director, Manager, Coordinator"
                            value={formData.officialTitle}
                            onChange={(e) => setFormData({ ...formData, officialTitle: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            required
                            className="h-11"
                          />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          Create Account
                        </Button>
                      </>
                    )
                  ) : (
                    // Login Form
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="official@city.gov"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        Login to Portal
                      </Button>
                    </>
                  )}

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setStep(1);
                        setFormData({
                          name: '',
                          email: '',
                          password: '',
                          cityName: '',
                          state: '',
                          department: '',
                          officialTitle: '',
                          contactPhone: ''
                        });
                      }}
                    >
                      {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign up'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}