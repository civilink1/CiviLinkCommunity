import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { FormattedInput } from '../ui/FormattedInput';
import { Check, Building2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { PLAN_TIERS } from '../../config/constants';
import logo from '../../assets/logo.png';

interface OnboardingPageProps {
  onComplete: (communityName: string, plan: string) => void;
  onBack: () => void;
}

const darkInput = 'bg-slate-700/70 border-slate-500/50 text-white placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30';

export function OnboardingPage({ onComplete, onBack }: OnboardingPageProps) {
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [communityName, setCommunityName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [homeCount, setHomeCount] = useState('');

  const handleSubmit = () => {
    if (adminPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    if (adminPassword.length < 8) {
      setPwError('Password must be at least 8 characters.');
      return;
    }
    setPwError('');
    if (!communityName || !adminName || !adminEmail || !adminPassword) return;
    // TODO: POST to backend /api/communities to create community + admin account
    onComplete(communityName, selectedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={step === 'details' ? () => setStep('plan') : onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold text-lg">Community Setup</span>
        <span className="ml-auto text-sm text-slate-500">
          Step {step === 'plan' ? '1' : '2'} of 2
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          {step === 'plan' ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
                <p className="text-slate-400">Select a plan based on the number of homes in your community.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PLAN_TIERS.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedPlan === plan.id
                        ? 'border-2 border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 bg-slate-800/80 hover:border-slate-400'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white">{plan.name}</CardTitle>
                        {selectedPlan === plan.id && (
                          <Badge className="bg-blue-500 text-white">Selected</Badge>
                        )}
                      </div>
                      <div className="mt-1">
                        {plan.customPricing ? (
                          <span className="text-3xl font-bold text-white">Custom</span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-white">${plan.price}</span>
                            <span className="text-slate-300 text-sm">/month</span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" onClick={() => setStep('details')} className="gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Card className="border-slate-600 bg-slate-800/90 max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Community Details
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Set up your HOA community and admin account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Community name */}
                <div className="space-y-1.5">
                  <Label htmlFor="communityName" className="text-slate-200">Community / HOA Name</Label>
                  <Input
                    id="communityName"
                    placeholder="e.g. Sunset Ridge HOA"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    className={darkInput}
                  />
                </div>

                {/* Home count */}
                <div className="space-y-1.5">
                  <Label htmlFor="homeCount" className="text-slate-200">Number of Homes</Label>
                  <FormattedInput
                    id="homeCount"
                    format="digits"
                    maxDigits={4}
                    placeholder="e.g. 96"
                    value={homeCount}
                    onChange={(formatted) => setHomeCount(formatted)}
                    className={darkInput}
                  />
                </div>

                {/* Admin name */}
                <div className="space-y-1.5">
                  <Label htmlFor="adminName" className="text-slate-200">Your Name (Admin)</Label>
                  <Input
                    id="adminName"
                    placeholder="Full name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className={darkInput}
                  />
                </div>

                {/* Admin email */}
                <div className="space-y-1.5">
                  <Label htmlFor="adminEmail" className="text-slate-200">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@yourhoa.org"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className={darkInput}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="adminPassword" className="text-slate-200">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Min 8 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className={darkInput}
                  />
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }}
                    className={darkInput}
                  />
                  {pwError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {pwError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep('plan')} className="flex-1 border-slate-500 text-slate-200 bg-transparent hover:bg-white/10 hover:text-white">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!communityName || !adminName || !adminEmail || !adminPassword || !confirmPassword}
                    className="flex-1"
                  >
                    Continue to Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

