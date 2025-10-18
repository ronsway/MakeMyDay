import { motion } from 'framer-motion';
import { MapPin, Clock, Trash2, Edit, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useSettings } from '../hooks/useSettings';

export default function EventCard({ event, onEdit, onDelete, showChild = true }) {
  const { t } = useTranslation();
  const { formatDate, formatTime } = useSettings();
  const startTime = new Date(event.startTime);
  const endTime = event.endTime ? new Date(event.endTime) : null;

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
          <div className="flex flex-wrap items-center gap-3 text-sm text-silver-700">
            {/* Date and Time combined for better visibility */}
            <div className="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="font-medium">{formatDate(startTime, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Time */}
            {event.allDay ? (
              <div className="flex items-center gap-1 bg-coral-50 px-2 py-1 rounded">
                <Clock className="w-4 h-4 text-coral-600" />
                <span className="font-medium">{t('events.allDay', 'כל היום')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-coral-50 px-2 py-1 rounded">
                <Clock className="w-4 h-4 text-coral-600" />
                <span className="font-medium">
                  {formatTime(startTime)}
                  {endTime && ` - ${formatTime(endTime)}`}
                </span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{event.location}</span>
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
