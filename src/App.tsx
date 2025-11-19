import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { UserProfile } from './components/UserProfile';
import { Toaster } from './components/ui/sonner';

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

export type Booking = {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email?: string;
  sport: string;
  date: string;
  slots: string[];
  players?: number;
  notes?: string;
  paymentMethod: string;
  paymentAmount: 'confirmation' | 'full';
  discountCode?: string;
  totalPrice: number;
  createdAt: string;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#CDE0C9]">
      <Header
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="pb-20">
        {currentView === 'home' ? (
          <HomePage currentUser={currentUser} />
        ) : (
          <UserProfile currentUser={currentUser} onLogout={handleLogout} />
        )}
      </main>

      <Toaster />
    </div>
  );
}
