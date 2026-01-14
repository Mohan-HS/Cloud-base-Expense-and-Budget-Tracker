"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../src/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    apiRequest("/api/expenses", "GET", undefined, token)
      .then(setExpenses)
      .catch(() => router.push("/login"));
  }, []);

  return (
    <div>
      <h1>My Expenses</h1>
      <ul>
        {expenses.map((e: any) => (
          <li key={e.id}>
            {e.title} - ₹{e.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
