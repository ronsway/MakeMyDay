import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('auth.validation.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.validation.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.validation.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.validation.passwordTooShort');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.validation.passwordsNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
    });
    setLoading(false);
  }

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { text: '', color: '', width: '0%' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { text: t('auth.passwordStrength.weak'), color: 'bg-coral-500', width: '33%' };
    if (strength <= 3) return { text: t('auth.passwordStrength.medium'), color: 'bg-orange-500', width: '66%' };
    return { text: t('auth.passwordStrength.strong'), color: 'bg-turquoise-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-coral-500 flex items-center justify-center p-4">
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
            <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-navy-600 mb-2">{t('auth.joinUs')}</h1>
          <p className="text-silver-600">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal-600 mb-2">
              {t('auth.fullName')}
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.name ? 'border-coral-500' : 'border-silver-300 focus:border-teal-500'
                }`}
                placeholder={t('auth.fullNamePlaceholder')}
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
            </div>
            {errors.name && <p className="mt-1 text-xs text-coral-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal-600 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.email ? 'border-coral-500' : 'border-silver-300 focus:border-teal-500'
                }`}
                placeholder={t('auth.emailPlaceholder')}
                required
                dir="ltr"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
            </div>
            {errors.email && <p className="mt-1 text-xs text-coral-500">{errors.email}</p>}
          </div>

          {/* Phone (Optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-charcoal-600 mb-2">
              {t('auth.phone')} <span className="text-silver-400">({t('auth.optional')})</span>
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-silver-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                placeholder={t('auth.phonePlaceholder')}
                dir="ltr"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.password ? 'border-coral-500' : 'border-silver-300 focus:border-teal-500'
                }`}
                placeholder={t('auth.passwordRegisterPlaceholder')}
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
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-silver-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <span className="text-xs text-charcoal-600">{passwordStrength.text}</span>
                </div>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-coral-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-600 mb-2">
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.confirmPassword ? 'border-coral-500' : 'border-silver-300 focus:border-teal-500'
                }`}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                required
                dir="ltr"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-400 hover:text-charcoal-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-coral-500">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-coral-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-coral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>{t('auth.registerButton')}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-charcoal-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors">
              {t('auth.loginButton')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
