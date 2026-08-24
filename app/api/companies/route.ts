import { NextResponse } from 'next/server';
import { getCompanies } from '@/lib/db/queries';

export async function GET() {
  try {
    const companies = await getCompanies();
    return NextResponse.json({ status: 'success', data: companies });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
