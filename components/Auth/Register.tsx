
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, auth, isOffline } from '../../firebase';
import { Link, useHistory } from 'react-router-dom';
import { Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  // Replaced useNavigate with useHistory to support potential v5 environment
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      setError('展示模式下無法建立新帳號');
      return;
    }
    if (password !== confirmPassword) {
      setError('密碼不一致');
      return;
    }
    try {
      if (!auth) throw new Error("Auth not initialized");
      await createUserWithEmailAndPassword(auth, email, password);
      history.push('/dashboard');
    } catch (err: any) {
      setError('註冊失敗：' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">加入 SmartFinance</h2>
          <p className="text-slate-500 mt-2">開始您的智慧理財旅程</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">電子郵件</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">密碼</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">確認密碼</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            註冊帳號
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600">
          已有帳號？ <Link to="/login" className="text-indigo-600 font-bold hover:underline">返回登入</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
