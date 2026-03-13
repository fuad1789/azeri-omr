import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import OMRDashboard from '@/components/omr-dashboard';

export default async function OMRPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <OMRDashboard />
    </main>
  );
}