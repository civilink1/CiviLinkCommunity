import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormattedInput } from '../ui/FormattedInput';
import { KeyRound, UserPlus, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { register } from '../../services/auth.service';
import type { User } from '../../types';
import logo from '../../assets/logo.png';

interface JoinPageProps {
  onJoined: (user: User) => void;
  onBack: () => void;
  onPendingApproval: () => void;
}

const darkInput = 'bg-slate-700 border-slate-500 text-white placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30';

export function JoinPage({ onJoined, onBack, onPendingApproval }: JoinPageProps) {
  const [step, setStep] = useState<'info' | 'code'>('info');

  // Step A – resident info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');

  // Step B – invite code
  const [inviteCode, setInviteCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [joining, setJoining] = useState(false);

  const stepAComplete = name.trim() && email.trim() && phone.trim() && address.trim() && password.length >= 8;

  const handleNextStep = () => {
    if (password !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setPwError('Password must be at least 8 characters.');
      return;
    }
    setPwError('');
    setStep('code');
  };

  const handleJoin = async () => {
    setCodeError('');
    setJoining(true);
    const result = await register({
      name,
      email,
      password,
      inviteCode,
      unit: unit || undefined,
      phone,
      address,
    });
    if (!result.success || !result.data) {
      setCodeError(result.error || 'Could not join. Please try again.');
      setJoining(false);
      return;
    }
    const { user } = result.data;
    if (user.approvalStatus === 'PENDING') {
      toast.info('Your account is pending admin approval.');
      onPendingApproval();
    } else {
      toast.success('Welcome to ' + (user.city || 'your community') + '!');
      onJoined(user);
    }
    setJoining(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={step === 'code' ? () => setStep('info') : onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold text-lg">Join Your Community</span>
        <span className="ml-auto text-sm font-medium text-slate-300 bg-white/10 px-3 py-1 rounded-full">
          Step {step === 'info' ? '1' : '2'} of 2
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 'info' ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg"
            >
              <Card className="border-slate-600 bg-slate-800/90">
                <CardHeader className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-2">
                    <UserPlus className="h-7 w-7 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Your Information</CardTitle>
                  <CardDescription className="text-slate-300">
                    Tell us about yourself before entering the invite code.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Full Name <span className="text-red-400">*</span></label>
                    <Input
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={darkInput}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Email <span className="text-red-400">*</span></label>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={darkInput}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Phone <span className="text-red-400">*</span></label>
                    <FormattedInput
                      format="phone"
                      placeholder="(555) 000-1234"
                      value={phone}
                      onChange={(formatted) => setPhone(formatted)}
                      className={darkInput}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Home Address <span className="text-red-400">*</span></label>
                    <Input
                      placeholder="123 Sunset Ridge Blvd"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={darkInput}
                    />
                  </div>

                  {/* Unit (optional) */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Unit / Lot # <span className="text-slate-400 text-xs">(optional)</span></label>
                    <Input
                      placeholder="e.g. Unit 14B"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className={darkInput}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Password <span className="text-red-400">*</span></label>
                    <Input
                      type="password"
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={darkInput}
                    />
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Confirm Password <span className="text-red-400">*</span></label>
                    <Input
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

                  <Button
                    onClick={handleNextStep}
                    disabled={!stepAComplete}
                    className="w-full gap-2"
                    size="lg"
                  >
                    Next: Enter Invite Code <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full max-w-md"
            >
              <Card className="border-slate-600 bg-slate-800/90">
                <CardHeader className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-2">
                    <KeyRound className="h-7 w-7 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Enter Invite Code</CardTitle>
                  <CardDescription className="text-slate-300">
                    Enter the invite code from your HOA admin.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-200">Invite Code</label>
                    <Input
                      placeholder="e.g. A3K9X2M7"
                      value={inviteCode}
                      onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setCodeError(''); }}
                      className={`text-center text-lg tracking-widest font-mono ${darkInput}`}
                    />
                    {codeError && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {codeError}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Contact your HOA administrator if you do not have a code.
                  </p>

                  <Button
                    onClick={handleJoin}
                    disabled={!inviteCode.trim() || joining}
                    className="w-full"
                    size="lg"
                  >
                    {joining ? 'Joining…' : 'Join Community'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
