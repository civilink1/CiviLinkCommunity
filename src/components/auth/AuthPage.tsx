import { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, KeyRound, User, MapPin, Home, PartyPopper, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { login, register } from '../../services/auth.service';
import logo from '../../assets/logo.png';
import confetti from 'canvas-confetti';
import type { CreateTypes as ConfettiInstance, Options as ConfettiOptions, GlobalOptions as ConfettiGlobalOptions } from 'canvas-confetti';
import { cn } from '../ui/utils';

// -- Props
interface AuthPageProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

// -- Confetti helper
type ConfettiRef = { fire: (opts?: ConfettiOptions) => void } | null;

const ConfettiCanvas = forwardRef<ConfettiRef, React.ComponentPropsWithRef<'canvas'> & { options?: ConfettiOptions; globalOptions?: ConfettiGlobalOptions; manualstart?: boolean }>(
  (props, ref) => {
    const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, ...rest } = props;
    const instanceRef = useRef<ConfettiInstance | null>(null);
    const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
      if (node) { if (!instanceRef.current) instanceRef.current = confetti.create(node, { ...globalOptions, resize: true }); }
      else { instanceRef.current?.reset(); instanceRef.current = null; }
    }, [globalOptions]);
    const fire = useCallback((opts: ConfettiOptions = {}) => instanceRef.current?.({ ...options, ...opts }), [options]);
    const api = useMemo(() => ({ fire }), [fire]);
    useImperativeHandle(ref, () => api, [api]);
    useEffect(() => { if (!manualstart) fire(); }, [manualstart, fire]);
    return <canvas ref={canvasRef} {...rest} />;
  }
);
ConfettiCanvas.displayName = 'ConfettiCanvas';

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

// -- Glass CSS (injected once)
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

// -- Glass Input
function GlassInput({ icon: Icon, type = 'text', placeholder, value, onChange, onKeyDown, inputRef, rightSlot }: {
  icon: React.ElementType; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>; rightSlot?: React.ReactNode;
}) {
  return (
    <div className="glass-input-wrap w-full">
      <div className="glass-input">
        <span className="glass-input-text-area" />
        <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
          <Icon className="h-5 w-5 text-white/70" />
        </div>
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="relative z-10 h-full w-0 flex-grow bg-transparent py-3 text-white placeholder:text-white/40 focus:outline-none"
        />
        {rightSlot}
      </div>
    </div>
  );
}

// -- Arrow Button (cyan circle)
function GlassIconButton({ onClick, type = 'button', children, disabled }: {
  onClick?: () => void; type?: 'button' | 'submit'; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 transition-all text-white shadow-lg shadow-cyan-500/30 disabled:opacity-50"
    >
      {children}k
    </button>
  );
}



// -- Loading modal steps
const LOAD_STEPS = ['Signing you up...', 'Setting up your profile...', 'Almost there...'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // -- Sign in state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siStep, setSiStep] = useState<'email' | 'password'>('email');
  const [siShowPw, setSiShowPw] = useState(false);
  const [siLoading, setSiLoading] = useState(false);
  const siPwRef = useRef<HTMLInputElement>(null);

  // -- Sign up state (invite -> email -> info -> password)
  const [suStep, setSuStep] = useState<'code' | 'email' | 'info' | 'password'>('code');
  const [suCode, setSuCode] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suName, setSuName] = useState('');
  const [suAddress, setSuAddress] = useState('');
  const [suUnit, setSuUnit] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirmPw, setSuConfirmPw] = useState('');
  const [suShowPw, setSuShowPw] = useState(false);
  const [suShowCpw, setSuShowCpw] = useState(false);
  const suEmailRef = useRef<HTMLInputElement>(null);
  const suNameRef = useRef<HTMLInputElement>(null);
  const suPwRef = useRef<HTMLInputElement>(null);

  // -- Modal state
  const [modal, setModal] = useState<'closed' | 'loading' | 'success' | 'error'>('closed');
  const [modalMsg, setModalMsg] = useState('');
  const [loadStep, setLoadStep] = useState(0);
  const confettiRef = useRef<ConfettiRef>(null);

  const fireCannons = () => {
    const fire = confettiRef.current?.fire;
    if (!fire) return;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    fire({ ...defaults, particleCount: 50, origin: { x: 0, y: 1 }, angle: 60 });
    fire({ ...defaults, particleCount: 50, origin: { x: 1, y: 1 }, angle: 120 });
  };

  // Focus into newly revealed inputs
  useEffect(() => { if (siStep === 'password') setTimeout(() => siPwRef.current?.focus(), 350); }, [siStep]);
  useEffect(() => {
    if (suStep === 'email') setTimeout(() => suEmailRef.current?.focus(), 350);
    else if (suStep === 'info') setTimeout(() => suNameRef.current?.focus(), 350);
    else if (suStep === 'password') setTimeout(() => suPwRef.current?.focus(), 350);
  }, [suStep]);

  // -- Handlers
  const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSignIn = async () => {
    setSiLoading(true);
    const result = await login({ email: siEmail, password: siPassword });
    setSiLoading(false);
    if (!result.success || !result.data) {
      toast.error(result.error || 'Invalid email or password');
      return;
    }
    toast.success(`Welcome back, ${result.data.user.name}!`);
    onLogin(result.data.user);
  };

  const handleSignUp = async () => {
    if (suPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (suPassword !== suConfirmPw) { toast.error('Passwords do not match'); return; }

    setModal('loading');
    setLoadStep(0);
    const interval = setInterval(() => setLoadStep(s => Math.min(s + 1, LOAD_STEPS.length - 1)), 1200);

    const result = await register({
      name: suName,
      email: suEmail,
      password: suPassword,
      inviteCode: suCode,
      address: suAddress || undefined,
      unit: suUnit || undefined,
    });

    clearInterval(interval);

    if (!result.success || !result.data) {
      setModal('error');
      setModalMsg(result.error || 'Registration failed');
      return;
    }

    setModal('success');
    fireCannons();
    setTimeout(() => {
      setModal('closed');
      onLogin(result.data!.user);
    }, 2200);
  };

  const resetSignUp = () => { setSuStep('code'); setSuCode(''); setSuEmail(''); setSuName(''); setSuAddress(''); setSuUnit(''); setSuPassword(''); setSuConfirmPw(''); };

  const enterKey = (next: () => void) => (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); next(); } };

  // -- Render
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1a2236] to-[#0f172a] relative overflow-hidden" style={{ '--background': '#1a2236', '--foreground': '#e2e8f0' } as React.CSSProperties}>
      <GlassStyles />
      <ConfettiCanvas ref={confettiRef} manualstart className="fixed inset-0 w-full h-full pointer-events-none z-[999]" />

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        {onBack ? (
          <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : <div />}
        <img src={logo} alt="CiviLink" className="h-8" />
        <span className="font-semibold text-lg text-white">CiviLink</span>
      </header>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-[320px] flex flex-col items-center gap-6">

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            {(['signin', 'signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); if (t === 'signin') { setSiStep('email'); setSiEmail(''); setSiPassword(''); } else resetSignUp(); }}
                className={cn('px-5 py-2 rounded-full text-sm font-semibold transition-all',
                  tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-white/60 hover:text-white')}>
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* SIGN IN */}
          <AnimatePresence mode="wait">
            {tab === 'signin' && (
              <motion.div key="si" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-6">

                <AnimatePresence mode="wait">
                  {siStep === 'email' && (
                    <motion.div key="si-title-email" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <BlurFade delay={0.1}><p className="font-light text-4xl tracking-tight text-white">Welcome back</p></BlurFade>
                      <BlurFade delay={0.2}><p className="text-sm text-white/50 mt-2">Enter your email to sign in</p></BlurFade>
                    </motion.div>
                  )}
                  {siStep === 'password' && (
                    <motion.div key="si-title-pw" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <BlurFade delay={0}><p className="font-light text-4xl tracking-tight text-white">Your password</p></BlurFade>
                      <BlurFade delay={0.1}><p className="text-sm text-white/50 mt-2 truncate max-w-[280px]">{siEmail}</p></BlurFade>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-full space-y-4">
                  <AnimatePresence>
                    {siStep === 'email' && (
                      <BlurFade key="si-email" delay={0.25} className="w-full">
                        <GlassInput icon={Mail} type="email" placeholder="Email" value={siEmail} onChange={setSiEmail}
                          onKeyDown={enterKey(() => { if (validEmail(siEmail)) setSiStep('password'); })}
                          rightSlot={validEmail(siEmail) ? (
                            <div className="relative z-10 flex-shrink-0 pr-1">
                              <GlassIconButton onClick={() => setSiStep('password')}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                            </div>
                          ) : undefined}
                        />
                      </BlurFade>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {siStep === 'password' && (
                      <BlurFade key="si-pw" className="w-full space-y-4">
                        <GlassInput icon={siShowPw ? EyeOff : Lock} type={siShowPw ? 'text' : 'password'} placeholder="Password" value={siPassword}
                          onChange={setSiPassword} inputRef={siPwRef}
                          onKeyDown={enterKey(() => { if (siPassword.length >= 1) handleSignIn(); })}
                          rightSlot={siPassword.length >= 1 ? (
                            <div className="relative z-10 flex-shrink-0 pr-1 flex gap-1">
                              <button type="button" onClick={() => setSiShowPw(!siShowPw)} className="p-2 text-white/60 hover:text-white">
                                {siShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <GlassIconButton onClick={handleSignIn} disabled={siLoading}>
                                {siLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                              </GlassIconButton>
                            </div>
                          ) : undefined}
                        />
                        <BlurFade delay={0.15}>
                          <button type="button" onClick={() => setSiStep('email')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Different email
                          </button>
                        </BlurFade>
                      </BlurFade>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* SIGN UP */}
            {tab === 'signup' && (
              <motion.div key="su" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center gap-6">

                <AnimatePresence mode="wait">
                  {suStep === 'code' && (
                    <motion.div key="su-t-code" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <BlurFade delay={0.1}><p className="font-light text-4xl tracking-tight text-white">Join your community</p></BlurFade>
                      <BlurFade delay={0.2}><p className="text-sm text-white/50 mt-2">Enter the invite code from your HOA admin</p></BlurFade>
                    </motion.div>
                  )}
                  {suStep === 'email' && (
                    <motion.div key="su-t-email" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <BlurFade delay={0}><p className="font-light text-4xl tracking-tight text-white">Your email</p></BlurFade>
                      <BlurFade delay={0.1}><p className="text-sm text-white/50 mt-2">We will use this to create your account</p></BlurFade>
                    </motion.div>
                  )}
                  {suStep === 'info' && (
                    <motion.div key="su-t-info" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <BlurFade delay={0}><p className="font-light text-4xl tracking-tight text-white">About you</p></BlurFade>
                      <BlurFade delay={0.1}><p className="text-sm text-white/50 mt-2">Your name and address for your community</p></BlurFade>
                    </motion.div>
                  )}
                  {suStep === 'password' && (
                    <motion.div key="su-t-pw" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <BlurFade delay={0}><p className="font-light text-4xl tracking-tight text-white">Secure your account</p></BlurFade>
                      <BlurFade delay={0.1}><p className="text-sm text-white/50 mt-2">Create a password (min 6 characters)</p></BlurFade>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-full space-y-4">

                  {/* Step: Invite Code */}
                  <AnimatePresence>
                    {suStep === 'code' && (
                      <BlurFade key="su-code" delay={0.25} className="w-full">
                        <GlassInput icon={KeyRound} placeholder="Invite Code (e.g. A3K9X2M7)" value={suCode}
                          onChange={v => setSuCode(v.toUpperCase())}
                          onKeyDown={enterKey(() => { if (suCode.trim().length >= 4) setSuStep('email'); })}
                          rightSlot={suCode.trim().length >= 4 ? (
                            <div className="relative z-10 flex-shrink-0 pr-1">
                              <GlassIconButton onClick={() => setSuStep('email')}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                            </div>
                          ) : undefined}
                        />
                      </BlurFade>
                    )}
                  </AnimatePresence>

                  {/* Step: Email */}
                  <AnimatePresence>
                    {suStep === 'email' && (
                      <BlurFade key="su-email" className="w-full space-y-4">
                        <GlassInput icon={Mail} type="email" placeholder="Email" value={suEmail} onChange={setSuEmail} inputRef={suEmailRef}
                          onKeyDown={enterKey(() => { if (validEmail(suEmail)) setSuStep('info'); })}
                          rightSlot={validEmail(suEmail) ? (
                            <div className="relative z-10 flex-shrink-0 pr-1">
                              <GlassIconButton onClick={() => setSuStep('info')}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                            </div>
                          ) : undefined}
                        />
                        <BlurFade delay={0.15}>
                          <button type="button" onClick={() => setSuStep('code')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                        </BlurFade>
                      </BlurFade>
                    )}
                  </AnimatePresence>

                  {/* Step: Name + Address + Unit */}
                  <AnimatePresence>
                    {suStep === 'info' && (
                      <BlurFade key="su-info" className="w-full space-y-3">
                        <GlassInput icon={User} placeholder="Full Name" value={suName} onChange={setSuName} inputRef={suNameRef}
                          onKeyDown={enterKey(() => {})} />
                        <GlassInput icon={MapPin} placeholder="Home Address" value={suAddress} onChange={setSuAddress}
                          onKeyDown={enterKey(() => {})} />
                        <GlassInput icon={Home} placeholder="Unit / Lot # (optional)" value={suUnit} onChange={setSuUnit}
                          onKeyDown={enterKey(() => { if (suName.trim() && suAddress.trim()) setSuStep('password'); })} />
                        <div className="flex items-center justify-between pt-1">
                          <button type="button" onClick={() => setSuStep('email')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          {suName.trim() && suAddress.trim() && (
                            <button type="button" onClick={() => setSuStep('password')}
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 transition-all text-white text-sm font-semibold shadow-lg shadow-cyan-500/30">
                              Continue <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </BlurFade>
                    )}
                  </AnimatePresence>

                  {/* Step: Password + Confirm */}
                  <AnimatePresence>
                    {suStep === 'password' && (
                      <BlurFade key="su-pw" className="w-full space-y-3">
                        <GlassInput icon={Lock} type={suShowPw ? 'text' : 'password'} placeholder="Password" value={suPassword}
                          onChange={setSuPassword} inputRef={suPwRef}
                          onKeyDown={enterKey(() => {})}
                          rightSlot={suPassword.length > 0 ? (
                            <button type="button" onClick={() => setSuShowPw(!suShowPw)} className="relative z-10 p-2 text-white/60 hover:text-white">
                              {suShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          ) : undefined}
                        />
                        <GlassInput icon={Lock} type={suShowCpw ? 'text' : 'password'} placeholder="Confirm Password" value={suConfirmPw}
                          onChange={setSuConfirmPw}
                          onKeyDown={enterKey(() => { if (suPassword.length >= 6 && suConfirmPw.length >= 6) handleSignUp(); })}
                          rightSlot={
                            <div className="relative z-10 flex-shrink-0 pr-1 flex gap-1">
                              {suConfirmPw.length > 0 && (
                                <button type="button" onClick={() => setSuShowCpw(!suShowCpw)} className="p-2 text-white/60 hover:text-white">
                                  {suShowCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              )}
                              {suPassword.length >= 6 && suConfirmPw.length >= 6 && (
                                <GlassIconButton onClick={handleSignUp}><ArrowRight className="w-5 h-5" /></GlassIconButton>
                              )}
                            </div>
                          }
                        />
                        <BlurFade delay={0.15}>
                          <button type="button" onClick={() => setSuStep('info')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
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

      {/* Modal overlay */}
      <AnimatePresence>
        {modal !== 'closed' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-4 shadow-2xl">

              {modal === 'loading' && (
                <AnimatePresence mode="wait">
                  <motion.div key={loadStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center gap-4">
                    <Loader className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-lg font-medium text-white">{LOAD_STEPS[loadStep]}</p>
                  </motion.div>
                </AnimatePresence>
              )}

              {modal === 'success' && (
                <div className="flex flex-col items-center gap-4">
                  <PartyPopper className="w-10 h-10 text-green-500" />
                  <p className="text-lg font-medium text-white">Welcome aboard!</p>
                </div>
              )}

              {modal === 'error' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="text-lg font-medium text-white text-center">{modalMsg}</p>
                  <button onClick={() => setModal('closed')}
                    className="mt-2 px-5 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity">
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
