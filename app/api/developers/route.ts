import { NextResponse } from 'next/server';
import { getDevelopers } from '@/lib/db/queries';

export async function GET() {
  try {
    const developers = await getDevelopers();
    return NextResponse.json({ status: 'success', data: developers });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}
