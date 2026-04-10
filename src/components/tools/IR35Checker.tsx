'use client';

import { useState, useMemo } from 'react';
import { IR35_QUESTIONS, assessIR35, type IR35Answers, type IR35Result } from '@/lib/ir35';

const CATEGORY_LABELS = {
  control: 'Control',
  substitution: 'Substitution',
  obligation: 'Mutuality of Obligation',
};

function QuestionCard({
  question,
  answer,
  onAnswer,
  index,
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
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-all sm:text-center ${
                  answer === opt.value
                    ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  // Normalise to 0-100 where 50 is neutral
  const normalised = max > 0 ? ((score / max + 1) / 2) * 100 : 50;

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${score > 0 ? 'text-green-700' : score < 0 ? 'text-red-700' : 'text-gray-500'}`}>
          {score > 0 ? 'Outside' : score < 0 ? 'Inside' : 'Neutral'}
        </span>
      </div>
      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="relative h-full">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-400" />
          {/* Score bar */}
          <div
            className={`absolute top-0 h-full transition-all duration-500 ${
              normalised >= 50 ? 'bg-green-500' : 'bg-red-400'
            }`}
            style={
              normalised >= 50
                ? { left: '50%', width: `${normalised - 50}%` }
                : { left: `${normalised}%`, width: `${50 - normalised}%` }
            }
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

  const handleReset = () => setAnswers({});

  // Group questions by category
  const grouped = IR35_QUESTIONS.reduce(
    (acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    },
    {} as Record<string, typeof IR35_QUESTIONS>
  );

  return (
    <div>
      {/* Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {answeredCount} of {totalQuestions} questions answered
          </span>
          {answeredCount > 0 && (
            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600">
              Reset all
            </button>
          )}
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Result summary (shows after first answer) */}
      {result && (
        <div
          className={`mt-6 rounded-xl border-2 p-6 ${
            result.status === 'likely-outside'
              ? 'border-green-300 bg-green-50'
              : result.status === 'likely-inside'
                ? 'border-red-300 bg-red-50'
                : 'border-amber-300 bg-amber-50'
          }`}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Current assessment</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                result.status === 'likely-outside'
                  ? 'text-green-800'
                  : result.status === 'likely-inside'
                    ? 'text-red-800'
                    : 'text-amber-800'
              }`}
            >
              {result.status === 'likely-outside'
                ? 'Likely Outside IR35'
                : result.status === 'likely-inside'
                  ? 'Likely Inside IR35'
                  : 'Borderline — Seek Professional Advice'}
            </p>
            {!allAnswered && (
              <p className="mt-2 text-xs text-gray-500">
                Answer all questions for a more accurate assessment.
              </p>
            )}
          </div>

          {/* Category scores */}
          <div className="mt-6 space-y-3">
            <ScoreBar
              label="Control"
              score={result.controlScore}
              max={IR35_QUESTIONS.filter((q) => q.category === 'control').reduce((s, q) => s + q.weight, 0)}
            />
            <ScoreBar
              label="Substitution"
              score={result.substitutionScore}
              max={IR35_QUESTIONS.filter((q) => q.category === 'substitution').reduce((s, q) => s + q.weight, 0)}
            />
            <ScoreBar
              label="Mutuality of obligation"
              score={result.obligationScore}
              max={IR35_QUESTIONS.filter((q) => q.category === 'obligation').reduce((s, q) => s + q.weight, 0)}
            />
          </div>
        </div>
      )}

      {/* Questions by category */}
      {(['control', 'substitution', 'obligation'] as const).map((category) => (
        <div key={category} className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">
            {CATEGORY_LABELS[category]}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {category === 'control' && 'Does the client control how, when, and where you work?'}
            {category === 'substitution' && 'Can you send someone else to do the work instead of you?'}
            {category === 'obligation' && 'Is there an ongoing obligation between you and the client?'}
          </p>
          <div className="mt-4 space-y-4">
            {grouped[category]?.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                answer={answers[q.id]}
                onAnswer={(v) => handleAnswer(q.id, v)}
                index={IR35_QUESTIONS.indexOf(q)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">Important disclaimer</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>This tool provides an indicative assessment only. It is not a substitute for professional legal or tax advice.</li>
          <li>IR35 status is determined by the overall picture of your working arrangement, not any single factor.</li>
          <li>HMRC&apos;s own CEST tool (Check Employment Status for Tax) is the official assessment — but it has known limitations.</li>
          <li>Since April 2021 (off-payroll working rules), medium and large private sector clients are responsible for determining your IR35 status.</li>
          <li>If you&apos;re borderline or unsure, consult a specialist IR35 advisor or employment status lawyer.</li>
        </ul>
      </div>
    </div>
  );
}
