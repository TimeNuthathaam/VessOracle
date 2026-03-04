import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Home } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-earth-100 border-b border-earth-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 text-earth-800 hover:text-earth-600 transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold text-lg tracking-tight">Vessavana Tarot</span>
            </Link>
            <nav className="flex gap-4">
              <Link to="/" className="flex items-center gap-1 text-sm font-medium text-earth-700 hover:text-earth-900">
                <Home className="w-4 h-4" />
                <span>หน้าหลัก</span>
              </Link>
              <Link to="/add" className="flex items-center gap-1 text-sm font-medium text-earth-700 hover:text-earth-900">
                <PlusCircle className="w-4 h-4" />
                <span>เพิ่มไพ่</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
