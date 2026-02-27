import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Clock, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

interface PendingApprovalPageProps {
  onBack: () => void;
}

export function PendingApprovalPage({ onBack }: PendingApprovalPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={logo} alt="CiviLink Community" className="h-8" />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-amber-500/30 bg-amber-500/5 max-w-md text-center">
            <CardContent className="py-12 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Awaiting Approval</h2>
              <p className="text-gray-400 leading-relaxed">
                Your account has been created, but your HOA requires manual approval
                for new residents. An admin will review your request shortly.
              </p>
              <p className="text-sm text-gray-500">
                You'll receive an email once you've been approved.
              </p>
              <Button variant="outline" onClick={onBack} className="mt-4">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
