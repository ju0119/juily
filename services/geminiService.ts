
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[]
): Promise<string> => {
  try {
    /**
     * Always use a new instance to ensure it uses the latest API key injected by the environment.
     * Use gemini-3-pro-preview for complex reasoning tasks.
     */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const recentTxStr = transactions
      .slice(0, 20)
      .map(t => `${t.date} | ${t.type === 'income' ? '收入' : '支出'} | ${t.amount}元 | 分類: ${t.categoryName} | 備註: ${t.note}`)
      .join('\n');

    const prompt = `
      身為專業的個人理財 AI 顧問，請根據以下財務資料提供深度分析：
      
      【當前財務狀態】
      - 總資產：${totalBalance} TWD
      - 帳戶數量：${accounts.length}
      
      【最近 20 筆交易明細】
      ${recentTxStr}
      
      請以繁體中文提供：
      1. **消費趨勢洞察**：分析哪些分類佔比過高。
      2. **財務風險評估**：當前餘額是否足以支撐短期生活或應對緊急狀況？
      3. **具體行動方案**：給出 3 個明確的理財建議（如減少某類支出、增加儲蓄目標等）。
      
      請保持回覆語氣專業且精簡。
    `;

    // 呼叫 generateContent 並帶入模型與內容
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // 使用 .text 屬性獲取結果
    return response.text || "AI 暫時無法分析，請稍後再試。";
  } catch (error) {
    console.error("Gemini AI 分析失敗:", error);
    return "分析過程中發生錯誤，請檢查系統設定。";
  }
};
