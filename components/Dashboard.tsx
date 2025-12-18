
import React, { useState, useEffect } from 'react';
import { db, auth, isOffline, collection, query, where, onSnapshot } from '../firebase';
import { DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from '../constants';
import { BankAccount, Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles, Loader2 } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';

const Dashboard = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setAccounts(DEMO_ACCOUNTS);
      setTransactions(DEMO_TRANSACTIONS);
      return;
    }

    if (!db || !auth?.currentUser) return;

    const qAcc = query(collection(db, 'accounts'), where('userId', '==', auth.currentUser.uid));
    const unsubscribeAcc = onSnapshot(qAcc, (snapshot: any) => {
      setAccounts(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as BankAccount)));
    });

    const qTx = query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid));
    const unsubscribeTx = onSnapshot(qTx, (snapshot: any) => {
      setTransactions(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Transaction)));
    });

    return () => {
      unsubscribeAcc();
      unsubscribeTx();
    };
  }, []);

  const requestAdvice = async () => {
    setLoadingAdvice(true);
    const advice = await getFinancialAdvice(accounts, transactions);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // 圖表數據準備
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.categoryName);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.categoryName, value: t.amount });
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">財務概況</h2>
          <p className="text-slate-500">掌握您的財富動向</p>
        </div>
        <button 
          onClick={requestAdvice}
          disabled={loadingAdvice || transactions.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loadingAdvice ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          AI 建議分析
        </button>
      </header>

      {/* 總額卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">總資產</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">${totalBalance.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">總收入</span>
          </div>
          <p className="text-3xl font-bold text-emerald-700">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <TrendingDown size={16} />
            <span className="text-sm font-bold">總支出</span>
          </div>
          <p className="text-3xl font-bold text-rose-700">${totalExpense.toLocaleString()}</p>
        </div>
      </div>

      {/* AI 建議區塊 */}
      {aiAdvice && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-700 mb-3">
            <Sparkles size={20} />
            <h3 className="font-bold">AI 財務管家建議</h3>
          </div>
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{aiAdvice}</div>
        </div>
      )}

      {/* 圖表區塊 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="font-bold text-slate-800 mb-4">支出分布 (依分類)</h3>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">尚無支出紀錄</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="font-bold text-slate-800 mb-4">收支對比</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: '本月', 收入: totalIncome, 支出: totalExpense }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="收入" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="支出" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
