import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Lock, ShieldCheck, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../../assets/logo.png';

interface BillingPageProps {
  planName: string;
  onComplete: () => void;
  onBack: () => void;
}

export function BillingPage({ planName, onComplete, onBack }: BillingPageProps) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1400);
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete();
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
      setCompleting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
          <img src={logo} alt="CiviLink Community" className="h-8" />
          <span className="text-white font-semibold">CiviLink Community</span>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full max-w-sm"
          >
            <div className="backdrop-blur-[14px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-xl px-8 py-8 text-center space-y-6">
              <div>
                <h2 className="text-3xl font-extralight tracking-[-0.02em] text-white mb-1">Payment Successful!</h2>
                <p className="text-white/50 text-sm">
                  Your <span className="text-cyan-400 font-medium capitalize">{planName}</span> plan is now active.
                </p>
                <p className="text-white/30 text-xs mt-1">A confirmation email is on its way.</p>
              </div>
              <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-300 text-sm font-medium capitalize">{planName} Plan Active</span>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full py-2.5 rounded-xl font-semibold text-[14px] transition bg-cyan-400 hover:bg-cyan-300 text-slate-900 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {completing
                    ? <><RefreshCw className="h-4 w-4 animate-spin" /> Setting up…</>
                    : <>View Invite Code <ArrowRight className="h-4 w-4" /></>}
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full py-2.5 rounded-xl font-semibold text-[14px] transition bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold">Checkout</span>
      </header>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="backdrop-blur-[14px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-xl px-8 py-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-extralight tracking-[-0.02em] text-white">Complete Your Purchase</h2>
              <p className="text-white/50 text-sm mt-1">
                Subscribing to the <span className="text-cyan-400 font-medium capitalize">{planName}</span> plan.
              </p>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="space-y-1">
              {[
                { icon: ShieldCheck, text: 'Secure, encrypted payment via Stripe' },
                { icon: RefreshCw, text: 'Cancel or change plan at any time' },
                { icon: Lock, text: 'No card details stored on our servers' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
                  <Icon className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handlePay}
              disabled={processing}
              className="w-full py-2.5 rounded-xl font-semibold text-[14px] transition bg-cyan-400 hover:bg-cyan-300 text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Redirecting to Stripe…</>
              ) : (
                <><Lock className="h-4 w-4" /> Continue to Stripe Checkout</>
              )}
            </button>
            <p className="text-center text-xs text-white/30">
              Payments processed securely by Stripe. We never see your card.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
