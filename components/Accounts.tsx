
import React, { useState, useEffect } from 'react';
import { db, auth, isOffline, collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from '../firebase';
import { BankAccount } from '../types';
import { Plus, Trash2, Edit2, Wallet } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../constants';

const Accounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOffline) {
      setAccounts(DEMO_ACCOUNTS);
      return;
    }
    if (!db || !auth?.currentUser) return;
    const q = query(collection(db, 'accounts'), where('userId', '==', auth.currentUser.uid));
    return onSnapshot(q, (snapshot: any) => {
      setAccounts(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as BankAccount)));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) return;
    if (!db || !auth?.currentUser) return;

    const accountData = {
      name,
      balance: Number(balance),
      type: '儲蓄',
      userId: auth.currentUser.uid
    };

    if (editingId) {
      await updateDoc(doc(db, 'accounts', editingId), accountData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'accounts'), accountData);
    }
    setName('');
    setBalance(0);
  };

  const handleDelete = async (id: string) => {
    if (isOffline) return;
    if (!db) return;
    if (window.confirm('確定要刪除此帳戶嗎？所有相關紀錄將保留但帳戶將消失。')) {
      await deleteDoc(doc(db, 'accounts', id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">帳戶管理</h2>
        <p className="text-slate-500">管理您的銀行帳戶與錢包</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">{editingId ? '編輯帳戶' : '新增帳戶'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="帳戶名稱 (如: 薪轉帳戶)" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2 border border-slate-200 rounded-lg"
          />
          <input 
            type="number" 
            placeholder="初始餘額" 
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            required
            className="px-4 py-2 border border-slate-200 rounded-lg"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
            {editingId ? '更新' : '新增'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Wallet size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{acc.name}</h4>
                <p className="text-xs text-slate-400">{acc.type}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">${acc.balance.toLocaleString()}</p>
            
            {!isOffline && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setName(acc.name); setBalance(acc.balance); setEditingId(acc.id); }} className="p-2 text-slate-400 hover:text-indigo-600">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(acc.id)} className="p-2 text-slate-400 hover:text-rose-600">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
