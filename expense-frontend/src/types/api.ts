export interface Expense {
    id: number;
    user_id: number;
    title: string;
    amount: number;
    category: string | null;
    expense_date: string;
    created_at: string;
  }
  