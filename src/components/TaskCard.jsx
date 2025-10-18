import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2, Edit, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useSettings } from '../hooks/useSettings';

export default function TaskCard({ task, onToggle, onEdit, onDelete, showChild = true }) {
  const { t } = useTranslation();
  const { formatDate, formatTime } = useSettings();
  const priorityColors = {
    normal: 'text-silver-600',
    high: 'text-orange-500',
    urgent: 'text-coral-500',
  };

  const priorityBg = {
    normal: 'bg-silver-100',
    high: 'bg-orange-100',
    urgent: 'bg-coral-100',
  };

  const isCompleted = task.status === 'done';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'bg-white rounded-lg shadow-sm border-2 hover:shadow-md transition-all overflow-hidden',
        isCompleted ? 'border-turquoise-200 bg-turquoise-50/50' : 'border-silver-200',
        isOverdue && 'border-coral-300 bg-coral-50/30'
      )}
    >
      {/* Child Header (when showing all children) */}
      {showChild && task.child && (
        <div className="bg-teal-500 text-white px-4 py-2 flex items-center gap-2 text-sm font-medium">
          {task.child.photoUrl ? (
            <img 
              src={task.child.photoUrl} 
              alt={task.child.name}
              className="w-6 h-6 rounded-full object-cover border border-white/20"
            />
          ) : (
            <span className="text-lg">{task.child.avatar || '👤'}</span>
          )}
          <span>{task.child.name}</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-turquoise-500" />
          ) : (
            <Circle className="w-6 h-6 text-silver-400 hover:text-teal-500" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4
            className={cn(
              'font-medium text-navy-700 mb-1',
              isCompleted && 'line-through text-silver-500'
            )}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-silver-600 mb-2">{task.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Due date */}
            {task.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isOverdue ? 'text-coral-600' : 'text-silver-600'
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {formatDate(task.dueDate, { day: 'numeric', month: 'short' })}
                  {task.dueTime && ` ${formatTime(task.dueDate + 'T' + task.dueTime)}`}
                </span>
              </div>
            )}

            {/* Priority */}
            {task.priority !== 'normal' && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  priorityBg[task.priority],
                  priorityColors[task.priority]
                )}
              >
                {task.priority === 'urgent' ? `🔥 ${t('tasks.urgent')}` : `⚠️ ${t('tasks.high')}`}
              </span>
            )}

            {/* Category */}
            {task.category && (
              <span className="px-2 py-0.5 bg-cream-200 text-charcoal-600 rounded-full">
                {task.category}
              </span>
            )}

            {/* Child name */}
            {showChild && task.child && (
              <span className="flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                <span>{task.child.avatar || '👤'}</span>
                {task.child.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
            title={t('actions.edit')}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
            title={t('actions.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
