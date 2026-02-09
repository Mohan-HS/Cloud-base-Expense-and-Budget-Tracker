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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
            <p className="text-gray-600 text-sm mt-1">Track and manage your spending</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? "Edit Expense" : "Add Expense"}
              </h2>

              {editingId && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  Editing expense…
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., Lunch"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    placeholder="e.g., Food, Transport"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={form.expense_date}
                    onChange={e => setForm({ ...form, expense_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {editingId ? "Update" : "Add"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Expense List Section */}
          <div className="lg:col-span-2">
            {expenses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No expenses yet</h3>
                <p className="text-gray-600">Start by adding your first expense using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map(e => (
                  <div
                    key={e.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{e.title}</h3>
                          {e.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {e.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {(() => {
                            const [year, month, day] = e.expense_date.split("-");
                            return `${day}-${month}-${year}`;
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{e.amount}</p>
                        <div className="flex gap-2 mt-2 justify-end">
                          <button
                            onClick={() => handleEdit(e)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(e.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Expense?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. The expense will be permanently deleted.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
