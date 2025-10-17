import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EditItemModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  item, // task or event object to edit
  type, // 'task' or 'event'
  children 
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);

  // Initialize form when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setSelectedChild(item.childId || '');
      setPriority(item.priority || 'normal');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !item) return;

    setLoading(true);
    try {
      const updates = {
        title: title.trim(),
        description: description.trim(),
        childId: selectedChild,
      };

      if (type === 'task') {
        updates.priority = priority;
      }

      await onSubmit(item.id, updates);
      onClose();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-silver-200">
            <h3 className="text-lg font-semibold text-navy-700">
              {type === 'task' ? t('tasks.editTask') : t('events.editEvent')}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                {type === 'task' ? t('tasks.taskTitle') : t('events.eventTitle')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={type === 'task' ? t('tasks.taskTitlePlaceholder') : t('events.eventTitlePlaceholder')}
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                {t('tasks.description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={type === 'task' ? t('tasks.descriptionPlaceholder') : t('events.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            {/* Child Selection */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                {t('tasks.assignedTo')}
              </label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.avatar} {child.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority (only for tasks) */}
            {type === 'task' && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {t('tasks.priority')}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="low">{t('tasks.low')}</option>
                  <option value="normal">{t('tasks.normal')}</option>
                  <option value="urgent">{t('tasks.urgent')}</option>
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors"
              >
                {t('tasks.cancel')}
              </button>
              <button
                type="submit"
                disabled={!title.trim() || loading}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  !title.trim() || loading
                    ? 'bg-silver-300 text-silver-500 cursor-not-allowed'
                    : type === 'task'
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-coral-500 text-white hover:bg-coral-600'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('actions.saving', 'שומר...')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {type === 'task' ? t('tasks.update') : t('events.update')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditItemModal;