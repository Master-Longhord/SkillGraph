import { NextRequest, NextResponse } from 'next/server';
import { getGraphExplorerData } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const centerId = searchParams.get('centerId') || undefined;
  const limit = parseInt(searchParams.get('limit') || '80', 10);

  try {
    const data = await getGraphExplorerData(centerId, limit);
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}
