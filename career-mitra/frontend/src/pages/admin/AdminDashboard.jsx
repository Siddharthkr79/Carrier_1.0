import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { mockAdminStats, mockUsers } from '../../data/mockData';
import { adminService } from '../../services';
import UserProfileModal from '../../components/UserProfileModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockAdminStats);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.allSettled([
          adminService.getDashboard(),
          adminService.getUsers(),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      } catch (err) {
        console.error('Failed to fetch admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatAmount = (val) => {
    return `₹${((val || 0) / (val > 100000 ? 100000 : 1)).toFixed(val > 100000 ? 1 : 0)}${val > 100000 ? 'L' : ''}`;
  };

  const platformEarn = stats.platformEarnings !== undefined ? stats.platformEarnings : (stats.totalRevenue || 0) * 0.15;

  const statItems = [
    { label: 'Total users', value: stats.totalUsers || 0, icon: FiUsers, color: 'text-brand-600 bg-brand-50' },
    { label: 'Total mentors', value: stats.totalMentors || 0, icon: FiUsers, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Active bookings', value: stats.totalSessions || stats.activeBookings || 0, icon: FiCalendar, color: 'text-violet-600 bg-violet-50' },
    {
      label: 'Total Transactions',
      value: formatAmount(stats.totalRevenue),
      icon: FiDollarSign,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Platform Earnings (15%)',
      value: formatAmount(platformEarn),
      icon: FiDollarSign,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-ink-600">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-surface-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink-600 font-medium">{stat.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="text-xl font-bold text-ink-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-900">Recent users</h2>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              >
                View all <FiArrowRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-100">
                    <th className="px-5 py-2.5 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-2.5 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-2.5 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Role</th>
                    <th className="px-5 py-2.5 text-left text-2xs font-semibold text-ink-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const role = (user.role || 'student').toLowerCase();
                    const isActive = user.isActive !== undefined ? user.isActive : (user.status === 'active');
                    return (
                      <tr key={user.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-ink-900">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="hover:text-brand-600 font-semibold text-left transition-colors"
                          >
                            {user.name}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-sm text-ink-600">{user.email}</td>
                        <td className="px-5 py-3">
                          <span className={`badge ${
                            role === 'mentor' ? 'badge-primary' : role === 'admin' ? 'badge-neutral' : 'badge-success'
                          }`}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`badge ${isActive ? 'badge-success' : 'badge-neutral'}`}>
                            {isActive ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-surface-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">Platform stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg border border-surface-100">
                <span className="text-xs text-ink-600">Total Transactions</span>
                <span className="text-sm font-semibold text-ink-900">₹{(stats.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg border border-surface-100">
                <span className="text-xs text-ink-600">Platform Earnings (15%)</span>
                <span className="text-sm font-semibold text-ink-900">₹{(platformEarn).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg border border-surface-100">
                <span className="text-xs text-ink-600">Total sessions</span>
                <span className="text-sm font-semibold text-ink-900">{stats.totalSessions || stats.activeBookings || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg border border-surface-100">
                <span className="text-xs text-ink-600">Total mentors</span>
                <span className="text-sm font-semibold text-ink-900">{stats.totalMentors || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserProfileModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminDashboard;
