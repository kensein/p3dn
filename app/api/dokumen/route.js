import { NextResponse } from 'next/server';
import { getDocuments } from '../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const docType = searchParams.get('jenis') || undefined;
    const data = await getDocuments({ docType });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat dokumen' },
      { status: 500 }
    );
  }
}
