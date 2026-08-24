import { NextRequest, NextResponse } from 'next/server';
import { getTechnologyById } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getTechnologyById(id);
    if (!data) {
      return NextResponse.json({ status: 'error', message: 'Technology not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch technology details' },
      { status: 500 }
    );
  }
}
