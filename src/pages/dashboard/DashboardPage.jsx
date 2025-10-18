import { motion } from 'framer-motion';
import { Calendar, CheckSquare, Users, Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const quickStats = [
    { label: 'משימות היום', value: '5', icon: CheckSquare, color: 'from-teal-500 to-turquoise-500' },
    { label: 'אירועים השבוע', value: '8', icon: Calendar, color: 'from-coral-500 to-orange-500' },
    { label: 'ילדים', value: '2', icon: Users, color: 'from-navy-500 to-teal-600' },
    { label: 'התראות', value: '3', icon: Bell, color: 'from-orange-500 to-coral-600' },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-turquoise-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🌟</span>
              </div>
              <h1 className="text-2xl font-bold text-navy-600">ParentFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-silver-100 rounded-full flex items-center justify-center overflow-hidden">
                {user?.photoUrl ? (
                  <img 
                    src={user.photoUrl} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">{user?.avatar || <User className="w-5 h-5 text-silver-600" />}</span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-navy-600">{user?.name}</p>
                <p className="text-xs text-silver-600">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
                title="התנתק"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-navy-600 mb-2">
            שלום, {user?.name}! 👋
          </h2>
          <p className="text-silver-600">הנה סיכום היום שלך</p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-navy-600">{stat.value}</span>
              </div>
              <p className="text-sm text-silver-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Under Construction Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-teal-500 to-turquoise-500 rounded-2xl shadow-xl p-8 text-white text-center"
        >
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold mb-2">בנייה</h3>
          <p className="text-teal-50 mb-6">
            Dashboard מלא עם משימות, אירועים, ילדים והתראות בקרוב!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">✅ אימות משתמשים</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">🔄 ממשק משתמש</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">📅 לוח שנה</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">👨‍👩‍👧‍👦 ניהול ילדים</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">🔔 התראות</span>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-right">
            <CheckSquare className="w-8 h-8 text-teal-500 mb-2" />
            <h4 className="font-semibold text-navy-600 mb-1">משימות</h4>
            <p className="text-sm text-silver-600">נהל את כל המשימות שלך</p>
          </button>
          <button className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-right">
            <Calendar className="w-8 h-8 text-coral-500 mb-2" />
            <h4 className="font-semibold text-navy-600 mb-1">לוח שנה</h4>
            <p className="text-sm text-silver-600">צפה באירועים קרובים</p>
          </button>
          <button className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-right">
            <Users className="w-8 h-8 text-orange-500 mb-2" />
            <h4 className="font-semibold text-navy-600 mb-1">ילדים</h4>
            <p className="text-sm text-silver-600">נהל פרופילי ילדים</p>
          </button>
        </div>
      </div>
    </div>
  );
}
