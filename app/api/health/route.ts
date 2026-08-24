import { NextResponse } from 'next/server';
import { checkConnection } from '@/lib/db/driver';

export async function GET() {
  const status = await checkConnection();
  if (!status.connected) {
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        error: status.error || 'Failed to connect to CognoDB cluster',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: 'healthy',
    connected: true,
    message: 'Successfully connected to CognoDB database',
  });
}
