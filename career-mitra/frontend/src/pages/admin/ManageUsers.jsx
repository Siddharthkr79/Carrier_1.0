import React, { useState, useEffect } from 'react';
import { FiSlash, FiCheck } from 'react-icons/fi';
import { toast } from '../../utils/toast';
import { adminService } from '../../services';
import { useAdminRoute } from '../../hooks/useProtectedRoute';

const ManageUsers = () => {
  useAdminRoute();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminService.blockUser(userId);
      toast.success('User blocked');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminService.unblockUser(userId);
      toast.success('User unblocked');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Manage Users</h1>
        <p className="text-sm text-ink-600">Configure access levels and status of student and mentor accounts</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-xl p-12 text-center">
          <p className="text-sm text-ink-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const role = (user.role || 'STUDENT').toLowerCase();
                  return (
                    <tr key={user.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-ink-900">{user.name}</td>
                      <td className="px-5 py-3 text-sm text-ink-600">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${
                          role === 'mentor' ? 'badge-primary' : role === 'admin' ? 'badge-neutral' : 'badge-success'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`badge ${
                            user.isActive ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {user.isActive ? (
                          <button
                            onClick={() => handleBlockUser(user.id)}
                            className="flex items-center gap-1 text-xs font-medium text-warm-red hover:opacity-80 transition-opacity"
                          >
                            <FiSlash size={14} />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(user.id)}
                            className="flex items-center gap-1 text-xs font-medium text-warm-green hover:opacity-80 transition-opacity"
                          >
                            <FiCheck size={14} />
                            Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
