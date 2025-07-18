import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), 'feedback.json');

export async function POST(req: NextRequest) {
  try {
    const { talentId, liked, brief } = await req.json();

    if (!talentId || brief === undefined || liked === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      talentId,
      brief,
      liked,
    };

    let feedbacks = [];
    if (fs.existsSync(FEEDBACK_FILE)) {
      const fileContent = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
      if (fileContent) {
        feedbacks = JSON.parse(fileContent);
      }
    }

    feedbacks.push(feedbackEntry);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));

    console.log('Feedback received:', feedbackEntry);
    return NextResponse.json({ message: 'Feedback recorded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
