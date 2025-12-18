
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "AI 建議目前不可用（未設定 API Key）。請在 GitHub Secrets 中配置 API_KEY 以啟用此功能。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-pro-preview';

    // 彙整簡單的財務數據摘要
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const recentTxStr = transactions.slice(0, 10).map(t => 
      `${t.date}: ${t.type === 'income' ? '+' : '-'}${t.amount} (${t.categoryName} - ${t.note})`
    ).join('\n');

    const prompt = `
      身為一位專業的財務顧問，請根據以下財務狀況提供具體建議：
      
      帳戶總餘額：${totalBalance} 元
      近期交易紀錄：
      ${recentTxStr}
      
      請以繁體中文回覆，包含：
      1. 支出結構分析
      2. 儲蓄與理財建議
      3. 一個具體的行動目標
      回覆應簡潔、友善且富有洞察力。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "無法生成建議。";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "在生成 AI 建議時發生錯誤。";
  }
};
