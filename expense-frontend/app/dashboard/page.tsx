"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Expense } from "@/types/api";
import { getExpenses, createExpense } from "@/services/expenses";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    getExpenses(token)
      .then(setExpenses)
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading expenses...</p>;

  return (
    <div>
      <h1>My Expenses</h1>

      <form
        onSubmit={async e => {
          e.preventDefault();
          const token = localStorage.getItem("token");
          if (!token) return;

          const newExpense = await createExpense(
            {
              title: form.title,
              amount: Number(form.amount),
              category: form.category,
              expense_date: form.expense_date
            },
            token
          );

          setExpenses(prev => [newExpense, ...prev]);
          setForm({ title: "", amount: "", category: "", expense_date: "" });
        }}
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="date"
          value={form.expense_date}
          onChange={e => setForm({ ...form, expense_date: e.target.value })}
        />

        <button type="submit">Add Expense</button>
      </form>

      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.title} – ₹{e.amount}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
