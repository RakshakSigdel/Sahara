import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDoctor } from '../../contexts/DoctorContext';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Brain, ArrowRight, Mic, Activity, Shield, Stethoscope } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/* ── Doctor illustration ── */
function DoctorIllustration() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-deep-teal via-deep-teal-light to-sage items-center justify-center">
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        {[...Array(6)].map((_, i) => (
          <motion.path key={i} d={`M0 ${200 + i * 80} Q${200 + i * 30} ${150 + i * 60}, 400 ${220 + i * 70} T 800 ${180 + i * 80}`}
            fill="none" stroke="white" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2 + i * 0.3, delay: i * 0.2, ease: 'easeOut' }} />
        ))}
      </svg>
      {[{ size: 200, x: '20%', y: '25%', delay: 0 }, { size: 120, x: '70%', y: '60%', delay: 1 }, { size: 80, x: '15%', y: '75%', delay: 2 }].map((orb, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white/10" style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ y: [0, -15, 5, -10, 0], scale: [1, 1.05, 0.97, 1.03, 1] }} transition={{ duration: 8, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }} />
      ))}
      <div className="relative z-10 text-center px-12">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
          <Stethoscope size={40} className="text-white" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-3xl font-bold text-white mb-4">
          AI-Powered<br />Cognitive Screening
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-white/70 text-base leading-relaxed max-w-sm mx-auto">
          Trusted by 500+ healthcare professionals for early dementia detection through voice analysis.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-3 mt-8">
          {[{ icon: <Mic size={14} />, label: '2 Min Test' }, { icon: <Activity size={14} />, label: '98% Accurate' }, { icon: <Shield size={14} />, label: 'HIPAA' }].map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium">{chip.icon} {chip.label}</span>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-full max-w-md mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 text-left">
            <p className="text-white/80 text-sm italic leading-relaxed">&ldquo;Sahara detected subtle speech pattern changes 18 months before clinical diagnosis. An invaluable screening tool.&rdquo;</p>
            <p className="text-white/50 text-xs mt-3">— Dr. Patel, Neurologist, Stanford Medical</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Social ── */
function SocialButtons() {
  return (
    <div className="space-y-3">
      <div className="relative flex items-center my-6"><div className="flex-1 border-t border-border" /><span className="px-4 text-xs text-text-muted uppercase tracking-wider">or sign in with</span><div className="flex-1 border-t border-border" /></div>
      <button className="w-full h-12 rounded-lg border-[1.5px] border-border-strong bg-surface hover:bg-muted/50 transition-colors flex items-center justify-center gap-3 text-sm font-medium text-text-primary cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>
      <button className="w-full h-12 rounded-lg bg-navy-dark hover:bg-navy-dark/90 transition-colors flex items-center justify-center gap-3 text-sm font-medium text-white cursor-pointer">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
        Continue with Apple
      </button>
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useDoctor();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (e) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DoctorIllustration />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-surface">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[420px]">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center text-white shadow-sm group-hover:shadow-glow transition-shadow"><Brain size={20} /></div>
            <div><span className="text-xl font-bold"><span className="text-navy-dark">Echo</span><span className="text-deep-teal">Mind</span></span><p className="text-[9px] text-text-muted -mt-0.5">for Healthcare Professionals</p></div>
          </Link>

          <h1 className="text-3xl font-bold text-navy-dark tracking-tight">Welcome Back, Doctor</h1>
          <p className="mt-2 text-text-secondary">Continue providing better cognitive care</p>

          {error && <div className="mt-4 px-3 py-2 rounded-lg bg-error/5 border border-error/15 text-xs text-error">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Input label="Professional Email" type="email" leftIcon={<Mail size={18} />} placeholder="doctor@hospital.com" error={errors.email?.message}
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
            <div>
              <Input label="Password" type={showPassword ? 'text' : 'password'} leftIcon={<Lock size={18} />}
                rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer" tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
                error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('remember')} className="w-4 h-4 rounded border-border-strong text-deep-teal focus:ring-deep-teal/20 cursor-pointer" /><span className="text-sm text-text-secondary">Remember me</span></label>
              <Link to="/auth/forgot-password" className="text-sm font-medium text-deep-teal hover:text-deep-teal-dark transition-colors">Forgot password?</Link>
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full h-12 text-base" rightIcon={!isLoading && <ArrowRight size={18} />}>Sign In</Button>
          </form>

          <SocialButtons />

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link to="/auth/signup" className="font-semibold text-deep-teal hover:text-deep-teal-dark transition-colors">Request Access</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
