import { NextResponse } from 'next/server';
import { getDomains } from '@/lib/db/queries';

export async function GET() {
  try {
    const domains = await getDomains();
    return NextResponse.json({ status: 'success', data: domains });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}
