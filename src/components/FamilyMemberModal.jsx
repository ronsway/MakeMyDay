import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Calendar, GraduationCap, School, Camera, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageCropper from './ImageCropper';

const AVATAR_OPTIONS = [
  '👶', '🧒', '👦', '👧', '🧑', '👨', '👩',
  '👴', '👵', '🤱', '👨‍👩‍👧', '👨‍👩‍👦', '🎓', '📚'
];

const FamilyMemberModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  member = null, // null for add, object for edit
  type = 'add' // 'add' or 'edit'
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    school: '',
    className: '',
    birthDate: '',
    avatar: '👧',
    role: 'child',
    photoUrl: ''
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);

  // Initialize form data when member changes
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        age: member.age || '',
        grade: member.grade || '',
        school: member.school || '',
        className: member.className || '',
        birthDate: member.birthDate || '',
        avatar: member.avatar || '👧',
        role: member.role || 'child',
        photoUrl: member.photoUrl || ''
      });
    } else {
      // Reset form for new member
      setFormData({
        name: '',
        age: '',
        grade: '',
        school: '',
        className: '',
        birthDate: '',
        avatar: '👧',
        role: 'child',
        photoUrl: ''
      });
    }
    setPhotoFile(null);
  }, [member]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      avatar: emoji,
      photoUrl: '' // Clear photo when selecting emoji
    }));
    setPhotoFile(null);
    setShowAvatarPicker(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('family.invalidFile'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('family.fileTooLarge'));
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview URL for cropper
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImageUrl(event.target.result);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedImageUrl) => {
    setFormData(prev => ({
      ...prev,
      photoUrl: croppedImageUrl,
      avatar: '' // Clear emoji when uploading photo
    }));
    setShowImageCropper(false);
    setTempImageUrl(null);
  };

  const handleEditExistingPhoto = () => {
    if (formData.photoUrl) {
      setTempImageUrl(formData.photoUrl);
      setShowImageCropper(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submit triggered', formData);
    
    // Validation
    if (!formData.name.trim()) {
      alert(t('family.nameRequired'));
      return;
    }
    
    // Prepare final data
    const finalData = {
      ...formData,
      id: member?.id || Date.now().toString(),
      photoFile: photoFile
    };
    
    console.log('Calling onSubmit with:', finalData);
    onSubmit(finalData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-silver-200">
            <h3 className="text-lg font-semibold text-navy-700">
              {type === 'edit' ? t('family.editMember') : t('family.addMember')}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Avatar Section */}
            <div className="mb-6 text-center">
              <div className="mb-4">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div 
                    className="w-20 h-20 bg-silver-100 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowPhotoOptions(true)}
                  >
                    {formData.photoUrl ? (
                      <img 
                        src={formData.photoUrl} 
                        alt={formData.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{formData.avatar}</span>
                    )}
                  </div>
                  
                  {/* Edit overlay */}
                  <button
                    type="button"
                    onClick={() => setShowPhotoOptions(true)}
                    className="absolute inset-0 w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
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
                            onChange={(e) => {
                              handlePhotoUpload(e);
                              setShowPhotoOptions(false);
                            }}
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
                              setShowPhotoOptions(false);
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

                        {/* Choose Avatar */}
                        <button
                          type="button"
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
                            <h4 className="font-medium text-navy-700">{t('family.selectAvatar', 'בחר אווטאר')}</h4>
                            <p className="text-sm text-silver-600">{t('family.chooseEmoji', 'בחר אימוג\'י לייצג')}</p>
                          </div>
                        </button>

                        {/* Remove Photo */}
                        {formData.photoUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, photoUrl: '', avatar: '👧' }));
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
                          {t('family.selectAvatar', 'בחר אווטאר')}
                        </h3>
                        <button
                          type="button"
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
                        {AVATAR_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAvatarSelect(emoji);
                              setShowAvatarPicker(false);
                            }}
                            className={`w-12 h-12 text-2xl rounded-lg hover:bg-silver-100 transition-colors flex items-center justify-center ${
                              formData.avatar === emoji && !formData.photoUrl 
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
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  {t('family.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {t('family.age')}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="0"
                    max="120"
                    className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {t('family.role')}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="child">{t('family.roles.child')}</option>
                    <option value="parent">{t('family.roles.parent')}</option>
                    <option value="guardian">{t('family.roles.guardian')}</option>
                    <option value="other">{t('family.roles.other')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('family.birthDate')}
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>

              {/* School Info (show for children) */}
              {formData.role === 'child' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">
                      <School className="w-4 h-4 inline mr-1" />
                      {t('family.school')}
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        {t('family.grade')}
                      </label>
                      <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        {t('family.className')}
                      </label>
                      <input
                        type="text"
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-silver-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors"
              >
                {t('confirmation.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#10b981',
                  cursor: 'pointer'
                }}
              >
                {type === 'edit' ? t('actions.save') : t('family.addMember')}
              </button>
            </div>
          </form>
        </motion.div>

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
    </AnimatePresence>
  );
};

export default FamilyMemberModal;