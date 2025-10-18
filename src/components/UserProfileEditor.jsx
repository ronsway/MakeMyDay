import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Camera, Edit, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';

const UserProfileEditor = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    location: '',
    birthDate: '',
    timezone: 'Asia/Jerusalem',
    photoUrl: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '👤',
        bio: user.bio || '',
        location: user.location || '',
        birthDate: user.birthDate || '',
        timezone: user.timezone || 'Asia/Jerusalem',
        photoUrl: user.photoUrl || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.invalidFile', 'סוג קובץ לא תקין. אנא בחר תמונה'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.fileTooLarge', 'הקובץ גדול מדי. גודל מקסימלי 5MB'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImageUrl(event.target.result);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditExistingPhoto = () => {
    if (profileData.photoUrl) {
      setTempImageUrl(profileData.photoUrl);
      setShowImageCropper(true);
    }
  };

  const handleCroppedImage = (croppedImageUrl) => {
    setProfileData(prev => ({
      ...prev,
      photoUrl: croppedImageUrl,
      avatar: '' // Clear emoji when using photo
    }));
    setShowImageCropper(false);
    setTempImageUrl(null);
  };

  const handleAvatarSelect = (emoji) => {
    setProfileData(prev => ({
      ...prev,
      avatar: emoji,
      photoUrl: '' // Clear photo when selecting emoji
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Basic validation
      if (!profileData.name.trim()) {
        toast.error(t('profile.nameRequired', 'שם הוא שדה חובה'));
        return;
      }

      if (!profileData.email.trim()) {
        toast.error(t('profile.emailRequired', 'אימייל הוא שדה חובה'));
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        toast.error(t('profile.invalidEmail', 'כתובת אימייל לא תקינה'));
        return;
      }

      // Update user profile
      if (updateProfile) {
        await updateProfile(profileData);
      }
      
      // Save to localStorage as backup
      localStorage.setItem('user_profile', JSON.stringify(profileData));
      
      toast.success(t('profile.updateSuccess', 'פרופיל עודכן בהצלחה'));
      setIsEditing(false);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('profile.updateError', 'שגיאה בעדכון הפרופיל'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '👤',
        bio: user.bio || '',
        location: user.location || '',
        birthDate: user.birthDate || '',
        timezone: user.timezone || 'Asia/Jerusalem',
        photoUrl: user.photoUrl || ''
      });
    }
    setIsEditing(false);
  };

  const avatarOptions = [
    '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫',
    '👨‍⚕️', '👩‍⚕️', '👨‍💻', '👩‍💻', '🧑‍🍳', '👨‍🎨', '👩‍🎨', '🤱'
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {/* Profile Picture - Clickable when editing */}
            <div 
              className={`w-20 h-20 bg-silver-100 rounded-full flex items-center justify-center overflow-hidden ${
                isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              }`}
              onClick={isEditing ? () => setShowPhotoOptions(true) : undefined}
            >
              {profileData.photoUrl ? (
                <img 
                  src={profileData.photoUrl} 
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">{profileData.avatar || '👤'}</span>
              )}
              
              {/* Hover overlay when editing */}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            {/* Small edit indicator when editing */}
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center">
                <Edit className="w-3 h-3" />
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-navy-700">{profileData.name || t('profile.unnamed', 'ללא שם')}</h2>
            <p className="text-silver-600">{profileData.email}</p>
            {profileData.location && (
              <p className="text-sm text-silver-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profileData.location}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              {t('actions.cancel', 'ביטול')}
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              {t('actions.edit', 'עריכה')}
            </>
          )}
        </button>
      </div>

      {/* Photo Options Modal */}
      {showPhotoOptions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
                  {t('profile.changePhoto', 'שנה תמונת פרופיל')}
                </h3>
                <button
                  onClick={() => setShowPhotoOptions(false)}
                  className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Upload New Photo */}
                <label 
                  className="flex items-center gap-3 p-3 bg-teal-50 hover:bg-teal-100 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-navy-700">{t('profile.uploadNew', 'העלה תמונה חדשה')}</h4>
                    <p className="text-sm text-silver-600">{t('profile.uploadNewDesc', 'בחר תמונה מהמכשיר שלך')}</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handlePhotoUpload(e);
                      setShowPhotoOptions(false);
                    }}
                    className="hidden"
                  />
                </label>

                {/* Edit Existing Photo */}
                {profileData.photoUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditExistingPhoto();
                      setShowPhotoOptions(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Edit className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-medium text-navy-700">{t('profile.editCurrent', 'ערוך תמונה נוכחית')}</h4>
                      <p className="text-sm text-silver-600">{t('profile.editCurrentDesc', 'חתוך או סובב את התמונה הקיימת')}</p>
                    </div>
                  </button>
                )}

                {/* Choose Avatar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAvatarPicker(true);
                    setShowPhotoOptions(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-navy-700">{t('profile.chooseAvatar', 'בחר אייקון')}</h4>
                    <p className="text-sm text-silver-600">{t('profile.chooseAvatarDesc', 'השתמש באייקון במקום תמונה')}</p>
                  </div>
                </button>

                {/* Remove Photo */}
                {profileData.photoUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileData(prev => ({ ...prev, photoUrl: '', avatar: '👤' }));
                      setShowPhotoOptions(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-medium text-navy-700">{t('profile.removePhoto', 'הסר תמונה')}</h4>
                      <p className="text-sm text-silver-600">{t('profile.removePhotoDesc', 'חזור לאייקון ברירת מחדל')}</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAvatarPicker(false)}
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
                  {t('profile.selectAvatar', 'בחר אייקון')}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAvatarPicker(false);
                  }}
                  className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAvatarSelect(emoji);
                      setShowAvatarPicker(false);
                      setShowPhotoOptions(false);
                    }}
                    className={`w-12 h-12 text-2xl rounded-lg hover:bg-silver-100 transition-colors flex items-center justify-center ${
                      profileData.avatar === emoji && !profileData.photoUrl 
                        ? 'bg-teal-100 ring-2 ring-teal-300' 
                        : 'bg-white'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Profile Form */}
      <div className="grid gap-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              {t('profile.name', 'שם מלא')} *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            ) : (
              <p className="px-3 py-2 text-navy-700">{profileData.name || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              {t('profile.email', 'אימייל')} *
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            ) : (
              <p className="px-3 py-2 text-navy-700">{profileData.email || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              {t('profile.phone', 'טלפון')}
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="050-1234567"
              />
            ) : (
              <p className="px-3 py-2 text-navy-700">{profileData.phone || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {t('profile.birthDate', 'תאריך לידה')}
            </label>
            {isEditing ? (
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ) : (
              <p className="px-3 py-2 text-navy-700">{profileData.birthDate || '-'}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            {t('profile.location', 'מיקום')}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder={t('profile.locationPlaceholder', 'עיר, מדינה')}
            />
          ) : (
            <p className="px-3 py-2 text-navy-700">{profileData.location || '-'}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {t('profile.bio', 'אודות')}
          </label>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
              placeholder={t('profile.bioPlaceholder', 'ספר על עצמך...')}
            />
          ) : (
            <p className="px-3 py-2 text-navy-700 whitespace-pre-wrap">{profileData.bio || '-'}</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex items-center gap-3 pt-4 border-t border-silver-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('actions.saving', 'שומר...')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('actions.save', 'שמור שינויים')}
              </>
            )}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors disabled:opacity-50"
          >
            {t('actions.cancel', 'ביטול')}
          </button>
        </div>
      )}

      {/* Image Cropper Modal */}
      <ImageCropper
        isOpen={showImageCropper}
        onClose={() => {
          setShowImageCropper(false);
          setTempImageUrl(null);
        }}
        onCrop={handleCroppedImage}
        imageUrl={tempImageUrl}
        aspectRatio={1} // Square aspect ratio for profile pictures
      />
    </div>
  );
};

export default UserProfileEditor;