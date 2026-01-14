"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../src/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

    apiRequest("/api/expenses", "GET", undefined, token)
      .then(setExpenses)
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p>{error}</p>;
  


  return (
    <div>
      <h1>My Expenses</h1>
      <form
  onSubmit={async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const newExpense = await apiRequest(
      "/api/expenses",
      "POST",
      {
        ...form,
        amount: Number(form.amount)
      },
      token!
    );

    setExpenses(prev => [newExpense, ...prev]);
    setForm({ title: "", amount: "", category: "", expense_date: "" });
  }}
>
  <input placeholder="Title" value={form.title}
    onChange={e => setForm({ ...form, title: e.target.value })} />

  <input placeholder="Amount" type="number" value={form.amount}
    onChange={e => setForm({ ...form, amount: e.target.value })} />

  <input placeholder="Category" value={form.category}
    onChange={e => setForm({ ...form, category: e.target.value })} />

  <input type="date" value={form.expense_date}
    onChange={e => setForm({ ...form, expense_date: e.target.value })} />

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

