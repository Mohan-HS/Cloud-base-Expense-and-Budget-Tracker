'use client';

import { useState } from 'react';
import { signup } from '../services/authService';
import { isEmailValid, isPasswordValid } from '../utils/validators';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid(email)) {
      return setError('Invalid email');
    }
    if (!isPasswordValid(password)) {
      return setError('Password must be at least 6 characters');
    }

    try {
      await signup({ name, email, password });
      alert('Signup successful. Please login.');
    } catch {
      setError('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Signup</button>
    </form>
  );
}
