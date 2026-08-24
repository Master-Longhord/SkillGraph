import { NextResponse } from 'next/server';
import { getTechnologies } from '@/lib/db/queries';

export async function GET() {
  try {
    const technologies = await getTechnologies();
    return NextResponse.json({ status: 'success', data: technologies });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
}
