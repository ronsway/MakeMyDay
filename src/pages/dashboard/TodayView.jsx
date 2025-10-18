import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  Users,
  Bell,
  Plus,
  LogOut,
  Menu,
  X,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useSettings } from '../../hooks/useSettings';
import { cn } from '../../lib/utils';
import TaskCard from '../../components/TaskCard';
import EventCard from '../../components/EventCard';
import ChildSelector from '../../components/ChildSelector';
import AddItemModal from '../../components/AddItemModal';
import EditItemModal from '../../components/EditItemModal';
import ConfirmModal from '../../components/ConfirmModal';

export default function TodayView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { formatDate, formatTime } = useSettings();
  const {
    todaysTasks,
    todaysEvents,
    pastEvents,
    pastTasks,
    children,
    stats,
    selectedChildId,
    setSelectedChildId,
    toggleTask,
    deleteTask,
    deleteEvent,
    createTask,
    createEvent,
    updateTask,
    updateEvent,
    loading,
  } = useData();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showPastTasks, setShowPastTasks] = useState(false);
  
  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Handlers for adding new items
  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleAddEvent = () => {
    setShowEventModal(true);
  };

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
  };

  const handleCreateEvent = async (eventData) => {
    await createEvent(eventData);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleUpdateTask = async (taskId, updates) => {
    await updateTask(taskId, updates);
    setEditingTask(null);
  };

  const handleUpdateEvent = async (eventId, updates) => {
    await updateEvent(eventId, updates);
    setEditingEvent(null);
  };

  const handleDeleteTask = (taskId) => {
    setDeleteConfirm({
      type: 'task',
      id: taskId,
      title: t('confirmation.deleteTask'),
      message: t('confirmation.deleteTaskMsg')
    });
  };

  const handleDeleteEvent = (eventId) => {
    setDeleteConfirm({
      type: 'event',
      id: eventId,
      title: t('confirmation.deleteEvent'),
      message: t('confirmation.deleteEventMsg')
    });
  };
  
  const confirmDelete = () => {
    if (deleteConfirm?.type === 'task') {
      deleteTask(deleteConfirm.id);
    } else if (deleteConfirm?.type === 'event') {
      deleteEvent(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  // Get current date info
  const today = new Date();
  const locale = t('locale') === 'he' ? 'he-IL' : 'en-US';
  const dateString = formatDate(today, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeString = formatTime(today);

  // Quick stats for cards
  const quickStats = [
    {
      label: t('dashboard.todaysTasks'),
      value: todaysTasks.length,
      completed: todaysTasks.filter((t) => t.status === 'done').length,
      icon: CheckSquare,
      color: 'bg-teal-500',
    },
    {
      label: t('dashboard.todaysEvents'),
      value: todaysEvents.length,
      icon: Calendar,
      color: 'bg-coral-500',
    },
    {
      label: t('dashboard.activeTasks'),
      value: stats.activeTasks,
      icon: CheckSquare,
      color: 'bg-navy-500',
    },
    {
      label: t('dashboard.urgentTasks'),
      value: stats.urgentTasks,
      icon: Bell,
      color: 'bg-coral-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-silver-600">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40" dir="ltr">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🌟</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-600">{t('app.title')}</h1>
                <p className="text-xs text-silver-600 hidden sm:block">
                  {timeString}
                </p>
              </div>
            </div>

            {/* Desktop: Child Selector & User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <ChildSelector
                children={children}
                selectedId={selectedChildId}
                onChange={setSelectedChildId}
              />

              <div className="flex items-center gap-3">
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
                  onClick={() => navigate('/settings')}
                  className="p-2 text-navy-500 hover:bg-navy-50 rounded-lg transition-colors"
                  title={t('dashboard.settings')}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
                  title={t('dashboard.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-navy-600"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-silver-200 py-4 space-y-4"
              >
                <ChildSelector
                  children={children}
                  selectedId={selectedChildId}
                  onChange={setSelectedChildId}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="text-sm font-medium text-navy-600">{user?.name}</p>
                      <p className="text-xs text-silver-600">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/settings')}
                      className="px-4 py-2 text-navy-500 hover:bg-navy-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>{t('dashboard.settings')}</span>
                    </button>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-coral-500 hover:bg-coral-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('dashboard.logout')}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-600 mb-2">
            {t('dashboard.today')} - {dateString} 👋
          </h2>
          <p className="text-silver-600">{t('dashboard.todaySummary')}</p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold text-navy-600">
                    {stat.value}
                  </span>
                  {stat.completed !== undefined && (
                    <span className="text-xs sm:text-sm text-silver-600">
                      /{stat.completed}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-silver-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Tasks Column */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-navy-600 flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-teal-500" />
                  {t('dashboard.todaysTasks')}
                </h3>
                <button 
                  onClick={handleAddTask}
                  className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  title={t('tasks.placeholder', 'הוסף משימה חדשה...')}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {todaysTasks.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                    <div className="text-6xl mb-3">🎉</div>
                    <p className="text-silver-600">{t('dashboard.noTasks')}</p>
                    <p className="text-sm text-silver-500 mt-1">{t('dashboard.enjoyDay')}</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {todaysTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        showChild={selectedChildId === 'all'}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            {/* Past Tasks Section */}
            {pastTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
              <button
                onClick={() => setShowPastTasks(!showPastTasks)}
                className="w-full flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="text-silver-500">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-silver-700">
                    {t('dashboard.pastTasks', 'Past Tasks')} ({pastTasks.length})
                  </h3>
                </div>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-silver-500 transition-transform',
                    showPastTasks && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {showPastTasks && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {pastTasks.map((task) => (
                      <div key={task.id} className="opacity-60 hover:opacity-100 transition-opacity">
                        <TaskCard
                          task={task}
                          onToggle={toggleTask}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          showChild={selectedChildId === 'all'}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          </div>

          {/* Events Column */}
          <div className="space-y-6">
            {/* Today's Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy-600 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-coral-500" />
                {t('dashboard.todaysEvents')}
              </h3>
              <button 
                onClick={handleAddEvent}
                className="p-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                title={t('events.placeholder', 'הוסף אירוע חדש...')}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {todaysEvents.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="text-6xl mb-3">📅</div>
                  <p className="text-silver-600">{t('dashboard.noEvents')}</p>
                  <p className="text-sm text-silver-500 mt-1">{t('dashboard.calmDay')}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {todaysEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                      showChild={selectedChildId === 'all'}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <button
                onClick={() => setShowPastEvents(!showPastEvents)}
                className="w-full flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="text-silver-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-silver-700">
                    {t('dashboard.pastEvents', 'Past Events')} ({pastEvents.length})
                  </h3>
                </div>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-silver-500 transition-transform',
                    showPastEvents && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {showPastEvents && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {pastEvents.map((event) => (
                      <div key={event.id} className="opacity-60 hover:opacity-100 transition-opacity">
                        <EventCard
                          event={event}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                          showChild={selectedChildId === 'all'}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddItemModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
        type="task"
        children={children}
      />

      {/* Add Event Modal */}
      <AddItemModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={handleCreateEvent}
        type="event"
        children={children}
      />

      {/* Edit Task Modal */}
      <EditItemModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        item={editingTask}
        type="task"
        children={children}
      />

      {/* Edit Event Modal */}
      <EditItemModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleUpdateEvent}
        item={editingEvent}
        type="event"
        children={children}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title={deleteConfirm?.title}
        message={deleteConfirm?.message}
        confirmText={t('confirmation.delete')}
        cancelText={t('confirmation.cancel')}
        type="danger"
      />
    </div>
  );
}
