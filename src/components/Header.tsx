import { User } from '../App';
import { Button } from './ui/button';
import { Menu, User as UserIcon, Home, LogOut } from 'lucide-react';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { motion } from 'motion/react';

type HeaderProps = {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  currentView: 'home' | 'profile';
  onViewChange: (view: 'home' | 'profile') => void;
};

export function Header({ currentUser, onLogin, onLogout, currentView, onViewChange }: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-[#E0ECDE] backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => onViewChange("home")}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-xl">⚽</span>
              </motion.div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                TurfBook
              </span>
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => onViewChange("home")}
                    className={
                      currentView === "home" ? "bg-green-50 text-green-700" : ""
                    }
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => onViewChange("profile")}
                    className={
                      currentView === "profile"
                        ? "bg-green-50 text-green-700"
                        : ""
                    }
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-800 hover:to-emerald-800 text-white border-0 transition-colors duration-200"
                >
                  Login / Register
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-2 mt-8">
                  {currentUser ? (
                    <>
                      <div className="pb-4 mb-4 border-b">
                        <p className="text-sm text-gray-500">Logged in as</p>
                        <p>{currentUser.name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onViewChange("home");
                          setMobileMenuOpen(false);
                        }}
                        className={`justify-start ${
                          currentView === "home" ? "bg-gray-100" : ""
                        }`}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onViewChange("profile");
                          setMobileMenuOpen(false);
                        }}
                        className={`justify-start ${
                          currentView === "profile" ? "bg-gray-100" : ""
                        }`}
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Login / Register
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={onLogin}
      />
    </>
  );
}
