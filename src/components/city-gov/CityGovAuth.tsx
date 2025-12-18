import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building2, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import logo from 'figma:asset/e0850b95def2b76d7623aebb6fd341e7597812e1.png';

interface CityGovAuthProps {
  onBack: () => void;
  onSuccess: (cityName: string) => void;
}

export function CityGovAuth({ onBack, onSuccess }: CityGovAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    cityName: '',
    state: '',
    department: '',
    officialTitle: '',
    contactPhone: ''
  });

  const cities = [
    'San Francisco',
    'Los Angeles',
    'San Diego',
    'Sacramento',
    'Oakland',
    'San Jose'
  ];

  const states = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'
  ];

  const departments = [
    'Mayor & Mayor Pro Tem',
    'Infrastructure Department',
    'Transportation Department',
    'Parks & Recreation',
    'Public Safety',
    'Commerce Department'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && step === 1) {
      // Move to verification step
      setStep(2);
      return;
    }

    if (isSignUp) {
      toast.success('Application submitted! You will receive verification within 24-48 hours.');
      setTimeout(() => {
        onSuccess(formData.cityName);
      }, 1500);
    } else {
      // Simple login
      if (formData.email && formData.password) {
        toast.success('Logged in successfully!');
        onSuccess(formData.cityName || 'San Francisco');
      } else {
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
                      : 'Complete your verification details'
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
                          <Select
                            value={formData.cityName}
                            onValueChange={(value) => setFormData({ ...formData, cityName: value })}
                            required
                          >
                            <SelectTrigger id="city">
                              <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData({ ...formData, state: value })}
                            required
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map(state => (
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
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          Continue to Verification
                        </Button>
                      </>
                    ) : (
                      // Sign Up - Step 2: Verification
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                            required
                          >
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
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
                          />
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>Verification Process:</strong> Your application will be reviewed by our team. 
                            You'll receive access within 24-48 hours after verification.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </Button>
                          <Button type="submit" className="w-full" size="lg">
                            Submit Application
                          </Button>
                        </div>
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

                      <Button type="submit" className="w-full" size="lg">
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