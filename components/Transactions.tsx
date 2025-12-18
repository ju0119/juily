
import React, { useState, useEffect } from 'react';
import { db, auth, isOffline, collection, addDoc, doc, query, where, onSnapshot, getDoc, updateDoc, deleteDoc } from '../firebase';
import { Transaction, BankAccount } from '../types';
import { DEFAULT_CATEGORIES, DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from '../constants';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [form, setForm] = useState({
    accountId: '',
    amount: 0,
    type: 'expense' as 'income' | 'expense',
    categoryId: DEFAULT_CATEGORIES.find(c => c.type === 'expense')?.id || '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    if (isOffline) {
      setAccounts(DEMO_ACCOUNTS);
      setTransactions(DEMO_TRANSACTIONS);
      return;
    }
    if (!db || !auth?.currentUser) return;

    const qTx = query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid));
    const unsubTx = onSnapshot(qTx, (snapshot: any) => {
      setTransactions(snapshot.docs.map((docSnap: any) => ({ id: docSnap.id, ...docSnap.data() } as Transaction)));
    });

    const qAcc = query(collection(db, 'accounts'), where('userId', '==', auth.currentUser.uid));
    const unsubAcc = onSnapshot(qAcc, (snapshot: any) => {
      setAccounts(snapshot.docs.map((docSnap: any) => ({ id: docSnap.id, ...docSnap.data() } as BankAccount)));
    });

    return () => { unsubTx(); unsubAcc(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) return;
    if (!db || !auth?.currentUser) return;

    const category = DEFAULT_CATEGORIES.find(c => c.id === form.categoryId);
    const txData = {
      ...form,
      amount: Number(form.amount),
      categoryName: category?.name || '未分類',
      userId: auth.currentUser.uid
    };

    // 1. 新增交易
    await addDoc(collection(db, 'transactions'), txData);

    // 2. 更新帳戶餘額
    const accRef = doc(db, 'accounts', form.accountId);
    const accSnap = await getDoc(accRef);
    if (accSnap.exists()) {
      const data = accSnap.data() as any;
      const currentBalance = data.balance;
      const newBalance = form.type === 'income' 
        ? currentBalance + Number(form.amount) 
        : currentBalance - Number(form.amount);
      await updateDoc(accRef, { balance: newBalance });
    }

    setForm({ ...form, amount: 0, note: '' });
  };

  const handleDelete = async (tx: Transaction) => {
    if (isOffline || !db) return;
    if (window.confirm('確定刪除此紀錄？帳戶餘額將會恢復。')) {
      await deleteDoc(doc(db, 'transactions', tx.id));
      const accRef = doc(db, 'accounts', tx.accountId);
      const accSnap = await getDoc(accRef);
      if (accSnap.exists()) {
        const data = accSnap.data() as any;
        const currentBalance = data.balance;
        const newBalance = tx.type === 'income' 
          ? currentBalance - tx.amount 
          : currentBalance + tx.amount;
        await updateDoc(accRef, { balance: newBalance });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">財務紀錄</h2>
        <p className="text-slate-500">詳細追蹤您的每一筆收支</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">新增交易紀錄</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg"
            value={form.accountId}
            onChange={(e) => setForm({ ...form, accountId: e.target.value })}
            required
          >
            <option value="">選擇帳戶</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>

          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as any, categoryId: DEFAULT_CATEGORIES.find(c => c.type === e.target.value)?.id || '' })}
          >
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>

          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {DEFAULT_CATEGORIES.filter(c => c.type === form.type).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="金額" 
            className="px-4 py-2 border border-slate-200 rounded-lg"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            required
          />

          <input 
            type="date" 
            className="px-4 py-2 border border-slate-200 rounded-lg"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <input 
            type="text" 
            placeholder="備註" 
            className="px-4 py-2 border border-slate-200 rounded-lg"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <button 
            type="submit"
            className="md:col-span-3 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            記錄此筆收支
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">日期</th>
              <th className="px-6 py-4 font-medium">分類</th>
              <th className="px-6 py-4 font-medium">帳戶</th>
              <th className="px-6 py-4 font-medium">金額</th>
              <th className="px-6 py-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.sort((a,b) => b.date.localeCompare(a.date)).map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">{tx.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {tx.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    </span>
                    <span className="font-medium text-slate-800">{tx.categoryName}</span>
                    {tx.note && <span className="text-xs text-slate-400">({tx.note})</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {accounts.find(a => a.id === tx.accountId)?.name || '未知帳戶'}
                </td>
                <td className={`px-6 py-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {!isOffline && (
                    <button onClick={() => handleDelete(tx)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">目前尚無紀錄</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
