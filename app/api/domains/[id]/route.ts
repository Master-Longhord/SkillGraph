import { NextRequest, NextResponse } from 'next/server';
import { getDomainById } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getDomainById(id);
    if (!data) {
      return NextResponse.json({ status: 'error', message: 'Domain not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch domain details' },
      { status: 500 }
    );
  }
}
