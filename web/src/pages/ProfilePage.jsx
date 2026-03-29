import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Building2, Award, Stethoscope, Camera, Save, Download, Trash2, LogOut,
  AlertTriangle, Bell, Shield, CreditCard, Settings, Moon, Clock, Check, Key, Monitor, Upload,
} from 'lucide-react';
import { useDoctor } from '../contexts/DoctorContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../utils/cn';

const tabs = [
  { id: 'professional', label: 'Professional Info', icon: <Stethoscope size={15} /> },
  { id: 'practice', label: 'Practice Settings', icon: <Settings size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={15} /> },
  { id: 'security', label: 'Privacy & Security', icon: <Shield size={15} /> },
];

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3 cursor-pointer group">
      <div>
        <p className="text-sm font-medium text-text-primary group-hover:text-deep-teal transition-colors">{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cn('relative shrink-0 w-11 h-6 rounded-full transition-colors cursor-pointer', checked ? 'bg-deep-teal' : 'bg-border-strong')}>
        <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ left: checked ? '22px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </button>
    </label>
  );
}

function Section({ title, children, className }) {
  return <div className={cn('bg-surface rounded-xl border border-border/60 shadow-card p-6', className)}>{title && <h3 className="text-base font-bold text-navy-dark mb-5">{title}</h3>}{children}</div>;
}

function ConfirmModal({ open, onClose, onConfirm, title, description, danger }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full">
        <div className="flex items-start gap-3 mb-5">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', danger ? 'bg-error/10' : 'bg-warning/10')}><AlertTriangle size={20} className={danger ? 'text-error' : 'text-warning'} /></div>
          <div><h3 className="text-base font-bold text-navy-dark">{title}</h3><p className="text-sm text-text-secondary mt-1">{description}</p></div>
        </div>
        <div className="flex gap-3"><Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button><Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} className="flex-1">Confirm</Button></div>
      </motion.div>
    </div>
  );
}

/* ═══ TABS ═══ */

function ProfessionalTab({ doctor }) {
  return (
    <div className="space-y-6">
      <Section title="Professional Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue={doctor?.fullName} leftIcon={<User size={16} />} />
          <Input label="Email" defaultValue={doctor?.email} leftIcon={<Mail size={16} />} disabled />
          <div className="flex items-center gap-2">
            <Input label="License Number" defaultValue={doctor?.license} leftIcon={<Award size={16} />} containerClassName="flex-1" />
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full mt-5"><Check size={10} /> Verified</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 ml-1">Specialty</label>
            <select defaultValue={doctor?.specialty?.toLowerCase()} className="w-full h-12 px-4 border-[1.5px] border-border-strong rounded text-sm bg-transparent outline-none focus:border-deep-teal cursor-pointer">
              <option value="neurology">Neurology</option><option value="geriatrics">Geriatrics</option><option value="primary-care">Primary Care</option><option value="psychiatry">Psychiatry</option><option value="other">Other</option>
            </select>
          </div>
          <Input label="Hospital / Clinic" defaultValue={doctor?.hospital} leftIcon={<Building2 size={16} />} />
          <Input label="Phone" defaultValue={doctor?.phone} leftIcon={<Phone size={16} />} />
        </div>
      </Section>
      <Section title="Professional Photo & Signature">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-xs font-medium text-text-muted mb-2">Profile Photo</p>
            <div className="w-24 h-24 mx-auto rounded-full bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-deep-teal/40 transition-colors group">
              <Camera size={24} className="text-text-muted group-hover:text-deep-teal transition-colors" />
            </div>
            <p className="text-[10px] text-text-muted mt-2">Upload for reports</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-text-muted mb-2">Digital Signature</p>
            <div className="h-24 mx-auto rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-deep-teal/40 transition-colors group">
              <Upload size={20} className="text-text-muted group-hover:text-deep-teal transition-colors" />
            </div>
            <p className="text-[10px] text-text-muted mt-2">For PDF report signing</p>
          </div>
        </div>
      </Section>
      <Section title="Professional Bio">
        <textarea rows={3} defaultValue="" placeholder="Brief bio for patient-facing reports (optional)…" className="w-full rounded-lg border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all resize-none" />
      </Section>
      <div className="flex justify-end"><Button leftIcon={<Save size={16} />}>Save Changes</Button></div>
    </div>
  );
}

function PracticeTab() {
  return (
    <div className="space-y-6">
      <Section title="Session Defaults">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-text-muted mb-1.5">Default Question Set</label>
            <select className="w-full h-10 px-3 border border-border-strong rounded text-sm bg-transparent outline-none cursor-pointer"><option>Standard 10-Question</option><option>Custom Set A</option></select>
          </div>
          <Input label="Session Timeout (min)" type="number" defaultValue={30} />
          <Input label="Auto-save Interval (sec)" type="number" defaultValue={15} />
          <div><label className="block text-xs font-medium text-text-muted mb-1.5">Report Template</label>
            <select className="w-full h-10 px-3 border border-border-strong rounded text-sm bg-transparent outline-none cursor-pointer"><option>Standard Clinical</option><option>Detailed Research</option><option>Patient Summary</option></select>
          </div>
        </div>
      </Section>
      <Section title="Clinic Branding">
        <div className="text-center">
          <p className="text-xs font-medium text-text-muted mb-2">Letterhead / Logo</p>
          <div className="h-20 rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-deep-teal/40 transition-colors group">
            <div className="text-center"><Upload size={20} className="mx-auto text-text-muted group-hover:text-deep-teal transition-colors mb-1" /><p className="text-[10px] text-text-muted">Upload for PDF exports</p></div>
          </div>
        </div>
      </Section>
      <Section title="EMR Integration">
        <div className="p-4 rounded-lg bg-muted/20 border border-border/40"><p className="text-sm text-text-muted">EMR integration is available on Enterprise plans. <a className="text-deep-teal font-medium hover:underline cursor-pointer">Contact sales</a> to learn more.</p></div>
      </Section>
      <div className="flex justify-end"><Button leftIcon={<Save size={16} />}>Save Settings</Button></div>
    </div>
  );
}

function NotificationsTab() {
  const [s, setS] = useState({ session: true, highRisk: true, followUp: true, updates: false, sms: false, quiet: false });
  const tog = (k) => setS((p) => ({ ...p, [k]: !p[k] }));
  return (
    <div className="space-y-6">
      <Section title="Email Alerts">
        <div className="divide-y divide-border/40">
          <Toggle checked={s.session} onChange={() => tog('session')} label="Session Completed" description="Receive notification when analysis is complete" />
          <Toggle checked={s.highRisk} onChange={() => tog('highRisk')} label="High-Risk Results" description="Immediate alert for scores above threshold" />
          <Toggle checked={s.followUp} onChange={() => tog('followUp')} label="Patient Follow-up Reminders" description="Reminders for overdue patient check-ins" />
          <Toggle checked={s.updates} onChange={() => tog('updates')} label="Platform Updates" description="New features and improvements" />
        </div>
      </Section>
      <Section title="SMS Alerts">
        <Toggle checked={s.sms} onChange={() => tog('sms')} label="Enable SMS Notifications" description="High-risk alerts via text (optional)" />
        {s.sms && <div className="mt-3"><Input label="SMS Phone Number" type="tel" placeholder="+1 (555) 000-0000" /></div>}
      </Section>
      <Section title="Quiet Hours">
        <Toggle checked={s.quiet} onChange={() => tog('quiet')} label="Enable Quiet Hours" description="Silence all notifications during set hours" />
        {s.quiet && <div className="grid grid-cols-2 gap-4 mt-3"><Input label="Start" type="time" defaultValue="22:00" leftIcon={<Moon size={16} />} /><Input label="End" type="time" defaultValue="07:00" leftIcon={<Clock size={16} />} /></div>}
      </Section>
      <div className="flex justify-end"><Button leftIcon={<Save size={16} />}>Save Notification Settings</Button></div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <Section title="Current Plan">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-deep-teal/5 to-sage/5 border border-deep-teal/15">
          <div>
            <span className="text-xs font-bold text-deep-teal bg-deep-teal/10 px-2 py-0.5 rounded-full">FREE TRIAL</span>
            <p className="text-2xl font-extrabold text-navy-dark mt-2">$0 <span className="text-sm font-normal text-text-muted">/ 14 days</span></p>
            <p className="text-xs text-text-muted mt-1">10 days remaining</p>
          </div>
          <Button>Upgrade Plan</Button>
        </div>
      </Section>
      <Section title="Usage This Month">
        <div className="grid grid-cols-3 gap-4">
          {[{ label: 'Sessions', value: '12', limit: '∞' }, { label: 'Patients', value: '7', limit: '10' }, { label: 'Reports', value: '12', limit: '∞' }].map((u) => (
            <div key={u.label} className="text-center p-3 bg-muted/20 rounded-lg"><p className="text-lg font-bold text-navy-dark">{u.value}</p><p className="text-[10px] text-text-muted">{u.label} (max {u.limit})</p></div>
          ))}
        </div>
      </Section>
      <Section title="Payment Method">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
          <p className="text-sm text-text-muted">No payment method on file</p>
          <Button variant="outline" size="sm">Add Payment</Button>
        </div>
      </Section>
      <Section title="Invoice History">
        <p className="text-sm text-text-muted text-center py-4">No invoices yet</p>
      </Section>
    </div>
  );
}

function SecurityTab() {
  const [tfa, setTfa] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const { logout } = useDoctor();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <Section title="Two-Factor Authentication">
        <Toggle checked={tfa} onChange={setTfa} label="Enable 2FA" description="Add an extra layer of security to your account" />
        {tfa && <div className="mt-3 p-3 rounded-lg bg-success/5 border border-success/15 text-xs text-success font-medium flex items-center gap-2"><Check size={14} /> 2FA is active. Authenticator app configured.</div>}
      </Section>
      <Section title="Active Sessions">
        <div className="space-y-3">
          {[{ device: 'Chrome — Windows', location: 'Kathmandu, Nepal', current: true }, { device: 'Safari — iPhone', location: 'Kathmandu, Nepal', current: false }].map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3"><Monitor size={16} className="text-text-muted" /><div><p className="text-sm font-medium">{d.device}</p><p className="text-[10px] text-text-muted">{d.location}</p></div></div>
              {d.current ? <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">Current</span> : <button className="text-xs text-error hover:underline cursor-pointer">Revoke</button>}
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => { logout(); navigate('/'); }}>Sign Out All Devices</Button>
      </Section>
      <Section title="HIPAA Compliance">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-success/5 border border-success/15">
          <Shield size={20} className="text-success" />
          <div><p className="text-sm font-bold text-success">Fully Compliant</p><p className="text-xs text-text-muted">BAA signed • End-to-end encryption • SOC 2 Type II</p></div>
        </div>
      </Section>
      <Section title="Data Management">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20"><div><p className="text-sm font-semibold">Download My Data</p><p className="text-xs text-text-muted">Export all records</p></div><Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Download</Button></div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-error/5 border border-error/15"><div><p className="text-sm font-semibold text-error">Delete Account</p><p className="text-xs text-text-muted">Permanently delete everything</p></div><Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />} onClick={() => setDeleteModal(true)}>Delete</Button></div>
        </div>
      </Section>
      <ConfirmModal open={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={() => { setDeleteModal(false); logout(); navigate('/'); }} title="Delete Account?" description="This permanently deletes your account, all patient data, and session records. This cannot be undone." danger />
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function ProfilePage() {
  const { currentDoctor, logout } = useDoctor();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('professional');

  const panels = { professional: () => <ProfessionalTab doctor={currentDoctor} />, practice: PracticeTab, notifications: NotificationsTab, billing: BillingTab, security: SecurityTab };
  const Panel = panels[activeTab];

  return (
    <div className="p-5 lg:p-7">
      <div className="mx-auto max-w-[960px]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-2xl font-bold shadow-glow">
              {currentDoctor?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
            </div>
            <button className="absolute inset-0 rounded-full bg-navy-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={20} className="text-white" /></button>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-navy-dark">{currentDoctor?.fullName || 'Doctor'}</h1>
            <p className="text-sm text-text-muted mt-0.5">{currentDoctor?.email}</p>
            <p className="text-xs text-text-muted mt-0.5">{currentDoctor?.specialty} • {currentDoctor?.hospital}</p>
          </div>
          <div className="sm:ml-auto">
            <Button variant="outline" size="sm" leftIcon={<LogOut size={14} />} onClick={() => { logout(); navigate('/'); }}>Sign Out</Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap',
              activeTab === tab.id ? 'bg-surface text-navy-dark shadow-sm' : 'text-text-muted hover:text-text-primary')}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
