import { NextResponse } from 'next/server';
import { getSummaryStats } from '@/lib/db/queries';

export async function GET() {
  try {
    const stats = await getSummaryStats();
    return NextResponse.json({ status: 'success', data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch graph statistics' },
      { status: 500 }
    );
  }
}
