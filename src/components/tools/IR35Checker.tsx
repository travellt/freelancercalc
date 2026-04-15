'use client';

import { useState, useMemo } from 'react';
import { IR35_QUESTIONS, assessIR35, type IR35Answers, type IR35Result } from '@/lib/ir35';
import EmailCapture from './EmailCapture';

const CATEGORY_LABELS = {
  control: 'Control',
  substitution: 'Substitution',
  obligation: 'Mutuality of Obligation',
};

const CATEGORY_DESCRIPTIONS = {
  control: 'Does the client control how, when, and where you work?',
  substitution: 'Can you send someone else to do the work? This is the single most important factor.',
  obligation: 'Is there an ongoing obligation between you and the client?',
};

function QuestionCard({
  question, answer, onAnswer, index,
}: {
  question: (typeof IR35_QUESTIONS)[number];
  answer: string | undefined;
  onAnswer: (value: 'yes' | 'no' | 'unsure') => void;
  index: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{question.text}</p>
          <p className="mt-1 text-sm text-gray-500">{question.help}</p>
          {question.weight >= 3 && (
            <p className="mt-1 text-xs font-medium text-amber-600">High importance factor</p>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {question.options.map((opt) => (
              <button key={opt.value} onClick={() => onAnswer(opt.value)}
                className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-all sm:text-center ${
                  answer === opt.value
                    ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max, critical }: { label: string; score: number; max: number; critical?: boolean }) {
  const normalised = max > 0 ? ((score / max + 1) / 2) * 100 : 50;

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          {label}
          {critical && <span className="ml-1 text-xs font-medium text-amber-600">(critical)</span>}
        </span>
        <span className={`font-medium ${score > 0 ? 'text-green-700' : score < 0 ? 'text-red-700' : 'text-gray-500'}`}>
          {score > 0 ? 'Outside' : score < 0 ? 'Inside' : 'Neutral'}
        </span>
      </div>
      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="relative h-full">
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-400" />
          <div
            className={`absolute top-0 h-full transition-all duration-500 ${normalised >= 50 ? 'bg-green-500' : 'bg-red-400'}`}
            style={normalised >= 50 ? { left: '50%', width: `${normalised - 50}%` } : { left: `${normalised}%`, width: `${50 - normalised}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function IR35Checker() {
  const [answers, setAnswers] = useState<IR35Answers>({});

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = IR35_QUESTIONS.length;
  const allAnswered = answeredCount === totalQuestions;

  const result: IR35Result | null = useMemo(() => {
    if (answeredCount === 0) return null;
    return assessIR35(answers);
  }, [answers, answeredCount]);

  const handleAnswer = (id: string, value: 'yes' | 'no' | 'unsure') => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const grouped = IR35_QUESTIONS.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, typeof IR35_QUESTIONS>);

  return (
    <div>
      {/* Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{answeredCount} of {totalQuestions} questions answered</span>
          {answeredCount > 0 && (
            <button onClick={() => setAnswers({})} className="text-sm text-gray-400 hover:text-gray-600">Reset all</button>
          )}
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand-500 transition-all duration-300" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
        </div>
      </div>

      {/* Result summary */}
      {result && (
        <div className={`mt-6 rounded-xl border-2 p-6 ${
          result.status === 'likely-outside' ? 'border-green-300 bg-green-50' :
          result.status === 'likely-inside' ? 'border-red-300 bg-red-50' :
          'border-amber-300 bg-amber-50'
        }`}>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Current assessment</p>
            <p className={`mt-1 text-2xl font-bold ${
              result.status === 'likely-outside' ? 'text-green-800' :
              result.status === 'likely-inside' ? 'text-red-800' : 'text-amber-800'
            }`}>
              {result.status === 'likely-outside' ? 'Likely Outside IR35' :
               result.status === 'likely-inside' ? 'Likely Inside IR35' :
               'Borderline — Seek Professional Advice'}
            </p>
            {!allAnswered && <p className="mt-2 text-xs text-gray-500">Answer all questions for a more accurate assessment.</p>}
          </div>

          {/* Category scores */}
          <div className="mt-6 space-y-3">
            <ScoreBar label="Substitution" score={result.substitutionScore} max={result.substitutionMax} critical />
            <ScoreBar label="Control" score={result.controlScore} max={result.controlMax} />
            <ScoreBar label="Mutuality of obligation" score={result.obligationScore} max={result.obligationMax} />
          </div>
        </div>
      )}

      {/* Action items — things you can do to improve your position */}
      {result && result.actionItems.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-base font-semibold text-amber-900">Steps to strengthen your IR35 position</h3>
          <p className="mt-1 text-xs text-amber-700">Based on your answers, here are concrete actions you could take:</p>
          <ul className="mt-3 space-y-2">
            {result.actionItems.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions by category */}
      {(['substitution', 'control', 'obligation'] as const).map((category) => (
        <div key={category} className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">{CATEGORY_LABELS[category]}</h2>
          <p className="mt-1 text-sm text-gray-500">{CATEGORY_DESCRIPTIONS[category]}</p>
          <div className="mt-4 space-y-4">
            {grouped[category]?.map((q) => (
              <QuestionCard key={q.id} question={q} answer={answers[q.id]}
                onAnswer={(v) => handleAnswer(q.id, v)}
                index={IR35_QUESTIONS.indexOf(q)} />
            ))}
          </div>
        </div>
      ))}

      {/* Next steps */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-base font-semibold text-gray-900">What to do next</h3>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">1</span>
            <p><strong>Check with HMRC&apos;s CEST tool</strong> — the official Check Employment Status for Tax tool at gov.uk. It&apos;s not perfect, but HMRC will stand by its result if you provide accurate answers.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">2</span>
            <p><strong>Review your contract</strong> — ensure it reflects the reality of how you work, not just what sounds good. HMRC looks at practice over paperwork.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">3</span>
            <p><strong>Consider IR35 insurance</strong> — policies typically cost £200-500/year and cover legal defence costs and potential tax liabilities if investigated.</p>
          </div>
          {result?.status === 'borderline' && (
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">!</span>
              <p><strong>Get specialist advice</strong> — for a borderline case, a one-off IR35 contract review typically costs £200-400 and can save thousands in potential back-tax.</p>
            </div>
          )}
        </div>
      </div>

      {/* Email capture */}
      {result && (
        <EmailCapture
          toolName="IR35 Status Checker"
          resultsSummary={`IR35 assessment: ${result.status === 'likely-outside' ? 'Likely Outside IR35' : result.status === 'likely-inside' ? 'Likely Inside IR35' : 'Borderline'} | Score: ${result.score}%`}
          resultsHtml={`
            <h2>Your IR35 Status Assessment</h2>
            <p><strong>Result:</strong> ${result.status === 'likely-outside' ? 'Likely Outside IR35' : result.status === 'likely-inside' ? 'Likely Inside IR35' : 'Borderline — Seek Professional Advice'}</p>
            <p><strong>Score:</strong> ${result.score}% (higher = more likely outside IR35)</p>
            <p style="color:#6b7280;font-size:12px">Assessed at freelancercalc.co.uk. This is not legal advice.</p>
          `}
        />
      )}

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">Important disclaimer</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>This is an indicative assessment only — not legal or tax advice.</li>
          <li>IR35 is determined by the overall picture, not any single factor. Courts weigh substitution particularly heavily.</li>
          <li>Since April 2021, medium and large private sector clients determine your status under the off-payroll working rules.</li>
          <li>HMRC&apos;s CEST tool is the official assessment — use it alongside this tool for a more complete picture.</li>
          <li>If you&apos;re borderline, a specialist IR35 advisor (typically £200-400 for a contract review) is well worth the investment.</li>
        </ul>
      </div>
    </div>
  );
}
