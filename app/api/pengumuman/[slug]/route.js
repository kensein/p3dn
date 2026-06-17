import { NextResponse } from 'next/server';
import { getAnnouncementBySlug } from '../../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const data = await getAnnouncementBySlug(slug);
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Pengumuman tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat pengumuman' },
      { status: 500 }
    );
  }
}
