export interface IR35Question {
  id: string;
  text: string;
  help: string;
  options: { value: 'yes' | 'no' | 'unsure'; label: string }[];
  weight: number;
  category: 'control' | 'substitution' | 'obligation';
  /** Tip shown when the user selects the "inside IR35" answer */
  insideTip?: string;
}

export const IR35_QUESTIONS: IR35Question[] = [
  // Substitution — most important factor
  {
    id: 'substitution',
    text: 'Could you send a substitute to do the work?',
    help: 'Do you have a genuine, contractual right to send someone else in your place? Have you ever done so, or could you realistically?',
    options: [
      { value: 'yes', label: 'Yes — I have a genuine right of substitution' },
      { value: 'no', label: 'No — the client expects me personally' },
      { value: 'unsure', label: 'In theory but never tested' },
    ],
    weight: 4,
    category: 'substitution',
    insideTip: 'This is the strongest single indicator. Add a substitution clause to your contract and ensure the client would genuinely accept a substitute of equivalent skill.',
  },
  {
    id: 'sub-cost',
    text: 'If you sent a substitute, who would pay them?',
    help: 'Would you pay the substitute from your own fees, or would the client pay them directly?',
    options: [
      { value: 'yes', label: 'I would pay them from my fees' },
      { value: 'no', label: 'The client would pay them / not applicable' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 3,
    category: 'substitution',
    insideTip: 'Paying the substitute yourself (and bearing the financial risk of their work) is a strong indicator of self-employment.',
  },
  // Control
  {
    id: 'how-work',
    text: 'Do you decide how the work is done?',
    help: 'Can the client tell you exactly how to perform your tasks, or do they just specify the end result?',
    options: [
      { value: 'yes', label: 'I decide how to do the work' },
      { value: 'no', label: 'The client directs how I work' },
      { value: 'unsure', label: 'A mixture' },
    ],
    weight: 2,
    category: 'control',
    insideTip: 'Ensure your contract specifies deliverables/outcomes rather than methods. Push back on client processes that dictate how you work.',
  },
  {
    id: 'when-work',
    text: 'Do you decide when you work?',
    help: 'Are you free to set your own hours, or does the client require you to work specific hours?',
    options: [
      { value: 'yes', label: 'I set my own schedule' },
      { value: 'no', label: 'The client sets my hours' },
      { value: 'unsure', label: 'Some flexibility' },
    ],
    weight: 1,
    category: 'control',
    insideTip: 'Try to avoid fixed 9-5 requirements. Even small flexibility (e.g., choosing start time, working some days remotely) helps.',
  },
  {
    id: 'where-work',
    text: 'Do you decide where you work?',
    help: 'Can you work from anywhere, or must you be at the client\'s premises?',
    options: [
      { value: 'yes', label: 'I choose where I work' },
      { value: 'no', label: 'I must work at their location' },
      { value: 'unsure', label: 'Mixture of both' },
    ],
    weight: 1,
    category: 'control',
    insideTip: 'Some on-site work is fine if the nature of the work requires it (e.g., hardware). But 100% on-site with a desk and badge looks like employment.',
  },
  {
    id: 'supervision',
    text: 'Can the client move you to different tasks?',
    help: 'Can the client reassign you to different work, or are you engaged for a specific project/deliverable?',
    options: [
      { value: 'no', label: 'No — I\'m engaged for specific deliverables' },
      { value: 'yes', label: 'Yes — they can reassign me' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'control',
    insideTip: 'Your contract should define a specific scope of work or project. A vague "provide services as directed" is a red flag.',
  },
  // Mutuality of obligation
  {
    id: 'obligation-offer',
    text: 'Is the client obliged to offer you work?',
    help: 'Must the client provide you with work for the duration of the contract, or can they end it when a project finishes?',
    options: [
      { value: 'no', label: 'No obligation to offer ongoing work' },
      { value: 'yes', label: 'Yes — they must provide work continuously' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'obligation',
    insideTip: 'Contracts should be project-based with defined end dates, not open-ended rolling arrangements.',
  },
  {
    id: 'obligation-accept',
    text: 'Are you obliged to accept work offered?',
    help: 'If the client offers you additional work or extends the contract, must you accept?',
    options: [
      { value: 'no', label: 'No — I can turn down work' },
      { value: 'yes', label: 'Yes — I\'m expected to accept' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'obligation',
    insideTip: 'You should be free to decline additional work. An obligation to accept all work offered looks like employment.',
  },
  // Other indicators
  {
    id: 'equipment',
    text: 'Do you provide your own equipment?',
    help: 'Do you use your own laptop, software, tools — or does the client provide everything?',
    options: [
      { value: 'yes', label: 'I provide my own equipment' },
      { value: 'no', label: 'The client provides equipment' },
      { value: 'unsure', label: 'A mix of both' },
    ],
    weight: 1,
    category: 'control',
    insideTip: 'Use your own equipment where possible. If you must use client equipment (e.g., security policy), document the business reason.',
  },
  {
    id: 'financial-risk',
    text: 'Do you bear financial risk?',
    help: 'Could you make a loss? E.g., fixed-price work where you underestimate effort, costs you bear yourself, rectifying defective work at your own cost.',
    options: [
      { value: 'yes', label: 'Yes — I bear financial risk' },
      { value: 'no', label: 'No — I\'m paid for time regardless' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'obligation',
    insideTip: 'Consider offering fixed-price work for at least some deliverables. Having to fix defective work at your own cost is a strong outside indicator.',
  },
  {
    id: 'part-of-org',
    text: 'Are you part of the client\'s organisation?',
    help: 'Do you attend their all-hands, use their email, appear on their org chart, have a staff badge, get invited to socials?',
    options: [
      { value: 'no', label: 'No — I\'m clearly separate' },
      { value: 'yes', label: 'Yes — I\'m integrated into their team' },
      { value: 'unsure', label: 'Somewhat' },
    ],
    weight: 1,
    category: 'control',
    insideTip: 'Use your own email address, don\'t attend internal socials/events, and ensure you\'re identified as an external contractor.',
  },
  {
    id: 'multiple-clients',
    text: 'Do you work for other clients simultaneously?',
    help: 'Are you free to (and do you) work for other clients at the same time?',
    options: [
      { value: 'yes', label: 'Yes — I have other clients' },
      { value: 'no', label: 'No — this is my only client' },
      { value: 'unsure', label: 'I could but currently don\'t' },
    ],
    weight: 1,
    category: 'obligation',
    insideTip: 'Having multiple clients is a strong indicator of self-employment. Even small side projects help. Ensure your contract doesn\'t prohibit other work.',
  },
  {
    id: 'contract-length',
    text: 'How long have you been on this contract?',
    help: 'Longer engagements with the same client increase IR35 risk, even if the contract is renewed separately.',
    options: [
      { value: 'yes', label: 'Less than 12 months' },
      { value: 'unsure', label: '1-2 years' },
      { value: 'no', label: 'More than 2 years' },
    ],
    weight: 1,
    category: 'obligation',
    insideTip: 'Long-term single-client arrangements look increasingly like employment. Consider varying scope, taking breaks between contracts, or working for other clients in parallel.',
  },
];

export type IR35Answers = Record<string, 'yes' | 'no' | 'unsure'>;

export interface IR35Result {
  score: number;
  maxScore: number;
  status: 'likely-outside' | 'borderline' | 'likely-inside';
  controlScore: number;
  substitutionScore: number;
  obligationScore: number;
  controlMax: number;
  substitutionMax: number;
  obligationMax: number;
  breakdown: { id: string; question: string; answer: string; points: number; category: string; tip?: string }[];
  actionItems: string[];
}

export function assessIR35(answers: IR35Answers): IR35Result {
  let score = 0;
  let maxScore = 0;
  let controlScore = 0, substitutionScore = 0, obligationScore = 0;
  let controlMax = 0, substitutionMax = 0, obligationMax = 0;

  const breakdown: IR35Result['breakdown'] = [];
  const actionItems: string[] = [];

  for (const q of IR35_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer) continue;

    maxScore += q.weight;

    let points = 0;
    if (answer === 'yes') points = q.weight;
    else if (answer === 'no') points = -q.weight;

    score += points;

    if (q.category === 'control') { controlScore += points; controlMax += q.weight; }
    else if (q.category === 'substitution') { substitutionScore += points; substitutionMax += q.weight; }
    else { obligationScore += points; obligationMax += q.weight; }

    // Collect tips for "inside" answers
    if (points < 0 && q.insideTip) {
      actionItems.push(q.insideTip);
    }

    breakdown.push({
      id: q.id,
      question: q.text,
      answer: q.options.find(o => o.value === answer)?.label ?? answer,
      points,
      category: q.category,
      tip: points < 0 ? q.insideTip : undefined,
    });
  }

  // Weighted scoring: substitution is critical
  // If substitution is strongly negative, cap the overall assessment
  const normalised = maxScore > 0 ? score / maxScore : 0;
  const subNormalised = substitutionMax > 0 ? substitutionScore / substitutionMax : 0;

  let status: IR35Result['status'];
  if (subNormalised < -0.5 && normalised < 0.5) {
    // Weak substitution position overrides otherwise positive indicators
    status = normalised > 0 ? 'borderline' : 'likely-inside';
  } else if (normalised > 0.3) {
    status = 'likely-outside';
  } else if (normalised < -0.2) {
    status = 'likely-inside';
  } else {
    status = 'borderline';
  }

  return {
    score, maxScore, status,
    controlScore, substitutionScore, obligationScore,
    controlMax, substitutionMax, obligationMax,
    breakdown, actionItems,
  };
}
