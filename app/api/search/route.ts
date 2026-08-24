import { NextRequest, NextResponse } from 'next/server';
import { searchEntities } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  try {
    const results = await searchEntities(q);
    return NextResponse.json({ status: 'success', data: results });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to perform search' },
      { status: 500 }
    );
  }
}
