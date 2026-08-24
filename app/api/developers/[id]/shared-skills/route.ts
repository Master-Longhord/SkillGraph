import { NextRequest, NextResponse } from 'next/server';
import { getSharedSkills } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getSharedSkills(id);
    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch shared skills' },
      { status: 500 }
    );
  }
}
