import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Redirect server-side — tidak perlu spinner client-side.
// Middleware juga menangani ini; halaman ini cadangan jika middleware dilewati.
export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const role = cookieStore.get('role')?.value;

  if (token && role === 'admin') {
    redirect('/admin');
  }
  if (token && role === 'user') {
    redirect('/home');
  }
  redirect('/login');
}
