import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-navy-500 to-coral-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-turquoise-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌟</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-navy-600 mb-2">ParentFlow</h1>
          <p className="text-silver-600">התחבר לחשבון שלך</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal-600 mb-2">
              אימייל
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-silver-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="email@example.com"
                required
                dir="ltr"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal-600 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-silver-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••"
                required
                dir="ltr"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-400 hover:text-charcoal-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-teal-500 rounded" />
              <span className="text-sm text-charcoal-600">זכור אותי</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-teal-500 hover:text-teal-600 transition-colors">
              שכחת סיסמה?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-teal-500 to-turquoise-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>התחבר</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-charcoal-600">
            עדיין אין לך חשבון?{' '}
            <Link to="/register" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors">
              הירשם עכשיו
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-cream-200 rounded-lg">
          <p className="text-xs text-charcoal-500 text-center">
            <strong>Demo:</strong> test@example.com / password123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
