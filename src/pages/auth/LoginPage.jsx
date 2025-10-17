import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function LoginPage() {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-teal-500 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>
      
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
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌟</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-navy-600 mb-2">{t('app.title')}</h1>
          <p className="text-silver-600">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal-600 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-silver-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                placeholder={t('auth.emailPlaceholder')}
                required
                dir="ltr"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal-600 mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-silver-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                placeholder={t('auth.passwordPlaceholder')}
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
              <span className="text-sm text-charcoal-600">{t('auth.rememberMe')}</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-teal-500 hover:text-teal-600 transition-colors">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{t('auth.loginButton')}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-charcoal-600">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors">
              {t('auth.signUpNow')}
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-cream-200 rounded-lg">
          <p className="text-xs text-charcoal-500 text-center">
            <strong>{t('auth.demo')}:</strong> test@example.com / password123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
