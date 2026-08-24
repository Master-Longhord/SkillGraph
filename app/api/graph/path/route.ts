import { NextRequest, NextResponse } from 'next/server';
import { getShortestPath } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source');
  const target = searchParams.get('target');

  if (!source || !target) {
    return NextResponse.json(
      { status: 'error', message: 'Both source and target query parameters are required' },
      { status: 400 }
    );
  }

  try {
    const data = await getShortestPath(source, target);
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to calculate shortest path' },
      { status: 500 }
    );
  }
}
