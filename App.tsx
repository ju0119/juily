
import React, { useState, useEffect } from 'react';
// Correctly import required components from react-router-dom v6
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, auth, isOffline } from './firebase';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import { LayoutDashboard, Wallet, ReceiptText, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ user, handleLogout }: { user: any, handleLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link 
      to={to} 
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight">SmartFinance</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI Wealth Guardian</p>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="財務儀表板" />
            <NavItem to="/accounts" icon={Wallet} label="我的帳戶" />
            <NavItem to="/transactions" icon={ReceiptText} label="收支明細" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="mb-4 px-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">當前用戶</p>
              <p className="text-sm font-bold text-slate-900 truncate mt-1">{user?.email}</p>
              {isOffline && (
                <div className="mt-2 px-2 py-1 bg-amber-50 rounded border border-amber-100">
                  <span className="text-[10px] text-amber-600 font-black uppercase">展示模式 (離線)</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold"
            >
              <LogOut size={20} />
              <span>登出系統</span>
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOffline) {
      setUser({ email: 'demo@smartfinance.ai', uid: 'demo' });
      setLoading(false);
      return;
    }

    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">正在安全進入系統...</p>
      </div>
    );
  }
  
  if (!user && !isOffline) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar user={user} handleLogout={handleLogout} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-10 transition-all duration-300">
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}
