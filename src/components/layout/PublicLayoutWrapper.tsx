'use client';

import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide public layout elements on admin, login, and pdf preview routes
  const isExcludedRoute = pathname === '/login' || 
                          pathname?.startsWith('/admin') || 
                          pathname?.startsWith('/api') || 
                          pathname?.startsWith('/pdf-');

  if (isExcludedRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
