"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Expense } from "@/types/api";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/services/expenses";

export default function Dashboard() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // -------------------------------
  // Auth + Fetch Expenses
  // -------------------------------
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
  }, [router]);

  // -------------------------------
  // Create / Update Expense
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      expense_date: form.expense_date,
    };

    try {
      if (editingId) {
        const updated = await updateExpense(editingId, payload, token);
        setExpenses(prev =>
          prev.map(e => (e.id === editingId ? updated : e))
        );
        setEditingId(null);
      } else {
        const created = await createExpense(payload, token);
        setExpenses(prev => [created, ...prev]);
      }

      setForm({ title: "", amount: "", category: "", expense_date: "" });
    } catch {
      alert("Failed to save expense");
    }
  };

  // -------------------------------
  // Edit Expense 
  // -------------------------------
  const handleEdit = (expense: Expense) => {
    // Extract date in YYYY-MM-DD format for the date input
    // PostgreSQL returns dates as ISO strings (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
    let formattedDate = "";
    
    if (expense.expense_date) {
      const dateStr = expense.expense_date.trim();
      
      // If it's already in YYYY-MM-DD format (exactly 10 chars), use it
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        formattedDate = dateStr;
      }
      // If it includes 'T' (ISO datetime), extract date part before 'T'
      else if (dateStr.includes("T")) {
        formattedDate = dateStr.split("T")[0];
      }
      // If it includes space (PostgreSQL timestamp format), extract date part
      else if (dateStr.includes(" ")) {
        formattedDate = dateStr.split(" ")[0];
      }
      // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
      else if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } else {
          formattedDate = dateStr.slice(0, 10);
        }
      }
      // If it's in DD-MM-YYYY format, convert to YYYY-MM-DD
      else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } else {
          formattedDate = dateStr.slice(0, 10);
        }
      }
      // Fallback: extract first 10 characters (should be YYYY-MM-DD)
      else {
        formattedDate = dateStr.slice(0, 10);
      }
    }
  
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category || "",
      expense_date: formattedDate,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", amount: "", category: "", expense_date: "" });
  };

  // -------------------------------
  // Delete Expense
  // -------------------------------
  const handleDelete = async () => {
    if (!deleteId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setDeleting(true);
      await deleteExpense(deleteId, token);
      setExpenses(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
    } catch {
      alert("Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading expenses...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-semibold mb-1">My Expenses</h1>

      {editingId && (
        <p className="text-sm text-yellow-400 mb-3">
          Editing expense…
        </p>
      )}

      {/* ---------------- Form ---------------- */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border border-gray-600 bg-black p-2 w-full rounded text-white"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          className="border border-gray-600 bg-black p-2 w-full rounded text-white"
          required
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="border border-gray-600 bg-black p-2 w-full rounded text-white"
        />

        <input
          type="date"
          value={form.expense_date}
          onChange={e => setForm({ ...form, expense_date: e.target.value })}
          className="border border-gray-600 bg-black p-2 w-full rounded text-white"
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-white text-black px-4 py-2 rounded"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-500 rounded text-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------------- Expense List ---------------- */}
      {expenses.length === 0 ? (
        <p className="text-gray-400">No expenses yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map(e => (
            <li
              key={e.id}
              className="flex justify-between items-center border border-gray-700 p-3 rounded"
            >
              <div>
                <p className="font-medium text-white">{e.title}</p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">
                    ₹{e.amount}
                  </span>{" "}
                  <span className="text-gray-400">
                    · {e.category || "General"}
                  </span>{" "}
                  <span className="text-gray-500">
                    · {(() => {
                      const [year, month, day] = e.expense_date.split("-");
                      return `${day}-${month}-${year}`;
                    })()}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(e.id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------- Delete Modal ---------------- */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-black border border-gray-600 p-4 rounded w-80">
            <h3 className="font-semibold text-white">
              Delete expense?
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-3 py-1 border border-gray-500 rounded text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Logout ---------------- */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-6 text-sm text-gray-400 underline"
      >
        Logout
      </button>
    </div>
  );
}
