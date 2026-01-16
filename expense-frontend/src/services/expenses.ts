import type { Expense } from "@/types/api";

const API = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all expenses for logged-in user
 */
export async function getExpenses(token: string): Promise<Expense[]> {
  const res = await fetch(`${API}/api/expenses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return res.json();
}

/**
 * Create a new expense
 */
export async function createExpense(
  data: {
    title: string;
    amount: number;
    category?: string;
    expense_date: string;
  },
  token: string
): Promise<Expense> {
  const res = await fetch(`${API}/api/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create expense");
  }

  return res.json();
}

/**
 * Update an expense
 */
export async function updateExpense(
  id: number,
  data: Partial<Omit<Expense, "id" | "user_id" | "created_at">>,
  token: string
): Promise<Expense> {
  const res = await fetch(`${API}/api/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update expense");
  }

  return res.json();
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: number, token: string): Promise<void> {
  const res = await fetch(`${API}/api/expenses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete expense");
  }
}
