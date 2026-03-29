import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Brain, ArrowLeft, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Reset email:', data);
    setIsLoading(false);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen -mt-16 items-center justify-center px-6 py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-surface rounded-2xl shadow-lg border border-border/50 p-8 md:p-10">
          {!sent ? (
            <>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-deep-teal/8 flex items-center justify-center mx-auto mb-6">
                <KeyRound size={28} className="text-deep-teal" />
              </div>

              <h1 className="text-2xl font-bold text-navy-dark text-center tracking-tight">Forgot Your Password?</h1>
              <p className="mt-2 text-text-secondary text-center text-sm">
                Enter your email and we&apos;ll send reset instructions
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  leftIcon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />

                <Button type="submit" isLoading={isLoading} className="w-full h-12 text-base" rightIcon={!isLoading && <ArrowRight size={18} />}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h2 className="text-2xl font-bold text-navy-dark">Check Your Email</h2>
              <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                We&apos;ve sent password reset instructions to<br />
                <span className="font-semibold text-text-primary">{getValues('email')}</span>
              </p>
              <p className="mt-4 text-xs text-text-muted">Didn&apos;t receive it? Check your spam folder or try again.</p>
              <Button variant="outline" onClick={() => setSent(false)} className="mt-6">
                Try Another Email
              </Button>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-deep-teal transition-colors">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center text-white">
              <Brain size={16} />
            </div>
            <span className="text-sm font-bold"><span className="text-navy-dark">Echo</span><span className="text-deep-teal">Mind</span></span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
