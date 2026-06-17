import { NextResponse } from 'next/server';
import { getStatsSummary } from '../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getStatsSummary();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat statistik' },
      { status: 500 }
    );
  }
}
