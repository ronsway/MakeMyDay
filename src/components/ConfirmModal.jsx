import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'אישור',
  cancelText = 'ביטול',
  type = 'danger' // 'danger' or 'warning'
}) => {
  if (!isOpen) return null;

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
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-coral-100' : 'bg-orange-100'}`}>
                <AlertTriangle className={`w-5 h-5 ${type === 'danger' ? 'text-coral-600' : 'text-orange-600'}`} />
              </div>
              <h3 className="text-lg font-semibold text-navy-700">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-silver-700 mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white ${
                  type === 'danger' 
                    ? 'bg-coral-500 hover:bg-coral-600' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;