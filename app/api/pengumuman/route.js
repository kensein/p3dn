import { NextResponse } from 'next/server';
import { getAnnouncements } from '../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const category = searchParams.get('kategori') || undefined;
    const limitRaw = searchParams.get('limit');
    const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;

    const data = await getAnnouncements({ q, category, limit });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat pengumuman' },
      { status: 500 }
    );
  }
}
