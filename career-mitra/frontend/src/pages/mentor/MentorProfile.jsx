import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import { mentorService, availabilityService, BACKEND_URL } from '../../services';
import { useMentorRoute } from '../../hooks/useProtectedRoute';

const getPhotoUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http')) return url;
  return BACKEND_URL + url;
};

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
  const [mentorId, setMentorId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      setFormData({
        bio: data.bio || '',
        company: data.company || '',
        yearsOfExperience: data.yearsOfExperience || 0,
        domain: data.domain || '',
        sessionPrice: data.sessionPrice || 0,
        skills: Array.isArray(data.skills) ? data.skills : [],
        expertise: Array.isArray(data.expertise) ? data.expertise : [],
        photoUrl: data.photoUrl || '',
      });
      
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

  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(',').map((item) => item.trim()),
    }));
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
      await mentorService.update(mentorId, formData);
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

          {/* Domain and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Domain</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Product Management">Product Management</option>
                <option value="Data Science">Data Science</option>
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
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

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills (comma separated)
            </label>
            <textarea
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleArrayInput}
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
              value={formData.expertise.join(', ')}
              onChange={handleArrayInput}
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
