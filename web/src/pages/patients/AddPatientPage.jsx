import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, UserPlus, Check, Mic, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }, item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } } };

export default function AddPatientPage() {
  const navigate = useNavigate();
  const { addPatient } = useDoctor();
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newPatientId, setNewPatientId] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch, trigger, getValues } = useForm({
    defaultValues: {
      fullName: '', dateOfBirth: '', gender: 'male', phone: '', email: '',
      ecName: '', ecPhone: '', ecRelationship: '', medicalHistory: '', referralSource: '', notes: '',
      consent: false, verified: false,
    },
  });

  const goToStep2 = async () => {
    const valid = await trigger(['fullName', 'dateOfBirth', 'gender', 'phone']);
    if (valid) setStep(2);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const patient = await addPatient({
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        email: data.email || undefined,
        emergencyContact: { name: data.ecName, phone: data.ecPhone, relationship: data.ecRelationship },
        medicalHistory: data.medicalHistory,
        notes: data.notes,
      });
      setNewPatientId(patient.id);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to add patient:', error);
      setSubmitError('Failed to add patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-5 lg:p-7 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface rounded-2xl border border-border/60 shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-navy-dark mb-2">Patient Added!</h2>
          <p className="text-text-secondary text-sm mb-8">What would you like to do next?</p>
          <div className="space-y-2.5">
            <Button className="w-full" leftIcon={<Eye size={16} />} onClick={() => navigate(`/patients/${newPatientId}`)}>View Patient Profile</Button>
            <Button variant="outline" className="w-full" leftIcon={<Mic size={16} />} onClick={() => navigate(`/session/setup/${newPatientId}`)}>Start First Session</Button>
            <Button variant="ghost" className="w-full" leftIcon={<UserPlus size={16} />} onClick={() => { setShowSuccess(false); setStep(1); }}>Add Another Patient</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7">
      <motion.div variants={stagger.container} initial="hidden" animate="visible" className="max-w-[720px] mx-auto">
        {/* Header */}
        <motion.div variants={stagger.item} className="mb-6">
          <button onClick={() => step === 1 ? navigate('/patients') : setStep(1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 cursor-pointer">
            <ArrowLeft size={16} /> {step === 1 ? 'Back to Patients' : 'Back to Step 1'}
          </button>
          <h1 className="text-2xl font-bold text-navy-dark">Add New Patient</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full bg-deep-teal rounded-full" animate={{ width: step === 1 ? '50%' : '100%' }} />
            </div>
            <span className="text-xs font-medium text-text-muted">Step {step} of 2</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <motion.div key="step1" variants={stagger.container} initial="hidden" animate="visible" className="bg-surface rounded-xl border border-border/60 shadow-card p-6 space-y-5">
              <motion.h2 variants={stagger.item} className="text-lg font-bold text-navy-dark">Basic Information</motion.h2>

              <motion.div variants={stagger.item}>
                <div className="w-20 h-20 rounded-full bg-muted/50 border-2 border-dashed border-border flex items-center justify-center mx-auto mb-4 cursor-pointer hover:border-deep-teal/40 transition-colors">
                  <Camera size={24} className="text-text-muted" />
                </div>
              </motion.div>

              <motion.div variants={stagger.item}>
                <Input label="Full Name *" placeholder="Patient's full name" error={errors.fullName?.message} {...register('fullName', { required: 'Name is required' })} />
              </motion.div>

              <motion.div variants={stagger.item} className="grid sm:grid-cols-2 gap-4">
                <Input label="Date of Birth *" type="date" error={errors.dateOfBirth?.message} {...register('dateOfBirth', { required: 'Date of birth is required' })} />
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Gender *</label>
                  <div className="flex gap-2">
                    {['male', 'female', 'other'].map((g) => (
                      <label key={g} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/60 cursor-pointer hover:border-deep-teal/40 transition-colors has-[:checked]:border-deep-teal has-[:checked]:bg-deep-teal/5">
                        <input type="radio" value={g} {...register('gender', { required: true })} className="w-3.5 h-3.5 text-deep-teal cursor-pointer" />
                        <span className="text-sm capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={stagger.item} className="grid sm:grid-cols-2 gap-4">
                <Input label="Phone Number *" type="tel" placeholder="+977-98XXXXXXXX" error={errors.phone?.message} {...register('phone', { required: 'Phone is required' })} />
                <Input label="Email (optional)" type="email" placeholder="patient@email.com" {...register('email')} />
              </motion.div>

              <motion.div variants={stagger.item} className="flex justify-end gap-3 pt-3">
                <Button variant="ghost" type="button" onClick={() => navigate('/patients')}>Cancel</Button>
                <Button type="button" onClick={goToStep2}>Next Step</Button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stagger.container} initial="hidden" animate="visible" className="bg-surface rounded-xl border border-border/60 shadow-card p-6 space-y-5">
              <motion.h2 variants={stagger.item} className="text-lg font-bold text-navy-dark">Medical Information</motion.h2>

              <motion.div variants={stagger.item} className="grid sm:grid-cols-3 gap-4">
                <Input label="Emergency Contact *" placeholder="Contact name" error={errors.ecName?.message} {...register('ecName', { required: 'Required' })} />
                <Input label="Contact Phone *" type="tel" placeholder="Phone number" error={errors.ecPhone?.message} {...register('ecPhone', { required: 'Required' })} />
                <Input label="Relationship *" placeholder="e.g. Wife, Son" error={errors.ecRelationship?.message} {...register('ecRelationship', { required: 'Required' })} />
              </motion.div>

              <motion.div variants={stagger.item}>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Medical History</label>
                <textarea rows={4} placeholder="Relevant medical conditions, medications, previous diagnoses…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" {...register('medicalHistory')} />
              </motion.div>

              <motion.div variants={stagger.item}>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Referral Source</label>
                <select className="w-full h-10 rounded-lg border border-border/60 px-3 text-sm outline-none cursor-pointer bg-transparent" {...register('referralSource')}>
                  <option value="">Select…</option>
                  <option value="self">Self-referred</option>
                  <option value="doctor">Doctor referral</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              <motion.div variants={stagger.item}>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Notes</label>
                <textarea rows={3} placeholder="Any additional notes or observations…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" {...register('notes')} />
              </motion.div>

              <motion.div variants={stagger.item} className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" {...register('consent')} className="w-4 h-4 rounded text-deep-teal cursor-pointer" />
                  <span className="text-sm text-text-secondary">Patient consented to voice analysis</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" {...register('verified')} className="w-4 h-4 rounded text-deep-teal cursor-pointer" />
                  <span className="text-sm text-text-secondary">Patient information verified</span>
                </label>
              </motion.div>

              {submitError && (
                <motion.div variants={stagger.item} className="px-3 py-2 rounded-lg bg-error/5 border border-error/15 text-xs text-error">
                  {submitError}
                </motion.div>
              )}

              <motion.div variants={stagger.item} className="flex justify-between pt-3">
                <Button variant="outline" type="button" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" isLoading={isSubmitting}>Add Patient</Button>
              </motion.div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
