import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Copy, Share2, Check, ArrowRight, UserPlus, Key, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { mockCommunity } from '../../lib/mockData';
import logo from '../../assets/logo.png';

interface InvitePageProps {
  communityName: string;
  onContinue: () => void;
}

export function InvitePage({ communityName, onContinue }: InvitePageProps) {
  const [inviteCode] = useState(mockCommunity.inviteCode);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold text-lg">Your Community is Ready</span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Invite code card */}
          <Card className="border-slate-600 bg-slate-800/90">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-white text-2xl">
                🎉 {communityName}
              </CardTitle>
              <CardDescription className="text-slate-300">
                Share this invite code with your residents so they can join.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Code display */}
              <div className="bg-slate-900/70 border border-slate-600 rounded-xl p-6 text-center">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Invite Code</p>
                <p className="text-4xl font-mono font-bold tracking-[0.3em] text-white select-all">
                  {inviteCode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2 border-slate-500 text-slate-200 bg-slate-700/60 hover:bg-slate-600 hover:text-white">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1 gap-2 border-slate-500 text-slate-200 bg-slate-700/60 hover:bg-slate-600 hover:text-white">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>

              <Button size="lg" onClick={onContinue} className="w-full gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="border-slate-600 bg-slate-800/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">How residents join</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: Key, label: 'Resident visits the Join page and enters this invite code.' },
                { icon: UserPlus, label: 'They fill in their name, email, phone, and address.' },
                { icon: CheckCircle2, label: 'Once approved, they can browse and submit reports.' },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-200 leading-snug">{label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}