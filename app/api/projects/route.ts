import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/db/queries';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ status: 'success', data: projects });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
