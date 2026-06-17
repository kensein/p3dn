import { NextResponse } from 'next/server';
import { getExternalLinks } from '../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getExternalLinks();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat tautan' },
      { status: 500 }
    );
  }
}
