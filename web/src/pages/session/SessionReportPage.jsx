import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Mail,
  Check,
  AlertTriangle,
  ChevronDown,
  Brain,
  FileText,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useDoctor } from "../../contexts/DoctorContext";
import Button from "../../components/ui/Button";
import { cn } from "../../utils/cn";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } },
};

function riskColor(s) {
  if (s <= 30) return "success";
  if (s <= 60) return "warning";
  return "error";
}
function riskLabel(s) {
  if (s <= 30) return "Normal Cognitive Function";
  if (s <= 60) return "Mild Cognitive Impairment (MCI) Suspected";
  return "Dementia Screening Positive — Further Evaluation Recommended";
}
function riskClass(s) {
  if (s <= 30) return "Healthy";
  if (s <= 60) return "Mild Concern";
  return "High Risk";
}

function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface rounded-lg border border-border/60 shadow-lg px-3 py-2 text-xs">
      <span className="font-bold">{payload[0].value}</span> risk score
    </div>
  );
}

export default function SessionReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { patients, sessions, currentDoctor } = useDoctor();
  const [expandedSection, setExpandedSection] = useState(null);

  const session = sessions.find((s) => s.id === sessionId);
  const patient = patients.find((p) => p.id === session?.patientId);
  const patientSessions = useMemo(
    () =>
      sessions
        .filter(
          (s) =>
            s.patientId === session?.patientId &&
            s.status === "completed" &&
            s.overallReport,
        )
        .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate)),
    [sessions, session],
  );
  const report = session?.overallReport;
  const score = report?.riskScore ?? 45;
  const confidence = report?.confidence ?? 0.92;

  const trendData = patientSessions.map((s, i) => ({
    session: `#${i + 1}`,
    score: s.overallReport.riskScore,
    date: new Date(s.sessionDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // Use real voice markers from report when available, fall back to defaults
  const defaultBiomarkers = [
    {
      marker: "Speech Rate",
      value: "—",
      range: "110–150 wpm",
      status: "normal",
    },
    { marker: "Pause Duration", value: "—", range: "<2.5s", status: "normal" },
    {
      marker: "Filler Word Ratio",
      value: "—",
      range: "<10%",
      status: "normal",
    },
    {
      marker: "Semantic Coherence",
      value: "—",
      range: ">80",
      status: "normal",
    },
    { marker: "Verbal Fluency", value: "—", range: ">12", status: "normal" },
    { marker: "Response Latency", value: "—", range: "<2s", status: "normal" },
    {
      marker: "Lexical Diversity",
      value: "—",
      range: ">0.7",
      status: "normal",
    },
  ];
  const biomarkers = report?.voiceMarkers
    ? report.voiceMarkers.map((m) => ({
        marker: m.name,
        value: m.value,
        range: m.reference || "—",
        status:
          (m.status || "").toLowerCase() === "elevated" ||
          (m.status || "").toLowerCase() === "low"
            ? "elevated"
            : "normal",
      }))
    : defaultBiomarkers;

  const recommendations =
    score <= 30
      ? [
          "Continue annual screening",
          "Maintain brain-healthy lifestyle",
          "No immediate intervention needed",
        ]
      : score <= 60
        ? [
            "Recommend comprehensive neuropsychological testing",
            "Consider referral to neurologist",
            "Schedule follow-up in 3–6 months",
            "Discuss modifiable risk factors",
          ]
        : [
            "Urgent referral to neurology/geriatric psychiatry",
            "Comprehensive diagnostic workup recommended",
            "Brain imaging (MRI) suggested",
            "Evaluate for reversible causes",
            "Family counseling recommended",
          ];

  const finalRecommendations =
    Array.isArray(report?.recommendations) && report.recommendations.length > 0
      ? report.recommendations
      : recommendations;

  const nextSteps = [
    "Discuss results with patient",
    "Schedule follow-up appointment",
    "Refer to specialist (if needed)",
    "Order additional tests",
    "Update patient records",
    "Provide family resources",
  ];

  if (!session)
    return (
      <div className="p-8 text-center">
        <p className="text-text-muted">Session not found.</p>
      </div>
    );

  const toggleSection = (id) =>
    setExpandedSection(expandedSection === id ? null : id);

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="visible"
      className="p-5 lg:p-7 space-y-6 max-w-[960px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={stagger.item}>
        <button
          onClick={() => navigate(`/patients/${session.patientId}`)}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Patient
        </button>
      </motion.div>

      {/* Report Header */}
      <motion.div
        variants={stagger.item}
        className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-dark">
              Bhul Rakshak Assessment Report
            </h1>
            <p className="text-xs text-text-muted">Report ID: {sessionId}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-text-muted text-xs">Patient</p>
            <p className="font-semibold">
              {patient?.fullName} • {patient?.id}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Date</p>
            <p className="font-semibold">
              {new Date(session.sessionDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Conducted by</p>
            <p className="font-semibold">{currentDoctor?.fullName}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Status</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
              <Check size={12} /> Completed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={stagger.item} className="flex flex-wrap gap-2">
        <Button size="sm" leftIcon={<Download size={14} />} variant="outline">
          Export PDF
        </Button>
        <Button size="sm" leftIcon={<Printer size={14} />} variant="outline">
          Print
        </Button>
        <Button size="sm" leftIcon={<Share2 size={14} />} variant="outline">
          Share
        </Button>
        <Button size="sm" leftIcon={<Mail size={14} />} variant="outline">
          Email
        </Button>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        variants={stagger.item}
        className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
      >
        <h2 className="text-lg font-bold text-navy-dark mb-5">
          Executive Summary
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={`text-${riskColor(score)}`}
                stroke="currentColor"
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 42}` }}
                animate={{
                  strokeDasharray: `${(score / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-extrabold text-navy-dark"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {score}
              </span>
              <span className="text-[9px] text-text-muted">risk score</span>
            </div>
          </div>
          <div className="flex-1">
            <span
              className={cn(
                "inline-block text-xs font-bold px-3 py-1 rounded-full mb-3",
                `bg-${riskColor(score)}/10 text-${riskColor(score)}`,
              )}
            >
              {riskClass(score)}
            </span>
            <p className="text-sm font-semibold text-navy-dark mb-1">
              {riskLabel(score)}
            </p>
            <p className="text-sm text-text-secondary">
              Confidence:{" "}
              <span className="font-bold">{Math.round(confidence * 100)}%</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Voice Biomarkers */}
      <motion.div
        variants={stagger.item}
        className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
      >
        <h2 className="text-lg font-bold text-navy-dark mb-4">
          Voice Biomarkers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-3 text-xs font-bold text-text-muted uppercase">
                  Marker
                </th>
                <th className="text-center py-2 px-3 text-xs font-bold text-text-muted uppercase">
                  Value
                </th>
                <th className="text-center py-2 px-3 text-xs font-bold text-text-muted uppercase">
                  Normal Range
                </th>
                <th className="text-center py-2 px-3 text-xs font-bold text-text-muted uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {biomarkers.map((b) => (
                <tr key={b.marker} className="border-b border-border/30">
                  <td className="py-3 px-3 font-medium text-text-primary">
                    {b.marker}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-navy-dark">
                    {b.value}
                  </td>
                  <td className="py-3 px-3 text-center text-text-muted">
                    {b.range}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full",
                        b.status === "normal"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning",
                      )}
                    >
                      {b.status === "normal" ? (
                        <Check size={10} />
                      ) : (
                        <AlertTriangle size={10} />
                      )}{" "}
                      {b.status === "normal" ? "Normal" : "Elevated"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Trend */}
      {trendData.length > 1 && (
        <motion.div
          variants={stagger.item}
          className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
        >
          <h2 className="text-lg font-bold text-navy-dark mb-4">Score Trend</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A7C7C" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0A7C7C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ReferenceLine
                  y={30}
                  stroke="#2ecc71"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />
                <ReferenceLine
                  y={60}
                  stroke="#f39c12"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />
                <Tooltip content={<ChartTip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0A7C7C"
                  strokeWidth={2}
                  fill="url(#trg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        variants={stagger.item}
        className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
      >
        <h2 className="text-lg font-bold text-navy-dark mb-3">
          Clinical Recommendations
        </h2>
        <ul className="space-y-2">
          {finalRecommendations.map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-secondary"
            >
              <Check
                size={14}
                className={`text-${riskColor(score)} shrink-0 mt-0.5`}
              />
              {r}
            </li>
          ))}
        </ul>
      </motion.div>

      {report?.aiInsights && (
        <motion.div
          variants={stagger.item}
          className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
        >
          <h2 className="text-lg font-bold text-navy-dark mb-3">
            AI Interpretation
          </h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>
              <span className="font-semibold text-text-primary">
                Risk Level:
              </span>{" "}
              {report.aiInsights.riskLevel || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-text-primary">
                Audio Analysis:
              </span>{" "}
              {report.aiInsights.audioAnalysis || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-text-primary">
                Behavioral Analysis:
              </span>{" "}
              {report.aiInsights.behavioralAnalysis || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-text-primary">
                Combined Interpretation:
              </span>{" "}
              {report.aiInsights.combinedInterpretation || "N/A"}
            </p>
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      <motion.div
        variants={stagger.item}
        className="bg-surface rounded-xl border border-border/60 shadow-card p-6"
      >
        <h2 className="text-lg font-bold text-navy-dark mb-3">Next Steps</h2>
        <div className="space-y-2">
          {nextSteps.map((s, i) => (
            <label key={i} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-deep-teal cursor-pointer"
              />
              <span className="text-sm text-text-secondary">{s}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        variants={stagger.item}
        className="bg-muted/20 rounded-xl border border-border/40 p-5"
      >
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-text-muted shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-text-muted mb-1">
              Disclaimer & Limitations
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              This assessment is a screening tool utilizing AI-powered voice
              analysis. It is not a definitive diagnosis of dementia or
              cognitive impairment. Clinical correlation and comprehensive
              evaluation by a qualified healthcare professional are required.
              Results should be interpreted in the context of the patient's
              medical history, physical examination, and other diagnostic
              findings.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer meta */}
      <motion.div
        variants={stagger.item}
        className="text-center text-xs text-text-muted space-y-1 pb-8"
      >
        <p>Generated: {new Date().toLocaleString()}</p>
        <p>Report ID: {sessionId} • Bhul Rakshak v2.0</p>
      </motion.div>
    </motion.div>
  );
}
