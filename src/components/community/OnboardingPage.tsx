import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Building2, ArrowLeft, ArrowRight, AlertCircle, Mail, Lock, Eye, EyeOff, User, Hash, Loader } from 'lucide-react';
import { PLAN_TIERS } from '../../config/constants';
import { PricingCard } from '../ui/animated-glassy-pricing';
import logo from '../../assets/logo.png';
import { cn } from '../ui/utils';

interface AdminOnboardingData {
  communityName: string;
  plan: string;
  homeCount: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

interface OnboardingPageProps {
  onComplete: (data: AdminOnboardingData) => void;
  onBack: () => void;
}

// -- BlurFade
function BlurFade({ children, className, delay = 0, duration = 0.4, yOffset = 6, blur = '6px' }: {
  children: React.ReactNode; className?: string; delay?: number; duration?: number; yOffset?: number; blur?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ y: yOffset, opacity: 0, filter: `blur(${blur})` }}
      animate={inView ? { y: -yOffset, opacity: 1, filter: 'blur(0px)' } : undefined}
      transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
      className={className}>
      {children}
    </motion.div>
  );
}

// -- Glass CSS
const GlassStyles = () => (
  <style>{`
    @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
    @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
    .glass-input-wrap { position:relative; z-index:2; border-radius:9999px; }
    .glass-input { display:flex; position:relative; width:100%; align-items:center; gap:0.5rem; border-radius:9999px; padding:0.25rem;
      backdrop-filter:blur(clamp(1px,0.125em,4px)); transition:all 400ms cubic-bezier(0.25,1,0.5,1);
      background:linear-gradient(-75deg,oklch(from var(--background) l c h/5%),oklch(from var(--background) l c h/20%),oklch(from var(--background) l c h/5%));
      box-shadow:inset 0 .125em .125em oklch(from var(--foreground) l c h/5%),inset 0 -.125em .125em oklch(from var(--background) l c h/50%),0 .25em .125em -.125em oklch(from var(--foreground) l c h/20%),0 0 .1em .25em inset oklch(from var(--background) l c h/20%); }
    .glass-input-wrap:focus-within .glass-input { backdrop-filter:blur(0.01em);
      box-shadow:inset 0 .125em .125em oklch(from var(--foreground) l c h/5%),inset 0 -.125em .125em oklch(from var(--background) l c h/50%),0 .15em .05em -.1em oklch(from var(--foreground) l c h/25%),0 0 .05em .1em inset oklch(from var(--background) l c h/50%); }
    .glass-input::after { content:""; position:absolute; z-index:1; inset:0; border-radius:9999px;
      width:calc(100% + clamp(1px,.0625em,4px)); height:calc(100% + clamp(1px,.0625em,4px));
      top:calc(0% - clamp(1px,.0625em,4px)/2); left:calc(0% - clamp(1px,.0625em,4px)/2);
      padding:clamp(1px,.0625em,4px); box-sizing:border-box;
      background:conic-gradient(from var(--angle-1) at 50% 50%,oklch(from var(--foreground) l c h/50%) 0%,transparent 5% 40%,oklch(from var(--foreground) l c h/50%) 50%,transparent 60% 95%,oklch(from var(--foreground) l c h/50%) 100%),linear-gradient(180deg,oklch(from var(--background) l c h/50%),oklch(from var(--background) l c h/50%));
      mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); mask-composite:exclude;
      transition:all 400ms cubic-bezier(0.25,1,0.5,1),--angle-1 500ms ease;
      box-shadow:inset 0 0 0 calc(clamp(1px,.0625em,4px)/2) oklch(from var(--background) l c h/50%); pointer-events:none; }
    .glass-input-wrap:focus-within .glass-input::after { --angle-1:-125deg; }
    .glass-input-text-area { position:absolute; inset:0; border-radius:9999px; pointer-events:none; }
    .glass-input-text-area::after { content:""; display:block; position:absolute;
      width:calc(100% - clamp(1px,.0625em,4px)); height:calc(100% - clamp(1px,.0625em,4px));
      top:calc(clamp(1px,.0625em,4px)/2); left:calc(clamp(1px,.0625em,4px)/2);
      border-radius:9999px; overflow:clip;
      background:linear-gradient(var(--angle-2),transparent 0%,oklch(from var(--background) l c h/50%) 40% 50%,transparent 55%);
      z-index:3; mix-blend-mode:screen; pointer-events:none; background-size:200% 200%; background-position:0% 50%;
      transition:background-position 500ms cubic-bezier(0.25,1,0.5,1),--angle-2 500ms cubic-bezier(0.25,1,0.5,1); }
    .glass-input-wrap:focus-within .glass-input-text-area::after { background-position:25% 50%; }

    .glass-btn-wrap { position:relative; z-index:2; border-radius:9999px; cursor:pointer; }
    .glass-btn { all:unset; cursor:pointer; position:relative; z-index:10; border-radius:9999px;
      backdrop-filter:blur(clamp(1px,.125em,4px)); transition:all 400ms cubic-bezier(0.25,1,0.5,1);
      background:linear-gradient(-75deg,oklch(from var(--background) l c h/5%),oklch(from var(--background) l c h/20%),oklch(from var(--background) l c h/5%));
      box-shadow:inset 0 .125em .125em oklch(from var(--foreground) l c h/5%),inset 0 -.125em .125em oklch(from var(--background) l c h/50%),0 .25em .125em -.125em oklch(from var(--foreground) l c h/20%),0 0 .1em .25em inset oklch(from var(--background) l c h/20%); }
    .glass-btn:hover { transform:scale(0.975); backdrop-filter:blur(0.01em); }
    .glass-btn-text { display:block; position:relative; user-select:none; color:oklch(from var(--foreground) l c h/90%);
      text-shadow:0 .25em .05em oklch(from var(--foreground) l c h/10%); transition:all 400ms cubic-bezier(0.25,1,0.5,1); }
    .glass-btn::after { content:""; position:absolute; z-index:1; inset:0; border-radius:9999px;
      width:calc(100% + clamp(1px,.0625em,4px)); height:calc(100% + clamp(1px,.0625em,4px));
      top:calc(0% - clamp(1px,.0625em,4px)/2); left:calc(0% - clamp(1px,.0625em,4px)/2);
      padding:clamp(1px,.0625em,4px); box-sizing:border-box;
      background:conic-gradient(from var(--angle-1) at 50% 50%,oklch(from var(--foreground) l c h/50%) 0%,transparent 5% 40%,oklch(from var(--foreground) l c h/50%) 50%,transparent 60% 95%,oklch(from var(--foreground) l c h/50%) 100%),linear-gradient(180deg,oklch(from var(--background) l c h/50%),oklch(from var(--background) l c h/50%));
      mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); mask-composite:exclude;
      pointer-events:none; }

    input[type="password"]::-ms-reveal,input[type="password"]::-ms-clear{display:none!important}
    input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus{
      -webkit-box-shadow:0 0 0 30px transparent inset!important;-webkit-text-fill-color:var(--foreground)!important;
      background-color:transparent!important;transition:background-color 5000s ease-in-out 0s!important;}
  `}</style>
);

// -- Glass input component
function GlassInput({ icon: Icon, type = 'text', placeholder, value, onChange, onKeyDown, inputRef, rightSlot, maxLength }: {
  icon: React.ElementType; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>; rightSlot?: React.ReactNode; maxLength?: number;
}) {
  return (
    <div className="glass-input-wrap w-full">
      <div className="glass-input">
        <span className="glass-input-text-area" />
        <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
          <Icon className="h-5 w-5 text-foreground/80" />
        </div>
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          className="relative z-10 h-full w-0 flex-grow bg-transparent py-3 text-foreground placeholder:text-foreground/50 focus:outline-none"
        />
        {rightSlot}
      </div>
    </div>
  );
}

// -- Glass icon button
function GlassIconButton({ onClick, children, disabled }: {
  onClick?: () => void; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 transition-all text-white shadow-lg shadow-cyan-500/30 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

const planDescriptions: Record<string, string> = {
  starter: 'Perfect for small HOAs up to 100 homes.',
  standard: 'Great for growing communities.',
  premium: 'For large neighborhoods with more needs.',
  enterprise: 'Custom solutions for the biggest communities.',
};

const planButtonText: Record<string, string> = {
  starter: 'Get Started',
  standard: 'Choose Standard',
  premium: 'Choose Premium',
  enterprise: 'Contact Sales',
};

type DetailStep = 'community' | 'admin' | 'password';

export function OnboardingPage({ onComplete, onBack }: OnboardingPageProps) {
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [selectedPlan, setSelectedPlan] = useState('standard');

  // Detail sub-steps
  const [detailStep, setDetailStep] = useState<DetailStep>('community');
  const [communityName, setCommunityName] = useState('');
  const [homeCount, setHomeCount] = useState('');
  const [homeCountError, setHomeCountError] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const communityRef = useRef<HTMLInputElement>(null);
  const adminNameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const activePlan = PLAN_TIERS.find(p => p.id === selectedPlan) ?? PLAN_TIERS[1];
  const maxHomes = activePlan.homes;

  // Auto-focus on step change
  useEffect(() => {
    if (detailStep === 'community') setTimeout(() => communityRef.current?.focus(), 350);
    else if (detailStep === 'admin') setTimeout(() => adminNameRef.current?.focus(), 350);
    else if (detailStep === 'password') setTimeout(() => pwRef.current?.focus(), 350);
  }, [detailStep]);

  const handleHomeCountChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    setHomeCount(digits);
    const num = parseInt(digits, 10);
    if (digits && !activePlan.customPricing && num > maxHomes) {
      setHomeCountError(`Max ${maxHomes.toLocaleString()} homes on ${activePlan.name}. Change plan or lower the number.`);
    } else {
      setHomeCountError('');
    }
  };

  const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const canAdvanceCommunity = communityName.trim().length > 0 && homeCount.trim().length > 0 && !homeCountError;
  const canAdvanceAdmin = adminName.trim().length > 0 && validEmail(adminEmail);
  const canSubmit = adminPassword.length >= 8 && confirmPassword.length >= 8;

  const handleSubmit = () => {
    if (adminPassword !== confirmPassword) { return; }
    onComplete({ communityName, plan: selectedPlan, homeCount, adminName, adminEmail, adminPassword });
  };

  const enterKey = (next: () => void) => (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); next(); } };

  const detailStepIndex = detailStep === 'community' ? 0 : detailStep === 'admin' ? 1 : 2;
  const DETAIL_LABELS = ['Community', 'Your Info', 'Password'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2236] to-[#0f172a] flex flex-col" style={{ '--background': '#1a2236', '--foreground': '#e2e8f0' } as React.CSSProperties}>
      <GlassStyles />

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={step === 'details' && detailStep !== 'community' 
            ? () => setDetailStep(detailStep === 'password' ? 'admin' : 'community') 
            : step === 'details' ? () => setStep('plan') : onBack}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img src={logo} alt="CiviLink Community" className="h-8" />
        <span className="text-white font-semibold text-lg">Community Setup</span>
        <span className="ml-auto text-sm font-medium text-slate-300 bg-white/10 px-3 py-1 rounded-full">
          Step {step === 'plan' ? '1' : '2'} of 2
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* ===== PLAN SELECTION ===== */}
          {step === 'plan' ? (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-5xl"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-light text-white mb-2">Choose Your Plan</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                {PLAN_TIERS.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    planName={plan.name}
                    description={planDescriptions[plan.id] ?? ''}
                    price={plan.customPricing ? 'Custom' : String(plan.price)}
                    features={plan.features}
                    buttonText={planButtonText[plan.id] ?? 'Get Started'}
                    isPopular={plan.id === 'standard'}
                    buttonVariant={plan.id === 'standard' ? 'primary' : 'secondary'}
                    customPricing={plan.customPricing}
                    onButtonClick={() => { setSelectedPlan(plan.id); setDetailStep('community'); setStep('details'); }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* ===== DETAILS � SLIDE STEPS ===== */
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-[360px] flex flex-col items-center gap-6"
            >
              {/* Step indicator dots */}
              <div className="flex items-center gap-3">
                {DETAIL_LABELS.map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      i < detailStepIndex ? 'bg-cyan-400' : i === detailStepIndex ? 'bg-white w-6' : 'bg-white/30'
                    )} />
                  </div>
                ))}
              </div>

              {/* Title per step */}
              <AnimatePresence mode="wait">
                {detailStep === 'community' && (
                  <motion.div key="t-comm" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <BlurFade delay={0.1}><p className="font-light text-4xl tracking-tight text-white">Your community</p></BlurFade>
                    <BlurFade delay={0.2}><p className="text-sm text-white/50 mt-2">Name your HOA and tell us its size</p></BlurFade>
                  </motion.div>
                )}
                {detailStep === 'admin' && (
                  <motion.div key="t-admin" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <BlurFade delay={0}><p className="font-light text-4xl tracking-tight text-white">About you</p></BlurFade>
                    <BlurFade delay={0.1}><p className="text-sm text-white/50 mt-2">Admin name and email for your account</p></BlurFade>
                  </motion.div>
                )}
                {detailStep === 'password' && (
                  <motion.div key="t-pw" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <BlurFade delay={0}><p className="font-light text-4xl tracking-tight text-white">Secure it</p></BlurFade>
                    <BlurFade delay={0.1}><p className="text-sm text-white/50 mt-2">Create a password (min 8 characters)</p></BlurFade>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-full space-y-4">

                {/* Step: Community name + home count */}
                <AnimatePresence>
                  {detailStep === 'community' && (
                    <BlurFade key="s-comm" delay={0.25} className="w-full space-y-3">
                      <GlassInput icon={Building2} placeholder="Community / HOA Name" value={communityName}
                        onChange={setCommunityName} inputRef={communityRef}
                        onKeyDown={enterKey(() => {})} />
                      <GlassInput icon={Hash} placeholder={`Number of Homes${!activePlan.customPricing ? ` (max ${maxHomes.toLocaleString()})` : ''}`}
                        value={homeCount} onChange={handleHomeCountChange} maxLength={4}
                        onKeyDown={enterKey(() => { if (canAdvanceCommunity) setDetailStep('admin'); })}
                        rightSlot={canAdvanceCommunity ? (
                          <div className="relative z-10 flex-shrink-0 pr-1">
                            <GlassIconButton onClick={() => setDetailStep('admin')}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                          </div>
                        ) : undefined}
                      />
                      {homeCountError && (
                        <p className="text-xs text-red-400 flex items-start gap-1 px-2">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {homeCountError}
                        </p>
                      )}
                    </BlurFade>
                  )}
                </AnimatePresence>

                {/* Step: Admin name + email */}
                <AnimatePresence>
                  {detailStep === 'admin' && (
                    <BlurFade key="s-admin" className="w-full space-y-3">
                      <GlassInput icon={User} placeholder="Your Name (Admin)" value={adminName}
                        onChange={setAdminName} inputRef={adminNameRef}
                        onKeyDown={enterKey(() => {})} />
                      <GlassInput icon={Mail} type="email" placeholder="Admin Email" value={adminEmail}
                        onChange={setAdminEmail}
                        onKeyDown={enterKey(() => { if (canAdvanceAdmin) setDetailStep('password'); })}
                        rightSlot={canAdvanceAdmin ? (
                          <div className="relative z-10 flex-shrink-0 pr-1">
                            <GlassIconButton onClick={() => setDetailStep('password')}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                          </div>
                        ) : undefined}
                      />
                      <BlurFade delay={0.15}>
                        <button type="button" onClick={() => setDetailStep('community')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      </BlurFade>
                    </BlurFade>
                  )}
                </AnimatePresence>

                {/* Step: Password + confirm */}
                <AnimatePresence>
                  {detailStep === 'password' && (
                    <BlurFade key="s-pw" className="w-full space-y-3">
                      <GlassInput icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Password (min 8 characters)"
                        value={adminPassword} onChange={setAdminPassword} inputRef={pwRef}
                        onKeyDown={enterKey(() => {})}
                        rightSlot={adminPassword.length > 0 ? (
                          <button type="button" onClick={() => setShowPw(!showPw)} className="relative z-10 p-2 text-foreground/60 hover:text-foreground">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        ) : undefined}
                      />
                      <GlassInput icon={Lock} type={showCpw ? 'text' : 'password'} placeholder="Confirm Password"
                        value={confirmPassword} onChange={setConfirmPassword}
                        onKeyDown={enterKey(() => { if (canSubmit && adminPassword === confirmPassword) handleSubmit(); })}
                        rightSlot={
                          <div className="relative z-10 flex-shrink-0 pr-1 flex gap-1">
                            {confirmPassword.length > 0 && (
                              <button type="button" onClick={() => setShowCpw(!showCpw)} className="p-2 text-foreground/60 hover:text-foreground">
                                {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            )}
                            {canSubmit && (
                              <GlassIconButton onClick={handleSubmit}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                            )}
                          </div>
                        }
                      />
                      {adminPassword.length >= 1 && confirmPassword.length >= 1 && adminPassword !== confirmPassword && (
                        <p className="text-xs text-red-400 flex items-center gap-1 px-2">
                          <AlertCircle className="h-3 w-3" /> Passwords do not match
                        </p>
                      )}
                      <BlurFade delay={0.15}>
                        <button type="button" onClick={() => setDetailStep('admin')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      </BlurFade>
                    </BlurFade>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
