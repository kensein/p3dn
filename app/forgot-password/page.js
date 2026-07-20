'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengirim tautan reset');
      }

      setSuccess(data.message);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl mx-auto mb-4 flex items-center justify-center">
            <KeyRound className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lupa Password</h1>
          <p className="text-blue-100">
            Masukkan email akun Anda. Kami akan mengirim tautan reset password.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="nama@bmkg.go.id"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Kirim Tautan Reset</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
