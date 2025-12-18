
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
// Fix: Separate type and value imports for Firebase Auth
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, isOffline } from './firebase';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import { LayoutDashboard, Wallet, ReceiptText, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ user, handleLogout }: { user: User | null, handleLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link 
      to={to} 
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-indigo-600">SmartFinance</h1>
            <p className="text-xs text-slate-400">AI Powered Wealth Management</p>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="儀表板" />
            <NavItem to="/accounts" icon={Wallet} label="帳戶管理" />
            <NavItem to="/transactions" icon={ReceiptText} label="財務紀錄" />
          </nav>

          <div className="mt-auto pt-6 border-t">
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
              {isOffline && <span className="text-[10px] text-orange-500 font-bold uppercase">Demo Mode</span>}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>登出</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Fix: Using React.FC with PropsWithChildren to ensure 'children' is recognized by the compiler
const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOffline) {
      // Mock user for demo mode
      setUser({ email: 'demo@example.com', uid: 'demo' } as User);
      setLoading(false);
      return;
    }

    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    if (!isOffline && auth) {
      await signOut(auth);
    }
    navigate('/login');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">載入中...</div>;
  if (!user && !isOffline) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar user={user} handleLogout={handleLogout} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </HashRouter>
  );
}
