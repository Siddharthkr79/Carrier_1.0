import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { adminService, BACKEND_URL } from '../../services';
import { useAdminRoute } from '../../hooks/useProtectedRoute';
import UserProfileModal from '../../components/UserProfileModal';

const ManageMentors = () => {
  useAdminRoute();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMentors();
      setMentors(response.data);
    } catch (error) {
      toast.error('Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMentor = async (mentorId) => {
    try {
      await adminService.approveMentor(mentorId);
      toast.success('Mentor approved');
      fetchMentors();
    } catch (error) {
      toast.error('Failed to approve mentor');
    }
  };

  const handleRejectMentor = async (mentorId) => {
    try {
      await adminService.rejectMentor(mentorId);
      toast.success('Mentor rejected');
      fetchMentors();
    } catch (error) {
      toast.error('Failed to reject mentor');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  const pendingMentors = mentors.filter((m) => m.status === 'PENDING');
  const approvedMentors = mentors.filter((m) => m.status === 'APPROVED');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Manage Mentors</h1>
        <p className="text-sm text-ink-600">Review onboarding requests and manage existing mentors</p>
      </div>

      {/* Pending Approvals */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-ink-900 mb-4">Pending Approvals ({pendingMentors.length})</h2>

        {pendingMentors.length === 0 ? (
          <div className="bg-white border border-surface-200 rounded-xl p-8 text-center">
            <p className="text-sm text-ink-500">No pending mentor requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pendingMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white border border-surface-200 rounded-xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-2xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Name</p>
                    <button
                      onClick={() => setSelectedMentor({ ...mentor, role: 'MENTOR', mentor: mentor })}
                      className="text-sm font-semibold text-ink-900 hover:text-brand-600 transition-colors text-left"
                    >
                      {mentor.name}
                    </button>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Domain</p>
                    <p className="text-sm font-semibold text-ink-900">{mentor.domain}</p>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="text-sm font-semibold text-ink-900">{mentor.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold text-ink-500 uppercase tracking-wider mb-0.5">Session fee</p>
                    <p className="text-sm font-semibold text-ink-900">₹{mentor.sessionPrice}</p>
                  </div>
                </div>

                <p className="text-xs text-ink-600 mb-4 bg-surface-50 rounded-lg p-2.5 border border-surface-100">{mentor.bio}</p>

                {/* Verification Info */}
                <div className="flex flex-wrap gap-4 mb-4 text-xs font-semibold">
                  {mentor.linkedinUrl && (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:shadow-2xs transition-all"
                    >
                      🔗 LinkedIn Profile
                    </a>
                  )}
                  {mentor.supportiveDocumentUrl ? (
                    <a
                      href={mentor.supportiveDocumentUrl.startsWith('http') ? mentor.supportiveDocumentUrl : (BACKEND_URL + mentor.supportiveDocumentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:shadow-2xs transition-all"
                    >
                      📄 Verification Document
                    </a>
                  ) : (
                    <span className="text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1 flex items-center gap-1">
                      ⚠️ No Document Uploaded
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveMentor(mentor.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-warm-green rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FiCheckCircle size={13} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectMentor(mentor.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-700 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <FiXCircle size={13} />
                    Decline
                  </button>
                  <button
                    onClick={() => setSelectedMentor({ ...mentor, role: 'MENTOR', mentor: mentor })}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors ml-auto"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Mentors */}
      <div>
        <h2 className="text-sm font-semibold text-ink-900 mb-4">Approved Mentors ({approvedMentors.length})</h2>

        {approvedMentors.length === 0 ? (
          <div className="bg-white border border-surface-200 rounded-xl p-8 text-center">
            <p className="text-sm text-ink-500">No approved mentors found</p>
          </div>
        ) : (
          <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-100">
                    <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Domain</th>
                    <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Experience</th>
                    <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Rating</th>
                    <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Price/hr</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedMentors.map((mentor) => (
                    <tr key={mentor.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-ink-900">
                        <button
                          onClick={() => setSelectedMentor({ ...mentor, role: 'MENTOR', mentor: mentor })}
                          className="hover:text-brand-600 font-semibold text-left transition-colors"
                        >
                          {mentor.name}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-sm text-ink-700">{mentor.domain}</td>
                      <td className="px-5 py-3 text-sm text-ink-600">{mentor.yearsOfExperience} years</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold text-amber-500">
                          ★ {mentor.rating ? mentor.rating.toFixed(1) : '0.0'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-ink-900">₹{mentor.sessionPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <UserProfileModal
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
        user={selectedMentor}
      />
    </div>
  );
};

export default ManageMentors;
