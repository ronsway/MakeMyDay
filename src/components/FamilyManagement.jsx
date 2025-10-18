import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Users, Camera, Home } from 'lucide-react';
import FamilyMemberModal from '../components/FamilyMemberModal';
import FamilyProfileModal from '../components/FamilyProfileModal';
import ConfirmModal from '../components/ConfirmModal';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

const FamilyManagement = () => {
  const { t } = useTranslation();
  const { children, loadAllData } = useData();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showFamilyProfileModal, setShowFamilyProfileModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [familyProfile, setFamilyProfile] = useState(null);

  // Load family profile on component mount
  useEffect(() => {
    const loadFamilyProfile = () => {
      const savedProfile = localStorage.getItem('family_profile');
      if (savedProfile) {
        try {
          setFamilyProfile(JSON.parse(savedProfile));
        } catch (error) {
          console.error('Failed to load family profile:', error);
        }
      }
    };
    loadFamilyProfile();
  }, []);

  // Mock family member operations (will be replaced with actual API calls)
  const handleAddMember = async (memberData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get existing members from localStorage
      const existingMembers = JSON.parse(localStorage.getItem('parentflow_children') || '[]');
      
      // Prepare new member
      const newMember = {
        id: Date.now().toString(),
        name: memberData.name,
        age: memberData.age ? parseInt(memberData.age) : null,
        grade: memberData.grade,
        school: memberData.school,
        className: memberData.className,
        birthDate: memberData.birthDate,
        avatar: memberData.avatar,
        role: memberData.role,
        photoUrl: memberData.photoUrl,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const updatedMembers = [...existingMembers, newMember];
      localStorage.setItem('parentflow_children', JSON.stringify(updatedMembers));
      
      // Reload data
      await loadAllData();
      
      setShowMemberModal(false);
      setEditingMember(null);
      toast.success(t('family.addSuccess'));
      
    } catch (error) {
      console.error('Failed to add family member:', error);
      toast.error('שגיאה בהוספת בן משפחה');
    }
  };

  const handleUpdateMember = async (memberData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get existing members from localStorage
      const existingMembers = JSON.parse(localStorage.getItem('parentflow_children') || '[]');
      
      // Update member
      const updatedMembers = existingMembers.map(member => 
        member.id === memberData.id 
          ? {
              ...member,
              name: memberData.name,
              age: memberData.age ? parseInt(memberData.age) : null,
              grade: memberData.grade,
              school: memberData.school,
              className: memberData.className,
              birthDate: memberData.birthDate,
              avatar: memberData.avatar,
              role: memberData.role,
              photoUrl: memberData.photoUrl,
              updatedAt: new Date().toISOString()
            }
          : member
      );
      
      // Save to localStorage
      localStorage.setItem('parentflow_children', JSON.stringify(updatedMembers));
      
      // Reload data
      await loadAllData();
      
      setShowMemberModal(false);
      setEditingMember(null);
      toast.success(t('family.updateSuccess'));
      
    } catch (error) {
      console.error('Failed to update family member:', error);
      toast.error('שגיאה בעדכון בן משפחה');
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get existing members from localStorage
      const existingMembers = JSON.parse(localStorage.getItem('parentflow_children') || '[]');
      
      // Remove member
      const updatedMembers = existingMembers.filter(member => member.id !== memberId);
      
      // Save to localStorage
      localStorage.setItem('parentflow_children', JSON.stringify(updatedMembers));
      
      // Also remove from tasks and events
      const existingTasks = JSON.parse(localStorage.getItem('parentflow_tasks') || '[]');
      const updatedTasks = existingTasks.filter(task => task.childId !== memberId);
      localStorage.setItem('parentflow_tasks', JSON.stringify(updatedTasks));
      
      const existingEvents = JSON.parse(localStorage.getItem('parentflow_events') || '[]');
      const updatedEvents = existingEvents.filter(event => event.childId !== memberId);
      localStorage.setItem('parentflow_events', JSON.stringify(updatedEvents));
      
      // Reload data
      await loadAllData();
      
      setDeleteConfirm(null);
      toast.success(t('family.deleteSuccess'));
      
    } catch (error) {
      console.error('Failed to delete family member:', error);
      toast.error('שגיאה במחיקת בן משפחה');
    }
  };

  const handleMemberSubmit = (memberData) => {
    if (editingMember) {
      handleUpdateMember(memberData);
    } else {
      handleAddMember(memberData);
    }
  };

  const startEdit = (member) => {
    setEditingMember(member);
    setShowMemberModal(true);
  };

  const startDelete = (member) => {
    setDeleteConfirm({
      id: member.id,
      name: member.name,
      title: t('family.deleteMember'),
      message: t('family.deleteConfirm')
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm?.id) {
      handleDeleteMember(deleteConfirm.id);
    }
  };

  const handleFamilyProfileSubmit = (profileData) => {
    // Update state with new profile data
    setFamilyProfile(profileData);
    // Close the modal
    setShowFamilyProfileModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Family Profile Card */}
      <div className="bg-gradient-to-r from-teal-50 to-turquoise-50 border-2 border-teal-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Family Photo */}
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md">
              {familyProfile?.photoUrl ? (
                <img 
                  src={familyProfile.photoUrl} 
                  alt="Family"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Home className="w-10 h-10 text-teal-500" />
              )}
            </div>
            
            {/* Family Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-navy-700 mb-1">
                {familyProfile?.familyName || t('family.familyProfile', 'פרופיל משפחתי')}
              </h3>
              <p className="text-sm text-silver-600 mb-3">
                {t('family.familyProfileDesc', 'פרטים משותפים לכל המשפחה')}
              </p>
              {familyProfile && (
                <div className="grid grid-cols-2 gap-2 text-sm text-navy-600">
                  {familyProfile.address && (
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{familyProfile.address}{familyProfile.city ? `, ${familyProfile.city}` : ''}</span>
                    </div>
                  )}
                  {familyProfile.phone && (
                    <div className="flex items-center gap-1">
                      <span>📞</span>
                      <span>{familyProfile.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowFamilyProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-teal-600 border-2 border-teal-500 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            {t('actions.edit', 'עריכה')}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-navy-700 mb-1">
            <Users className="w-5 h-5 inline mr-2" />
            {t('family.members')}
          </h3>
          <p className="text-sm text-silver-600">
            {t('familyDesc')}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setShowMemberModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#10b981' }}
        >
          <Plus className="w-4 h-4" />
          {t('family.addMember')}
        </button>
      </div>

      {/* Family Members List */}
      <div className="space-y-4">
        {children && children.length > 0 ? (
          children.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-white border border-silver-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-silver-100 rounded-full flex items-center justify-center flex-shrink-0">
                {member.photoUrl ? (
                  <img 
                    src={member.photoUrl} 
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl">{member.avatar || '👧'}</span>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-navy-700 truncate">
                    {member.name}
                  </h4>
                  {member.age && (
                    <span className="text-sm text-silver-500">
                      ({member.age} {t('family.age')})
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-silver-600 space-y-1">
                  {member.role && (
                    <div>{t(`family.roles.${member.role}`)}</div>
                  )}
                  {member.school && (
                    <div>
                      {member.school}
                      {member.grade && ` - ${t('family.grade')} ${member.grade}`}
                      {member.className && ` (${member.className})`}
                    </div>
                  )}
                  {member.birthDate && (
                    <div>{t('family.birthDate')}: {member.birthDate}</div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(member)}
                  className="p-2 text-silver-500 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors"
                  title={t('family.editMember')}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startDelete(member)}
                  className="p-2 text-silver-500 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition-colors"
                  title={t('family.deleteMember')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-silver-50 rounded-lg">
            <Users className="w-12 h-12 text-silver-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-silver-600 mb-2">
              {t('family.noMembers')}
            </h4>
            <p className="text-silver-500 mb-6">
              {t('family.addFirst')}
            </p>
            <button
              onClick={() => {
                setEditingMember(null);
                setShowMemberModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors mx-auto"
              style={{ backgroundColor: '#10b981' }}
            >
              <Plus className="w-4 h-4" />
              {t('family.addMember')}
            </button>
          </div>
        )}
      </div>

      {/* Family Member Modal */}
      <FamilyMemberModal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setEditingMember(null);
        }}
        onSubmit={handleMemberSubmit}
        member={editingMember}
        type={editingMember ? 'edit' : 'add'}
      />

      {/* Family Profile Modal */}
      <FamilyProfileModal
        isOpen={showFamilyProfileModal}
        onClose={() => setShowFamilyProfileModal(false)}
        onSubmit={handleFamilyProfileSubmit}
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
};

export default FamilyManagement;