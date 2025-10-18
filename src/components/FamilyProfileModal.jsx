import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Home, MapPin, Phone, Calendar, Camera, Edit, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';

const FamilyProfileModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    familyName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    memberCount: '',
    establishedDate: '',
    photoUrl: '',
    notes: ''
  });

  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Load existing family profile
  useEffect(() => {
    if (isOpen) {
      const savedProfile = localStorage.getItem('family_profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setFormData(profile);
        } catch (error) {
          console.error('Failed to load family profile:', error);
        }
      }
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('family.invalidFile', 'סוג קובץ לא תקין'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('family.fileTooLarge', 'הקובץ גדול מדי'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImageUrl(event.target.result);
        setShowImageCropper(true);
        setShowPhotoOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditExistingPhoto = () => {
    if (formData.photoUrl) {
      setTempImageUrl(formData.photoUrl);
      setShowImageCropper(true);
      setShowPhotoOptions(false);
    }
  };

  const handleCroppedImage = (croppedImageUrl) => {
    setFormData(prev => ({
      ...prev,
      photoUrl: croppedImageUrl
    }));
    setShowImageCropper(false);
    setTempImageUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.familyName.trim()) {
      toast.error(t('family.familyNameRequired', 'שם המשפחה הוא שדה חובה'));
      return;
    }

    // Save to localStorage
    localStorage.setItem('family_profile', JSON.stringify(formData));
    
    onSubmit(formData);
    toast.success(t('family.profileSaved', 'פרופיל המשפחה נשמר בהצלחה'));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Image Cropper Modal */}
      {showImageCropper && (
        <ImageCropper
          isOpen={showImageCropper}
          imageUrl={tempImageUrl}
          onCrop={handleCroppedImage}
          onClose={() => {
            setShowImageCropper(false);
            setTempImageUrl(null);
          }}
          aspectRatio={1}
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-silver-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700">
                {t('family.familyProfile', 'פרופיל משפחתי')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Family Photo Section */}
            <div className="text-center">
              <label className="block text-sm font-medium text-navy-700 mb-3">
                {t('family.familyPhoto', 'תמונת משפחה')}
              </label>
              <div className="relative w-32 h-32 mx-auto mb-3">
                <div 
                  className="w-32 h-32 bg-silver-100 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                  onClick={() => setShowPhotoOptions(true)}
                >
                  {formData.photoUrl ? (
                    <img 
                      src={formData.photoUrl} 
                      alt="Family"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-silver-400" />
                  )}
                </div>
                
                {/* Edit overlay */}
                <button
                  type="button"
                  onClick={() => setShowPhotoOptions(true)}
                  className="absolute inset-0 w-32 h-32 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Photo Options Modal */}
              {showPhotoOptions && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  onClick={() => setShowPhotoOptions(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-navy-700">
                          {t('family.photoOptions', 'אפשרויות תמונה')}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowPhotoOptions(false)}
                          className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Upload New Photo */}
                        <label className="flex items-center gap-3 p-3 bg-teal-50 hover:bg-teal-100 rounded-lg cursor-pointer transition-colors">
                          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="font-medium text-navy-700">{t('family.uploadPhoto', 'העלה תמונה')}</h4>
                            <p className="text-sm text-silver-600">{t('family.selectFromDevice', 'בחר תמונה מהמכשיר')}</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Edit Existing Photo */}
                        {formData.photoUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditExistingPhoto();
                            }}
                            className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                          >
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                              <Edit className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-medium text-navy-700">{t('family.editPhoto', 'ערוך תמונה')}</h4>
                              <p className="text-sm text-silver-600">{t('family.cropPhoto', 'חתוך את התמונה הקיימת')}</p>
                            </div>
                          </button>
                        )}

                        {/* Remove Photo */}
                        {formData.photoUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, photoUrl: '' }));
                              setShowPhotoOptions(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                              <X className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-medium text-navy-700">{t('family.removePhoto', 'הסר תמונה')}</h4>
                              <p className="text-sm text-silver-600">{t('family.removePhotoDesc', 'חזור לאייקון ברירת מחדל')}</p>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Family Name */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                <Home className="w-4 h-4 inline mr-2" />
                {t('family.familyName', 'שם המשפחה')} *
              </label>
              <input
                type="text"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={t('family.familyNamePlaceholder', 'לדוגמה: משפחת כהן')}
                required
              />
            </div>

            {/* Address Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t('family.address', 'כתובת')}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder={t('family.addressPlaceholder', 'רחוב ומספר בית')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {t('family.city', 'עיר')}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder={t('family.cityPlaceholder', 'תל אביב')}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {t('family.phone', 'טלפון')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {t('family.email', 'אימייל משפחתי')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="family@example.com"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  {t('family.memberCount', 'מספר בני משפחה')}
                </label>
                <input
                  type="number"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {t('family.establishedDate', 'תאריך הקמת משפחה')}
                </label>
                <input
                  type="date"
                  name="establishedDate"
                  value={formData.establishedDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                {t('family.country', 'מדינה')}
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={t('family.countryPlaceholder', 'ישראל')}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                {t('family.notes', 'הערות')}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={t('family.notesPlaceholder', 'מידע נוסף על המשפחה...')}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-silver-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors"
              >
                {t('actions.cancel', 'ביטול')}
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#10b981' }}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {t('actions.save', 'שמור')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default FamilyProfileModal;
