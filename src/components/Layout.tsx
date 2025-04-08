
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-3 sm:px-4 md:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
