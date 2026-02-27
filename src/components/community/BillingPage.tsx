import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Lock, Check, ArrowLeft, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/logo.png';

interface BillingPageProps {
  planName: string;
  onComplete: () => void;
  onBack: () => void;
}

/**
 * Stripe Checkout Placeholder
 * TODO: Replace handlePay with real Stripe Checkout Session redirect:
 *   const { url } = await fetch('/api/stripe/create-session', {
 *     method: 'POST', body: JSON.stringify({ plan: planName })
 *   }).then(r => r.json());
 *   window.location.href = url;
 */
export function BillingPage({ planName, onComplete, onBack }: BillingPageProps) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1400);
  };

  // ── Payment Success ─────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
        <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
          <img src={logo} alt="CiviLink Community" className="h-8" />
          <span className="text-white font-semibold text-lg">CiviLink Community</span>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="w-full max-w-md"
          >
            <Card className="border-green-500/40 bg-slate-800/90 text-center shadow-xl">
              <CardContent className="py-10 px-8 space-y-6">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>

                {/* Text */}
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-bold text-white">Payment Successful</h2>
                  <p className="text-slate-300 text-sm">
                    Your <span className="font-semibold text-green-400 capitalize">{planName}</span> plan is now active.
                  </p>
                  <p className="text-slate-400 text-xs">A confirmation email is on its way.</p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Actions */}
                <div className="space-y-2.5">
                  <Button onClick={onComplete} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Invite Code
                  </Button>
                  <Button
                    onClick={onComplete}
                    size="lg"
                    variant="outline"
                    className="w-full border-slate-500 text-slate-200 bg-transparent hover:bg-white/10 hover:text-white"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Checkout ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold text-lg">Checkout</span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl">Checkout (Stripe)</CardTitle>
                <Badge variant="secondary" className="bg-white/10 text-slate-200 capitalize">
                  {planName} Plan
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                You will complete payment securely with Stripe.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2.5">
                {[
                  'Secure, encrypted payment via Stripe',
                  'Cancel or change plan at any time',
                  'No card details stored on our servers',
                ].map((line) => (
                  <div key={line} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 flex-shrink-0 text-blue-400" />
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="h-3 w-3 flex-shrink-0" />
                Payments are processed securely by Stripe. We never see or store your card.
              </div>

              <Button onClick={handlePay} disabled={processing} className="w-full" size="lg">
                {processing ? 'Redirecting to Stripe…' : 'Continue to Stripe Checkout'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
