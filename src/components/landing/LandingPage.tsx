import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Users, ThumbsUp, TrendingUp, Shield, Sparkles, Building2, ArrowRight, Zap, MessageSquare, Bell, Home, UserPlus } from 'lucide-react';
import logo from '../../assets/logo.png';

interface LandingPageProps {
  onCitizenAuth: () => void;
  onCityGovAuth: () => void;
}

const ROTATING_WORDS: { text: string; duration: number }[] = [
  { text: 'Community',   duration: 2500 },
  { text: 'Neighborhood', duration: 1500 },
  { text: 'HOA',         duration: 1500 },
  { text: 'Street',      duration: 1500 },
  { text: 'Board',       duration: 1500 },
  { text: 'Future',      duration: 1500 },
];

export function LandingPage({ onCitizenAuth, onCityGovAuth }: LandingPageProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      ROTATING_WORDS[wordIndex].duration,
    );
    return () => clearTimeout(id);
  }, [wordIndex]);

  const features = [
    {
      icon: MapPin,
      title: 'Report Issues',
      description: 'Flag maintenance requests, rule violations, and safety concerns in your neighborhood',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ThumbsUp,
      title: 'Endorse & Track',
      description: 'Support issues that matter and track their resolution in real-time',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Connect with the Board',
      description: 'Direct communication channel with your HOA board and property managers',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Make an Impact',
      description: 'See your contributions drive real improvements in your neighborhood',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const benefits = [
    { icon: Zap, text: 'AI-powered content moderation' },
    { icon: Bell, text: 'Real-time progress notifications' },
    { icon: MessageSquare, text: 'Direct board communication' },
    { icon: Shield, text: 'Invite-only secure community' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden relative">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gray-700/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-80 h-80 bg-gray-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gray-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="container mx-auto px-4 py-4 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Lighter background behind header */}
          <div className="absolute inset-0 -inset-x-[100vw] bg-gradient-to-b from-gray-700/40 to-transparent backdrop-blur-sm" />
          
          <div className="flex items-center justify-between relative z-10">
            <motion.div 
              className="flex items-center gap-3 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Glow effect behind logo */}
              <div className="absolute -inset-4 bg-gradient-radial from-white/20 via-white/10 to-transparent rounded-full blur-xl" />
              <img src={logo} alt="CiviLink" className="h-12 relative z-10" />
              <span className="text-3xl bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent relative z-10">
                CiviLink
              </span>
            </motion.div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={onCitizenAuth}
                className="text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button 
                onClick={onCityGovAuth} 
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
              >
                <Home className="h-4 w-4" />
                HOA Admin
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl leading-tight text-white">
                Your Voice,<br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Your </span>
                <span className="inline-block">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={ROTATING_WORDS[wordIndex].text}
                      className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      {ROTATING_WORDS[wordIndex].text}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                CiviLink Community bridges the gap between residents and their HOA board. 
                Report issues, track resolutions, and keep your neighborhood running smoothly.
              </p>

              {/* Benefits List */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-slate-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-sm">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={onCitizenAuth}
                    className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onCityGovAuth}
                    className="text-lg px-8 py-6 bg-white/5 hover:bg-white/10 text-white border-white/20 backdrop-blur-sm"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    For HOA Admins
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced 3D Mockup */}
            <motion.div
              className="relative h-[500px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative h-full">
                {[
                  { title: 'Pool Heater Not Working', location: 'Amenities • Sunset Ridge HOA', endorsements: 18, verified: true, color: 'from-blue-500 to-cyan-500', position: 'top' },
                  { title: 'Sprinkler Leak – Lot 42', location: 'Landscaping • Sunset Ridge HOA', endorsements: 12, verified: true, color: 'from-purple-500 to-pink-500', position: 'bottom' }
                ].map((post, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: i === 0 ? '0' : 'auto',
                      bottom: i === 1 ? '-80px' : 'auto',
                      left: i === 0 ? '0' : '40px',
                      right: i === 0 ? '40px' : '0',
                      zIndex: 2 - i,
                    }}
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  >
                    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <CardHeader className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
                          <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50" />
                        </div>
                        <CardTitle className="text-white">{post.title}</CardTitle>
                        <CardDescription className="text-slate-300">{post.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="space-y-4">
                          <div className={`h-32 bg-gradient-to-br ${post.color} rounded-lg shadow-lg relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.endorsements}</span>
                            </div>
                            {post.verified && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300">
                                <Shield className="h-4 w-4" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl mb-4 text-white">
              How CiviLink Community Works
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              A powerful platform designed to streamline HOA communication and neighborhood management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative h-full">
                    <Card className="relative h-full backdrop-blur-xl bg-slate-800/90 border border-white/20 shadow-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <CardHeader className="relative p-8">
                        <CardTitle className="text-white text-xl mb-3">{feature.title}</CardTitle>
                        <CardDescription className="text-slate-300 leading-relaxed">{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
            <Card className="relative overflow-hidden border-2 border-white/20 bg-slate-800/90 backdrop-blur-xl shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <CardContent className="relative z-10 py-20 text-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-5xl md:text-6xl mb-6 text-white">
                    Ready to Make a Difference?
                  </h2>
                  <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    Give your HOA community the tools to communicate openly, resolve issues faster, and keep every resident in the loop.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        onClick={onCitizenAuth}
                        className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                      >
                        Start Your Journey
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={onCityGovAuth}
                        className="text-lg px-10 py-7 bg-white/5 hover:bg-white/10 text-white border-white/20 backdrop-blur-sm"
                      >
                        <Home className="mr-2 h-5 w-5" />
                        HOA Admin Portal
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 text-center text-slate-400 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="CiviLink" className="h-6" />
            <span className="text-lg bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              CiviLink
            </span>
          </div>
          <p>&copy; 2026 CiviLink Community. Empowering neighborhoods through technology.</p>
        </footer>
      </div>
    </div>
  );
}