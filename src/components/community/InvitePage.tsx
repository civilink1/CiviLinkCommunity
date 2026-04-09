import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Copy, Share2, Check, ArrowRight, UserPlus, Key, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { mockCommunity } from '../../lib/mockData';
import logo from '../../assets/logo.png';

interface InvitePageProps {
  communityName: string;
  inviteCode?: string;
  onContinue: () => void;
}

export function InvitePage({ communityName, inviteCode: inviteCodeProp, onContinue }: InvitePageProps) {
  const [inviteCode] = useState(inviteCodeProp || mockCommunity.inviteCode);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Join ${communityName} on CiviLink Community! Use invite code: ${inviteCode}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Join our community', text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold">CiviLink Community</span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-4"
        >
          {/* Main invite card */}
          <div className="backdrop-blur-[14px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-xl px-8 py-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-extralight tracking-[-0.02em] text-white">Your Community is Ready!</h2>
              <p className="text-white/50 text-sm mt-1">{communityName}</p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Code box */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
              <p className="text-[11px] font-medium text-cyan-400 uppercase tracking-widest mb-2">Invite Code</p>
              <p className="text-3xl font-mono font-bold tracking-[0.25em] text-white select-all">
                {inviteCode}
              </p>
            </div>

            {/* Copy + Share */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-xl font-semibold text-[14px] transition bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="h-4 w-4 text-cyan-400" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl font-semibold text-[14px] transition bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="w-full py-2.5 rounded-xl font-semibold text-[14px] transition bg-cyan-400 hover:bg-cyan-300 text-slate-900 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* How it works */}
          <div className="backdrop-blur-[14px] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 space-y-3">
            <p className="text-[11px] font-medium text-cyan-400 uppercase tracking-widest">How residents join</p>
            {[
              { icon: Key, label: 'Resident visits the Join page and enters this invite code.' },
              { icon: UserPlus, label: 'They fill in their name, email, phone, and address.' },
              { icon: CheckCircle2, label: 'Once approved, they can browse and submit reports.' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <p className="text-sm text-white/70 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}