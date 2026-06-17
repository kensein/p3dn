import { NextResponse } from 'next/server';
import { getBmnItems } from '../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const category = searchParams.get('kategori') || undefined;
    const condition = searchParams.get('kondisi') || undefined;
    const data = await getBmnItems({ q, category, condition });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data BMN' },
      { status: 500 }
    );
  }
}
