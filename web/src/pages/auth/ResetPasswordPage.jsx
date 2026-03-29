import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Brain, ArrowRight, Check, CheckCircle, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { cn } from '../../utils/cn';

function PasswordStrength({ password }) {
  const { strength, label, color, checks } = useMemo(() => {
    const c = { length: password.length >= 8, upper: /[A-Z]/.test(password), number: /\d/.test(password), special: /[^A-Za-z0-9]/.test(password) };
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
        <span className={cn('text-xs font-medium', strength <= 25 ? 'text-error' : strength <= 50 ? 'text-warning' : strength <= 75 ? 'text-info' : 'text-success')}>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {[{ key: 'length', label: '8+ characters' }, { key: 'upper', label: 'Uppercase' }, { key: 'number', label: 'Number' }, { key: 'special', label: 'Special char' }].map((req) => (
          <span key={req.key} className={cn('text-[11px] flex items-center gap-1', checks[req.key] ? 'text-success' : 'text-text-muted')}><Check size={10} /> {req.label}</span>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Reset:', data);
    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/auth/login'), 3000);
  };

  return (
    <div className="flex min-h-screen -mt-16 items-center justify-center px-6 py-12 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px]">
        <div className="bg-surface rounded-2xl shadow-lg border border-border/50 p-8 md:p-10">
          {!success ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-deep-teal/8 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={28} className="text-deep-teal" />
              </div>
              <h1 className="text-2xl font-bold text-navy-dark text-center tracking-tight">Create New Password</h1>
              <p className="mt-2 text-text-secondary text-center text-sm">Your new password must be different from your previous one</p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div>
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    leftIcon={<Lock size={18} />}
                    rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer" tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
                    error={errors.password?.message}
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                  />
                  <PasswordStrength password={password} />
                </div>

                <Input
                  label="Confirm New Password"
                  type={showConfirm ? 'text' : 'password'}
                  leftIcon={<Lock size={18} />}
                  rightIcon={<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer" tabIndex={-1}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', { required: 'Please confirm', validate: (v) => v === password || 'Passwords do not match' })}
                />

                <Button type="submit" isLoading={isLoading} className="w-full h-12 text-base mt-2" rightIcon={!isLoading && <ArrowRight size={18} />}>
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h2 className="text-2xl font-bold text-navy-dark">Password Reset!</h2>
              <p className="mt-3 text-text-secondary text-sm">Your password has been successfully reset. Redirecting to sign in...</p>
              <div className="mt-6 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-deep-teal border-t-transparent rounded-full animate-spin" />
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center text-white"><Brain size={16} /></div>
            <span className="text-sm font-bold"><span className="text-navy-dark">Echo</span><span className="text-deep-teal">Mind</span></span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
