import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { mentorService, availabilityService, BACKEND_URL } from '../../services';
import { useMentorRoute } from '../../hooks/useProtectedRoute';
import { getInitials } from '../../utils/avatar';

const getPhotoUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http')) return url;
  return BACKEND_URL + url;
};

const EXAM_CATEGORIES = [
  'Placement Preparation',
  'Aptitude',
  'DSA & Coding',
  'Technical Interviews',
  'Mock Tests',
  'GATE',
  'CAT',
  'UPSC',
  'SSC',
  'Banking',
  'Railway',
  'Other Competitive Exams'
];

const MentorProfile = () => {
  useMentorRoute();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    company: '',
    yearsOfExperience: 0,
    domain: '',
    sessionPrice: 0,
    skills: [],
    expertise: [],
    photoUrl: '',
    linkedinUrl: '',
    supportiveDocumentUrl: '',
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mentorId, setMentorId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchAvailabilitySlots = async (id) => {
    try {
      const availRes = await availabilityService.getAll(id);
      setAvailability(availRes.data || []);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
      setAvailability([]);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // First fetch profile to get the mentor ID
      const profileRes = await mentorService.getProfile();
      const data = profileRes.data || {};
      const skillsArray = Array.isArray(data.skills) ? data.skills : [];
      const expertiseArray = Array.isArray(data.expertise) ? data.expertise : [];
      
      const selectedCats = skillsArray.filter(s => EXAM_CATEGORIES.includes(s));
      const customSkills = skillsArray.filter(s => !EXAM_CATEGORIES.includes(s));

      setFormData({
        name: data.name || '',
        bio: data.bio || '',
        company: data.company || '',
        yearsOfExperience: data.yearsOfExperience || 0,
        domain: data.domain || '',
        sessionPrice: data.sessionPrice || 0,
        skills: skillsArray,
        expertise: expertiseArray,
        photoUrl: data.photoUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        supportiveDocumentUrl: data.supportiveDocumentUrl || '',
      });
      setSelectedCategories(selectedCats);
      setSkillsInput(customSkills.join(', '));
      setExpertiseInput(expertiseArray.join(', '));
      setStatus(data.status || 'PENDING');
      
      // Persist mentorId for subsequent availability calls
      const id = data.id;
      if (id) {
        setMentorId(id);
        localStorage.setItem('mentorId', id);
        // Now fetch availability with the real mentorId
        await fetchAvailabilitySlots(id);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sessionPrice' || name === 'yearsOfExperience' ? parseInt(value) : value,
    }));
  };

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
  };

  const handleExpertiseChange = (e) => {
    setExpertiseInput(e.target.value);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await mentorService.uploadPhoto(file);
        if (response.data && response.data.photoUrl) {
          setFormData((prev) => ({ ...prev, photoUrl: response.data.photoUrl }));
        }
        toast.success('Photo uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload photo');
      }
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await mentorService.uploadDocument(file);
        if (response.data && response.data.supportiveDocumentUrl) {
          setFormData((prev) => ({ ...prev, supportiveDocumentUrl: response.data.supportiveDocumentUrl }));
        }
        toast.success('Supportive document uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload supportive document');
      }
    }
  };


  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!mentorId) {
      toast.error('Cannot save profile: Mentor ID not found. Please reload.');
      return;
    }

    if (!formData.supportiveDocumentUrl) {
      toast.error('Supportive document is mandatory for verification.');
      return;
    }

    setSaving(true);

    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const expertiseArray = expertiseInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const finalSkills = [...skillsArray, ...selectedCategories];
      const primaryDomain = selectedCategories[0] || 'Other';

      const payload = {
        ...formData,
        domain: primaryDomain,
        skills: finalSkills,
        expertise: expertiseArray,
      };

      await mentorService.update(mentorId, payload);
      setFormData(payload);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    if (!mentorId) {
      toast.error('Cannot add availability: Mentor ID not found.');
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('Start time must be before end time.');
      return;
    }

    try {
      const payload = { ...newSlot, mentorId: mentorId };
      await availabilityService.create(payload);
      toast.success('Availability slot added');
      setNewSlot({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '10:00',
      });
      fetchAvailabilitySlots(mentorId);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add availability';
      toast.error(errorMessage);
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await availabilityService.delete(id);
      toast.success('Availability slot removed');
      fetchAvailabilitySlots(mentorId);
    } catch (error) {
      toast.error('Failed to remove availability');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 page-enter">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

      {/* Verification Status Alert Banner */}
      {status === 'PENDING' && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4 animate-fade-in">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <FiClock size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-900">Verification Status: Pending</span>
              <span className="badge badge-warning text-[10px] py-0.5 px-2 font-bold uppercase tracking-wider">Under Review</span>
            </div>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Your profile is pending administrator approval. In the meantime, you can continue to complete your bio, 
              skills, and availability slots below. Your profile will become discoverable to students once approved.
            </p>
          </div>
        </div>
      )}

      {status === 'REJECTED' && (
        <div className="mb-8 bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4 animate-fade-in">
          <div className="w-9 h-9 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <FiXCircle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-rose-900">Verification Status: Rejected</span>
              <span className="badge badge-danger text-[10px] py-0.5 px-2 font-bold uppercase tracking-wider">Declined</span>
            </div>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              Your verification has been declined by the administrator. Please update your profile details and ensure that you 
              upload a clear, valid supportive document (ID badge, credentials, or certifications) in the section below.
            </p>
          </div>
        </div>
      )}

      {status === 'APPROVED' && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4 animate-fade-in">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <FiCheckCircle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-900">Verification Status: Approved</span>
              <span className="badge badge-success text-[10px] py-0.5 px-2 font-bold uppercase tracking-wider">Verified</span>
            </div>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              Your profile is fully verified and active. Students can now explore your profile, book mentoring sessions, and view your availability.
            </p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell students about yourself..."
              rows="4"
              className="input-field"
              required
            />
          </div>

          {/* Company, Experience and Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Your company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Session Price (₹/hour)
              </label>
              <input
                type="number"
                name="sessionPrice"
                value={formData.sessionPrice}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              LinkedIn Profile Link (Optional)
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl || ''}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
              className="input-field"
            />
          </div>

          {/* Exam Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Exam Categories (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-surface-50 p-4 rounded-xl border border-surface-200">
              {EXAM_CATEGORIES.map((category) => (
                <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500/20 focus:ring-2 cursor-pointer transition-all"
                  />
                  <span className="text-xs text-ink-700 group-hover:text-ink-950 font-medium transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
              Skills (comma separated)
            </label>
            <textarea
              name="skills"
              value={skillsInput}
              onChange={handleSkillsChange}
              placeholder="e.g., JavaScript, React, Node.js"
              rows="2"
              className="input-field"
            />
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Areas of Expertise (comma separated)
            </label>
            <textarea
              name="expertise"
              value={expertiseInput}
              onChange={handleExpertiseChange}
              placeholder="e.g., Full Stack Development, Startup Mentoring"
              rows="2"
              className="input-field"
            />
          </div>

          {/* Supportive Document Upload */}
          <div className={`p-4 rounded-lg border ${
            status === 'REJECTED' 
              ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-200' 
              : 'bg-surface-50 border-surface-200'
          }`}>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Supportive Document (ID Badge, Resume, etc.) <span className="text-red-500 font-bold">*</span>
              {status === 'REJECTED' && (
                <span className="text-rose-600 font-bold text-[10px] ml-2 uppercase tracking-wide inline-flex items-center gap-0.5 mt-0.5">
                  <FiAlertTriangle size={11} /> Please re-upload a valid verification document
                </span>
              )}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleDocumentUpload}
                className={`input-field text-xs cursor-pointer ${
                  status === 'REJECTED' ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : ''
                }`}
                required={!formData.supportiveDocumentUrl}
              />
              {formData.supportiveDocumentUrl && (
                <span className={`text-xs font-semibold flex items-center gap-1 shrink-0 ${
                  status === 'REJECTED' ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {status === 'REJECTED' ? '⚠ Update Document' : '✓ Document Uploaded'}
                </span>
              )}
            </div>
          </div>

          {/* Photo Upload with Preview */}
          <div className="flex items-center gap-4 bg-surface-50 p-4 rounded-lg border border-surface-200">
            {formData.photoUrl ? (
              <img
                src={getPhotoUrl(formData.photoUrl)}
                alt="Profile Avatar"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500 shadow-soft shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                {getInitials(formData.name || 'Mentor')}
              </div>
            )}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="input-field text-xs cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Availability Management */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Availability</h2>

        {/* Add New Slot */}
        <form onSubmit={handleAddAvailability} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Day</label>
              <select
                value={newSlot.dayOfWeek}
                onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                className="input-field"
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Start Time</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">End Time</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary h-fit">
              Add Slot
            </button>
          </div>
        </form>

        {/* Availability List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-4">Your Availability</h3>
          {availability.length === 0 ? (
            <p className="text-gray-600">No availability slots added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availability.map((slot) => (
                <div key={slot.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{slot.dayOfWeek}</p>
                    <p className="text-gray-600 text-sm">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAvailability(slot.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
