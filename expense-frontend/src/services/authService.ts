const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Signup failed');
  }

  return res.json();
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }

  return res.json();
};
