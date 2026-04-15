import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

interface Subscriber {
  email: string;
  toolName: string;
  subscribeDigest: boolean;
  createdAt: string;
}

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscriber(subscriber: Subscriber): Promise<void> {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  const subscribers = await loadSubscribers();
  // Don't duplicate — update existing entry for same email
  const existing = subscribers.findIndex(s => s.email === subscriber.email);
  if (existing >= 0) {
    subscribers[existing] = { ...subscribers[existing], ...subscriber };
  } else {
    subscribers.push(subscriber);
  }
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, toolName, resultsSummary, resultsHtml, subscribeDigest } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Store subscriber (always — even if email sending fails later)
    await saveSubscriber({
      email,
      toolName: toolName || 'unknown',
      subscribeDigest: subscribeDigest ?? true,
      createdAt: new Date().toISOString(),
    });

    // TODO: Send email via Resend/Buttondown when API key is configured
    // For now, just store the subscriber. When RESEND_API_KEY or
    // BUTTONDOWN_API_KEY env var is set, this will send the actual email.
    //
    // Integration point:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'FreelancerCalc <results@freelancercalc.co.uk>',
    //   to: email,
    //   subject: `Your ${toolName} results — FreelancerCalc`,
    //   html: buildEmailHtml(toolName, resultsSummary, resultsHtml),
    // });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
