import { motion } from 'framer-motion';
import { MapPin, Clock, Trash2, Edit, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export default function EventCard({ event, onEdit, onDelete, showChild = true }) {
  const { t } = useTranslation();
  const startTime = new Date(event.startTime);
  const endTime = event.endTime ? new Date(event.endTime) : null;

  const formatTime = (date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg shadow-sm border-2 border-orange-200 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Child Header (when showing all children) */}
      {showChild && event.child && (
        <div className="bg-coral-500 text-white px-4 py-2 flex items-center gap-2 text-sm font-medium">
          {event.child.photoUrl ? (
            <img 
              src={event.child.photoUrl} 
              alt={event.child.name}
              className="w-6 h-6 rounded-full object-cover border border-white/20"
            />
          ) : (
            <span className="text-lg">{event.child.avatar || '👤'}</span>
          )}
          <span>{event.child.name}</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-medium text-navy-700 mb-1">{event.title}</h4>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-silver-600 mb-2">{event.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-silver-600">
            {/* Time */}
            {event.allDay ? (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>כל היום</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {formatTime(startTime)}
                  {endTime && ` - ${formatTime(endTime)}`}
                </span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.location}</span>
              </div>
            )}

            {/* Child name */}
            {showChild && event.child && (
              <span className="flex items-center gap-1 px-2 py-1 bg-coral-100 text-coral-700 rounded-full font-medium">
                {event.child.photoUrl ? (
                  <img 
                    src={event.child.photoUrl} 
                    alt={event.child.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <span>{event.child.avatar || '👤'}</span>
                )}
                {event.child.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
            title={t('actions.edit')}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
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
