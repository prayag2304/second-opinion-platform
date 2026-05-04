import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatusBadge from '../../components/Common/StatusBadge';
import Pagination from '../../components/Common/Pagination';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import SearchFilter from '../../components/Common/SearchFilter';
import Modal from '../../components/Common/Modal';
import FormField from '../../components/Common/FormField';
import Button from '../../components/Common/Button';
import apiClient from '../../services/apiClient';
import { USER_ROLES, USER_STATUS } from '../../config/constants';
import { UserIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  });
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    user: null,
    action: null
  });
  const [userModal, setUserModal] = useState({
    show: false,
    user: null,
    isEdit: false
  });
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    specialty: '',
    phoneNumber: ''
  });

  // Role-based status options
  const getStatusOptionsForRole = (role) => {
    const statusOptions = {
      [USER_ROLES.ADMIN]: [
        { value: USER_STATUS.ACTIVE, label: 'Active' },
        { value: USER_STATUS.SUSPENDED, label: 'Suspended' }
      ],
      [USER_ROLES.PATIENT]: [
        { value: USER_STATUS.ACTIVE, label: 'Active' },
        { value: USER_STATUS.SUSPENDED, label: 'Suspended' }
      ],
      [USER_ROLES.DOCTOR]: [
        { value: USER_STATUS.PENDING, label: 'Pending' },
        { value: USER_STATUS.APPROVED, label: 'Approved' },
        { value: USER_STATUS.REJECTED, label: 'Rejected' },
        { value: USER_STATUS.SUSPENDED, label: 'Suspended' },
        { value: USER_STATUS.ACTIVE, label: 'Active' }
      ]
    };

    return statusOptions[role] || [];
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/admin/users', {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          ...filters
        }
      });

      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      }));
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (user, newStatus) => {
    const userId = user.id;
    if (actionLoading[userId]) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      await apiClient.put(`/api/admin/users/${userId}/status`, { status: newStatus });
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      
      const action = newStatus === USER_STATUS.SUSPENDED ? 'suspended' :
                    newStatus === USER_STATUS.ACTIVE ? 'activated' :
                    newStatus === USER_STATUS.APPROVED ? 'approved' : 'rejected';
      toast.success(`User ${action} successfully`);
    } catch (error) {
      toast.error(`Failed to update user status`);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
      setConfirmDialog({ show: false, user: null, action: null });
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => {
      const updatedFilters = { ...prev, ...newFilters };
      // Reset status when role changes
      if (Object.prototype.hasOwnProperty.call(newFilters, 'role')) {
        updatedFilters.status = '';
      }
      return updatedFilters;
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleUserFormChange = (field, value) => {
    setUserForm(prev => {
      const updated = { ...prev, [field]: value };
      // Reset status when role changes
      if (field === 'role') {
        updated.status = '';
      }
      return updated;
    });
  };

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.role || !userForm.status) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (userModal.isEdit) {
        await apiClient.put(`/api/admin/users/${userModal.user.id}`, userForm);
        toast.success('User updated successfully');
      } else {
        await apiClient.post('/api/admin/users', userForm);
        toast.success('User created successfully');
      }
      
      setUserModal({ show: false, user: null, isEdit: false });
      setUserForm({ name: '', email: '', role: '', status: '', specialty: '', phoneNumber: '' });
      fetchUsers();
    } catch (error) {
      toast.error(userModal.isEdit ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const openUserModal = (user = null) => {
    if (user) {
      setUserForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || '',
        specialty: user.specialty || '',
        phoneNumber: user.phoneNumber || ''
      });
      setUserModal({ show: true, user, isEdit: true });
    } else {
      setUserForm({ name: '', email: '', role: '', status: '', specialty: '', phoneNumber: '' });
      setUserModal({ show: true, user: null, isEdit: false });
    }
  };

  const filterOptions = [
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: USER_ROLES.ADMIN, label: 'Admin' },
        { value: USER_ROLES.PATIENT, label: 'Patient' },
        { value: USER_ROLES.DOCTOR, label: 'Doctor' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        ...getStatusOptionsForRole(filters.role)
      ],
      disabled: !filters.role
    }
  ];

  const isInitialLoading = loading && users.length === 0;

  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserIcon className="w-8 h-8 mr-3 text-primary-600" />
            User Management
          </h1>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => openUserModal()}
          >
            Add User
          </Button>
        </div>

        <SearchFilter
          searchPlaceholder="Search users by name or email..."
          onSearch={handleSearch}
          filters={filterOptions}
          onFilterChange={handleFilterChange}
        />

        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">No users match your current filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.specialty && (
                              <div className="text-xs text-gray-400">{user.specialty}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === USER_ROLES.ADMIN ? 'bg-red-100 text-red-800' :
                          user.role === USER_ROLES.DOCTOR ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? 
                          new Date(user.lastLogin).toLocaleDateString() : 
                          'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openUserModal(user)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          
                          {user.role !== USER_ROLES.ADMIN && (
                            <>
                              {user.status === USER_STATUS.ACTIVE ? (
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => setConfirmDialog({
                                    show: true,
                                    user,
                                    action: USER_STATUS.SUSPENDED
                                  })}
                                  loading={actionLoading[user.id]}
                                >
                                  Suspend
                                </Button>
                              ) : user.status === USER_STATUS.SUSPENDED ? (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => setConfirmDialog({
                                    show: true,
                                    user,
                                    action: USER_STATUS.ACTIVE
                                  })}
                                  loading={actionLoading[user.id]}
                                >
                                  Activate
                                </Button>
                              ) : user.status === USER_STATUS.PENDING ? (
                                <div className="flex space-x-1">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => setConfirmDialog({
                                      show: true,
                                      user,
                                      action: USER_STATUS.APPROVED
                                    })}
                                    loading={actionLoading[user.id]}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setConfirmDialog({
                                      show: true,
                                      user,
                                      action: USER_STATUS.REJECTED
                                    })}
                                    loading={actionLoading[user.id]}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }))}
        />
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={userModal.show}
        onClose={() => {
          setUserModal({ show: false, user: null, isEdit: false });
          setUserForm({ name: '', email: '', role: '', status: '', specialty: '', phoneNumber: '' });
        }}
        title={userModal.isEdit ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <div className="space-y-4">
          <FormField
            label="Full Name"
            name="name"
            value={userForm.name}
            onChange={(e) => handleUserFormChange('name', e.target.value)}
            required
          />
          
          <FormField
            label="Email"
            name="email"
            type="email"
            value={userForm.email}
            onChange={(e) => handleUserFormChange('email', e.target.value)}
            disabled={userModal.isEdit}
            required
          />
          
          <FormField
            label="Role"
            name="role"
            type="select"
            value={userForm.role}
            onChange={(e) => handleUserFormChange('role', e.target.value)}
            options={[
              { value: '', label: 'Select Role' },
              { value: USER_ROLES.ADMIN, label: 'Admin' },
              { value: USER_ROLES.PATIENT, label: 'Patient' },
              { value: USER_ROLES.DOCTOR, label: 'Doctor' }
            ]}
            required
          />
          
          {userForm.role && (
            <FormField
              label="Status"
              name="status"
              type="select"
              value={userForm.status}
              onChange={(e) => handleUserFormChange('status', e.target.value)}
              options={[
                { value: '', label: 'Select Status' },
                ...getStatusOptionsForRole(userForm.role)
              ]}
              required
            />
          )}
          
          {userForm.role === USER_ROLES.DOCTOR && (
            <FormField
              label="Specialty"
              name="specialty"
              value={userForm.specialty}
              onChange={(e) => handleUserFormChange('specialty', e.target.value)}
              placeholder="e.g., Cardiology, Neurology"
            />
          )}
          
          <FormField
            label="Phone Number"
            name="phoneNumber"
            value={userForm.phoneNumber}
            onChange={(e) => handleUserFormChange('phoneNumber', e.target.value)}
            placeholder="Optional"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setUserModal({ show: false, user: null, isEdit: false });
                setUserForm({ name: '', email: '', role: '', status: '', specialty: '', phoneNumber: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveUser}
              disabled={!userForm.name || !userForm.email || !userForm.role || !userForm.status}
            >
              {userModal.isEdit ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={
          confirmDialog.action === USER_STATUS.SUSPENDED ? 'Suspend User' :
          confirmDialog.action === USER_STATUS.ACTIVE ? 'Activate User' :
          confirmDialog.action === USER_STATUS.APPROVED ? 'Approve User' :
          confirmDialog.action === USER_STATUS.REJECTED ? 'Reject User' :
          'Confirm Action'
        }
        message={`Are you sure you want to ${
          confirmDialog.action === USER_STATUS.SUSPENDED
            ? 'suspend'
            : confirmDialog.action === USER_STATUS.ACTIVE
            ? 'activate'
            : confirmDialog.action === USER_STATUS.APPROVED
            ? 'approve'
            : confirmDialog.action === USER_STATUS.REJECTED
            ? 'reject'
            : 'perform this action on'
        } ${confirmDialog.user?.name}?`}
        confirmLabel={
          confirmDialog.action === USER_STATUS.SUSPENDED ? 'Suspend' :
          confirmDialog.action === USER_STATUS.ACTIVE ? 'Activate' :
          confirmDialog.action === USER_STATUS.APPROVED ? 'Approve' :
          confirmDialog.action === USER_STATUS.REJECTED ? 'Reject' :
          'Confirm'
        }
        confirmVariant={
          confirmDialog.action === USER_STATUS.SUSPENDED ? 'warning' :
          confirmDialog.action === USER_STATUS.ACTIVE ? 'success' :
          confirmDialog.action === USER_STATUS.APPROVED ? 'success' :
          confirmDialog.action === USER_STATUS.REJECTED ? 'danger' :
          'primary'
        }
        onConfirm={() => handleStatusChange(confirmDialog.user, confirmDialog.action)}
        onCancel={() => setConfirmDialog({ show: false, user: null, action: null })}
        loading={actionLoading[confirmDialog.user?.id]}
      />
    </DashboardLayout>
  );
};

export default UserManagement;
