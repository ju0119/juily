
import { Category, BankAccount, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '薪資', type: 'income', icon: '💰' },
  { id: '2', name: '獎金', type: 'income', icon: '🎁' },
  { id: '3', name: '投資回報', type: 'income', icon: '📈' },
  { id: '4', name: '飲食', type: 'expense', icon: '🍔' },
  { id: '5', name: '交通', type: 'expense', icon: '🚌' },
  { id: '6', name: '購物', type: 'expense', icon: '🛍️' },
  { id: '7', name: '娛樂', type: 'expense', icon: '🎮' },
  { id: '8', name: '居住', type: 'expense', icon: '🏠' },
  { id: '9', name: '醫療', type: 'expense', icon: '🏥' },
  { id: '10', name: '教育', type: 'expense', icon: '📚' },
];

export const DEMO_ACCOUNTS: BankAccount[] = [
  { id: 'demo1', name: '現金', balance: 5000, type: '現金', userId: 'demo' },
  { id: 'demo2', name: '中信銀行', balance: 120000, type: '儲蓄', userId: 'demo' },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'demo1', userId: 'demo', amount: 100, type: 'expense', categoryId: '4', categoryName: '飲食', date: new Date().toISOString().split('T')[0], note: '午餐' },
  { id: 't2', accountId: 'demo2', userId: 'demo', amount: 50000, type: 'income', categoryId: '1', categoryName: '薪資', date: new Date().toISOString().split('T')[0], note: '本月薪資' },
];
