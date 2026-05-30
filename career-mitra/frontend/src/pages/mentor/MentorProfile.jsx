import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { mentorService, availabilityService, BACKEND_URL } from '../../services';
import { useMentorRoute } from '../../hooks/useProtectedRoute';

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
    bio: '',
    company: '',
    yearsOfExperience: 0,
    domain: '',
    sessionPrice: 0,
    skills: [],
    expertise: [],
    photoUrl: '',
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mentorId, setMentorId] = useState(null);
  const [availability, setAvailability] = useState([]);
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
        bio: data.bio || '',
        company: data.company || '',
        yearsOfExperience: data.yearsOfExperience || 0,
        domain: data.domain || '',
        sessionPrice: data.sessionPrice || 0,
        skills: skillsArray,
        expertise: expertiseArray,
        photoUrl: data.photoUrl || '',
      });
      setSelectedCategories(selectedCats);
      setSkillsInput(customSkills.join(', '));
      setExpertiseInput(expertiseArray.join(', '));
      
      // Persist mentorId for subsequent availability calls
      const id = data.id;
      if (id) {
        setMentorId(id);
        localStorage.setItem('mentorId', id);
        // Now fetch availability with the real mentorId
        try {
          const availRes = await availabilityService.getAll(id);
          setAvailability(availRes.data || []);
        } catch (err) {
          console.error('Failed to fetch availability:', err);
          setAvailability([]);
        }
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


  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!mentorId) {
      toast.error('Cannot save profile: Mentor ID not found. Please reload.');
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

      const payload = {
        ...formData,
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

    try {
      const payload = { ...newSlot, mentorId: mentorId };
      await availabilityService.create(payload);
      toast.success('Availability slot added');
      setNewSlot({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '10:00',
      });
      fetchProfile();
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await availabilityService.delete(id);
      toast.success('Availability slot removed');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to remove availability');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

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

          {/* Company and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Domain (Exam Category) and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Exam Category</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Exam Category</option>
                <option value="Placement Preparation">Placement Preparation</option>
                <option value="Aptitude">Aptitude</option>
                <option value="DSA & Coding">DSA & Coding</option>
                <option value="Technical Interviews">Technical Interviews</option>
                <option value="Mock Tests">Mock Tests</option>
                <option value="GATE">GATE</option>
                <option value="CAT">CAT</option>
                <option value="UPSC">UPSC</option>
                <option value="SSC">SSC</option>
                <option value="Banking">Banking</option>
                <option value="Railway">Railway</option>
                <option value="Other Competitive Exams">Other Competitive Exams</option>
                <option value="Other">Other</option>
              </select>
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

          {/* Photo Upload with Preview */}
          <div className="flex items-center gap-4 bg-surface-50 p-4 rounded-lg border border-surface-200">
            <img
              src={getPhotoUrl(formData.photoUrl)}
              alt="Profile Avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500 shadow-soft"
            />
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
