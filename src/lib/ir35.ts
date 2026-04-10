export interface IR35Question {
  id: string;
  text: string;
  help: string;
  options: { value: 'yes' | 'no' | 'unsure'; label: string }[];
  weight: number; // positive = outside IR35, negative = inside IR35
  category: 'control' | 'substitution' | 'obligation';
}

export const IR35_QUESTIONS: IR35Question[] = [
  // Control
  {
    id: 'how-work',
    text: 'Do you decide how the work is done?',
    help: 'Can the client tell you exactly how to perform your tasks, or do they just specify the end result they want?',
    options: [
      { value: 'yes', label: 'I decide how to do the work' },
      { value: 'no', label: 'The client directs how I work' },
      { value: 'unsure', label: 'A mixture / unsure' },
    ],
    weight: 2,
    category: 'control',
  },
  {
    id: 'when-work',
    text: 'Do you decide when you work?',
    help: 'Are you free to set your own hours, or does the client require you to work specific hours?',
    options: [
      { value: 'yes', label: 'I set my own schedule' },
      { value: 'no', label: 'The client sets my hours' },
      { value: 'unsure', label: 'Some flexibility / unsure' },
    ],
    weight: 1,
    category: 'control',
  },
  {
    id: 'where-work',
    text: 'Do you decide where you work?',
    help: 'Can you work from anywhere, or must you be at the client\'s premises?',
    options: [
      { value: 'yes', label: 'I choose where I work' },
      { value: 'no', label: 'I must work at their location' },
      { value: 'unsure', label: 'Mixture of both / unsure' },
    ],
    weight: 1,
    category: 'control',
  },
  {
    id: 'supervision',
    text: 'Can the client move you to different tasks?',
    help: 'Can the client reassign you to different work mid-contract, or are you engaged for a specific project/deliverable?',
    options: [
      { value: 'no', label: 'No — I\'m engaged for specific deliverables' },
      { value: 'yes', label: 'Yes — they can move me around' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'control',
  },
  // Substitution
  {
    id: 'substitution',
    text: 'Could you send a substitute to do the work?',
    help: 'Do you have the right to send someone else in your place, and have you actually done so or could you?',
    options: [
      { value: 'yes', label: 'Yes — I have a genuine right of substitution' },
      { value: 'no', label: 'No — the client expects me personally' },
      { value: 'unsure', label: 'In theory but never tested / unsure' },
    ],
    weight: 3,
    category: 'substitution',
  },
  {
    id: 'sub-cost',
    text: 'If you sent a substitute, who would pay them?',
    help: 'Would you pay the substitute from your own fees, or would the client pay them directly?',
    options: [
      { value: 'yes', label: 'I would pay them from my fees' },
      { value: 'no', label: 'The client would pay them / N/A' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'substitution',
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
  },
  // Other indicators
  {
    id: 'equipment',
    text: 'Do you provide your own equipment?',
    help: 'Do you use your own laptop, software, tools — or does the client provide everything?',
    options: [
      { value: 'yes', label: 'I provide my own equipment' },
      { value: 'no', label: 'The client provides equipment' },
      { value: 'unsure', label: 'A mix of both / unsure' },
    ],
    weight: 1,
    category: 'control',
  },
  {
    id: 'financial-risk',
    text: 'Do you bear financial risk?',
    help: 'Could you make a loss on this engagement? E.g., fixed price work where you underestimate effort, or costs you bear yourself.',
    options: [
      { value: 'yes', label: 'Yes — I bear financial risk' },
      { value: 'no', label: 'No — I\'m paid for time regardless' },
      { value: 'unsure', label: 'Unsure' },
    ],
    weight: 2,
    category: 'obligation',
  },
  {
    id: 'part-of-org',
    text: 'Are you part of the client\'s organisation?',
    help: 'Do you attend their meetings, use their email, appear on their org chart, have a staff badge?',
    options: [
      { value: 'no', label: 'No — I\'m clearly separate' },
      { value: 'yes', label: 'Yes — I\'m integrated into their team' },
      { value: 'unsure', label: 'Somewhat / unsure' },
    ],
    weight: 1,
    category: 'control',
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
  },
];

export type IR35Answers = Record<string, 'yes' | 'no' | 'unsure'>;

export interface IR35Result {
  score: number; // positive = outside, negative = inside
  maxScore: number;
  minScore: number;
  status: 'likely-outside' | 'borderline' | 'likely-inside';
  controlScore: number;
  substitutionScore: number;
  obligationScore: number;
  breakdown: { id: string; question: string; answer: string; points: number; category: string }[];
}

export function assessIR35(answers: IR35Answers): IR35Result {
  let score = 0;
  let maxScore = 0;
  let minScore = 0;
  let controlScore = 0;
  let substitutionScore = 0;
  let obligationScore = 0;

  const breakdown: IR35Result['breakdown'] = [];

  for (const q of IR35_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer) continue;

    maxScore += q.weight;
    minScore -= q.weight;

    let points = 0;
    if (answer === 'yes') points = q.weight;
    else if (answer === 'no') points = -q.weight;
    // unsure = 0 points

    score += points;

    if (q.category === 'control') controlScore += points;
    else if (q.category === 'substitution') substitutionScore += points;
    else obligationScore += points;

    breakdown.push({
      id: q.id,
      question: q.text,
      answer: answer === 'yes' ? q.options[0].label : answer === 'no' ? q.options[1].label : q.options[2].label,
      points,
      category: q.category,
    });
  }

  const normalised = maxScore > 0 ? score / maxScore : 0;
  let status: IR35Result['status'];
  if (normalised > 0.3) status = 'likely-outside';
  else if (normalised < -0.3) status = 'likely-inside';
  else status = 'borderline';

  return { score, maxScore, minScore, status, controlScore, substitutionScore, obligationScore, breakdown };
}
