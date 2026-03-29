import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Building2,
  Award,
  Stethoscope,
  Shield,
  Check,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../contexts/DoctorContext';

/* ── Password strength ── */
function PasswordStrength({ password }) {
  const { strength, label, color, checks } = useMemo(() => {
    const c = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    const score = Object.values(c).filter(Boolean).length;
    if (score <= 1) return { strength: 25, label: 'Weak', color: 'bg-error', checks: c };
    if (score <= 2) return { strength: 50, label: 'Fair', color: 'bg-warning', checks: c };
    if (score <= 3) return { strength: 75, label: 'Good', color: 'bg-info', checks: c };
    return { strength: 100, label: 'Strong', color: 'bg-success', checks: c };
  }, [password]);

  if (!password) return null;

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className={cn('h-full rounded-full', color)} initial={{ width: 0 }} animate={{ width: `${strength}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span
          className={cn(
            'text-xs font-medium',
            strength <= 25 ? 'text-error' : strength <= 50 ? 'text-warning' : strength <= 75 ? 'text-info' : 'text-success',
          )}
        >
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {[
          { key: 'length', label: '8+ characters' },
          { key: 'upper', label: 'Uppercase letter' },
          { key: 'number', label: 'Number' },
          { key: 'special', label: 'Special character' },
        ].map((rule) => (
          <span key={rule.key} className={cn('text-[11px] flex items-center gap-1', checks[rule.key] ? 'text-success' : 'text-text-muted')}>
            <Check size={10} /> {rule.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Illustration ── */
function SignupIllustration() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-deep-teal-dark via-deep-teal to-sage items-center justify-center">
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        {[...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M0 ${200 + i * 80} Q${200 + i * 30} ${150 + i * 60}, 400 ${220 + i * 70} T 800 ${180 + i * 80}`}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2 + i * 0.3, delay: i * 0.2 }}
          />
        ))}
      </svg>
      {[{ size: 200, x: '20%', y: '25%', d: 0 }, { size: 120, x: '70%', y: '60%', d: 1 }, { size: 80, x: '15%', y: '75%', d: 2 }].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ y: [0, -15, 5, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: orb.d, ease: 'easeInOut' }}
        />
      ))}
      <div className="relative z-10 text-center px-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8"
        >
          <ClipboardCheck size={40} className="text-white" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-3xl font-bold text-white mb-4">
          Join 500+
          <br />
          Healthcare Professionals
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 text-base max-w-sm mx-auto"
        >
          Provide earlier, more accurate cognitive assessments with AI-powered voice analysis.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-3 mt-8">
          {[
            { icon: <Stethoscope size={14} />, label: 'Clinical-grade' },
            { icon: <Shield size={14} />, label: 'HIPAA' },
            { icon: <Check size={14} />, label: '14-day trial' },
          ].map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium">
              {chip.icon} {chip.label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useDoctor();
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      license: '',
      specialty: 'neurology',
      hospital: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
      hipaa: false,
    },
  });

  const password = watch('password', '');

  const goStep2 = useCallback(async () => {
    const valid = await trigger(['fullName', 'email', 'license', 'specialty', 'hospital', 'phone']);
    if (valid) setStep(2);
  }, [trigger]);

  const formatAuthError = useCallback((error) => {
    const code = error?.code;
    if (code === 'auth/email-already-in-use') return 'An account with this email already exists. Try logging in instead.';
    if (code === 'auth/weak-password') return 'Choose a stronger password (8+ characters).';
    if (code === 'auth/invalid-email') return 'Enter a valid work email address.';
    return 'Unable to create your account. Please try again.';
  }, []);

  const onSubmit = useCallback(
    async (values) => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        await signup(values.email, values.password, {
          fullName: values.fullName,
          licenseNo: values.license,
          speciality: values.specialty,
          hospitalName: values.hospital,
          phone: values.phone,
        });
        // onAuthStateChanged in DoctorContext will auto-set the user
        navigate('/dashboard');
      } catch (error) {
        setErrorMessage(formatAuthError(error));
      } finally {
        setIsLoading(false);
      }
    },
    [formatAuthError, signup, navigate],
  );

  return (
    <div className="flex min-h-screen">
      <SignupIllustration />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 bg-surface overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[420px]">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center text-white shadow-sm">
              <Brain size={20} />
            </div>
            <div>
              <span className="text-xl font-bold">
                <span className="text-navy-dark">Echo</span>
                <span className="text-deep-teal">Mind</span>
              </span>
              <p className="text-[9px] text-text-muted -mt-0.5">for Healthcare Professionals</p>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-navy-dark tracking-tight">Create Your Clinical Account</h1>
          <p className="mt-1 text-sm text-text-secondary">Instant access to the EchoMind professional suite</p>

          <div className="flex items-center gap-3 mt-5 mb-6">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full bg-deep-teal rounded-full" animate={{ width: step === 1 ? '50%' : '100%' }} />
            </div>
            <span className="text-xs font-medium text-text-muted">Step {step} of 2</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-sm font-bold text-text-muted uppercase">Professional Information</h2>
                <Input
                  label="Full Name *"
                  leftIcon={<User size={16} />}
                  placeholder="Dr. Jane Smith"
                  error={errors.fullName?.message}
                  {...register('fullName', { required: 'Name is required' })}
                />
                <Input
                  label="Professional Email *"
                  type="email"
                  leftIcon={<Mail size={16} />}
                  placeholder="doctor@hospital.com"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="License Number *"
                    leftIcon={<Award size={16} />}
                    placeholder="XX-MD-123456"
                    error={errors.license?.message}
                    {...register('license', { required: 'License required' })}
                  />
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5 ml-1">Specialty *</label>
                    <select
                      className="w-full h-12 px-3 border-[1.5px] border-border-strong rounded text-sm bg-transparent outline-none focus:border-deep-teal cursor-pointer"
                      {...register('specialty', { required: true })}
                    >
                      <option value="neurology">Neurology</option>
                      <option value="geriatrics">Geriatrics</option>
                      <option value="primary-care">Primary Care</option>
                      <option value="psychiatry">Psychiatry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Hospital / Clinic *"
                  leftIcon={<Building2 size={16} />}
                  placeholder="Stanford Medical Center"
                  error={errors.hospital?.message}
                  {...register('hospital', { required: 'Hospital required' })}
                />
                <Input
                  label="Professional Phone *"
                  type="tel"
                  leftIcon={<Phone size={16} />}
                  placeholder="+1 (555) 000-0000"
                  error={errors.phone?.message}
                  {...register('phone', { required: 'Phone required' })}
                />

                <div className="bg-deep-teal/5 rounded-lg p-3 border border-deep-teal/10">
                  <p className="text-xs text-deep-teal font-medium flex items-center gap-1.5">
                    <Shield size={13} /> Accounts are activated instantly. Our team may follow up for credential verification.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" type="button" onClick={() => navigate('/auth/login')}>
                    Back to Login
                  </Button>
                  <Button type="button" onClick={goStep2} rightIcon={<ArrowRight size={16} />}>
                    Next Step
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-sm font-bold text-text-muted uppercase">Account Setup</h2>
                <div>
                  <Input
                    label="Create Password *"
                    type={showPw ? 'text' : 'password'}
                    leftIcon={<Lock size={16} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="text-text-muted hover:text-text-primary cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    error={errors.password?.message}
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: '8+ characters' } })}
                  />
                  <PasswordStrength password={password} />
                </div>
                <Input
                  label="Confirm Password *"
                  type={showConfirm ? 'text' : 'password'}
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-text-muted hover:text-text-primary cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Confirm password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'Required' })}
                      className="w-4 h-4 mt-0.5 rounded text-deep-teal cursor-pointer"
                    />
                    <span className="text-sm text-text-secondary leading-snug">
                      I agree to the <Link to="/terms" className="text-deep-teal font-medium hover:underline">Terms of Service</Link> and{' '}
                      <Link to="/privacy" className="text-deep-teal font-medium hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-error ml-6">{errors.terms.message}</p>}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('hipaa', { required: 'Required' })}
                      className="w-4 h-4 mt-0.5 rounded text-deep-teal cursor-pointer"
                    />
                    <span className="text-sm text-text-secondary leading-snug">
                      I agree to the <span className="text-deep-teal font-medium">HIPAA Business Associate Agreement</span>
                    </span>
                  </label>
                  {errors.hipaa && <p className="text-xs text-error ml-6">{errors.hipaa.message}</p>}
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">
                    <AlertTriangle size={16} className="mt-0.5" />
                    <span className="flex-1">{errorMessage}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" type="button" leftIcon={<ArrowLeft size={16} />} onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" isLoading={isLoading} rightIcon={!isLoading && <ArrowRight size={16} />}>
                    Create Account
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-deep-teal hover:text-deep-teal-dark transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
