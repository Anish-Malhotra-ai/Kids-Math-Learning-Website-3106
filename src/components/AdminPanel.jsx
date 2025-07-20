import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers, addUser, removeUser, updateUser, exportUsersToCSV, importUsersFromCSV, resetUsers } from '../utils/userManager';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const AdminPanel = ({ currentUser, onClose, onLogin }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'student' });
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [csvData, setCsvData] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const result = addUser(
      newUser.username,
      newUser.password,
      newUser.name,
      newUser.role
    );
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setNewUser({ username: '', password: '', name: '', role: 'student' });
      refreshUsers();
    }
  };

  const handleRemoveUser = (username) => {
    // Prevent removing yourself
    if (username === currentUser.username) {
      setMessage({ text: "You cannot remove your own account while logged in", type: "error" });
      return;
    }
    
    const result = removeUser(username);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      refreshUsers();
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    const result = updateUser(editingUser.username, editingUser);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setEditingUser(null);
      refreshUsers();
    }
  };

  const handleExportUsers = () => {
    const csv = exportUsersToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'math_users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportUsers = (e) => {
    e.preventDefault();
    const result = importUsersFromCSV(csvData);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setCsvData('');
      setShowImport(false);
      refreshUsers();
    }
  };

  const handleResetUsers = () => {
    if (window.confirm('Are you sure you want to reset all users to default? This cannot be undone.')) {
      const result = resetUsers();
      setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
      if (result.success) {
        refreshUsers();
      }
    }
  };

  const generateMailtoLink = (user) => {
    const subject = encodeURIComponent('Welcome to Numbers Are Fun!');
    const body = encodeURIComponent(
      `Hi ${user.name || user.username},\n\n` +
      `You have been added to Numbers Are Fun! Below are your login details:\n\n` +
      `Username: ${user.username}\n` +
      `Password: ${user.password}\n` +
      `Role: ${user.role}\n\n` +
      `You can log in here:\n` +
      `https://social.anish-malhotra.com/Numbers-are-fun\n\n` +
      `Have fun learning!\n` +
      `--\n` +
      `Your Support Team`
    );
    return `mailto:${user.username}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users for Math Fun Zone</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors"
            >
              Enter as {currentUser.name || currentUser.username}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-600 transition-colors"
            >
              Back to Login
            </motion.button>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* User List Section */}
          <div className="bg-purple-50 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">User Accounts</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-200">
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.username} className="border-b border-purple-100">
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.name || user.username}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <SafeIcon icon={FiIcons.FiEdit} />
                            Edit
                          </button>
                          <a
                            href={generateMailtoLink(user)}
                            className="bg-teal-500 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-teal-600 transition-colors"
                          >
                            <SafeIcon icon={FiIcons.FiMail} />
                            Email
                          </a>
                          <button
                            onClick={() => handleRemoveUser(user.username)}
                            className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                            disabled={user.username === currentUser.username}
                          >
                            <SafeIcon icon={FiIcons.FiTrash2} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Import/Export Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleExportUsers}
                className="bg-indigo-500 text-white px-3 py-2 rounded-xl text-sm font-semibold"
              >
                Export to CSV
              </button>
              <button
                onClick={() => setShowImport(!showImport)}
                className="bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold"
              >
                {showImport ? 'Cancel Import' : 'Import from CSV'}
              </button>
              <button
                onClick={handleResetUsers}
                className="bg-gray-500 text-white px-3 py-2 rounded-xl text-sm font-semibold"
              >
                Reset to Default
              </button>
            </div>

            {/* CSV Import Form */}
            {showImport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 border border-purple-200 rounded-xl bg-white"
              >
                <h3 className="text-lg font-semibold mb-2">Import Users from CSV</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Format: Username,Password,Name,Role (admin/student)
                </p>
                <form onSubmit={handleImportUsers}>
                  <textarea
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-3"
                    placeholder="Username,Password,Name,Role&#10;user1,pass1,Student 1,student&#10;admin,admin123,Administrator,admin"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    Import Users
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Add/Edit User Form */}
          <div className="bg-blue-50 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={editingUser ? editingUser.username : newUser.username}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, username: e.target.value })
                      : setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full p-3 border-2 border-blue-300 rounded-xl"
                  placeholder="Enter username"
                  required
                  disabled={editingUser}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={editingUser ? editingUser.password : newUser.password}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, password: e.target.value })
                      : setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full p-3 border-2 border-blue-300 rounded-xl"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full p-3 border-2 border-blue-300 rounded-xl"
                  placeholder="Enter display name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  value={editingUser ? editingUser.role : newUser.role}
                  onChange={(e) =>
                    editingUser
                      ? setEditingUser({ ...editingUser, role: e.target.value })
                      : setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full p-3 border-2 border-blue-300 rounded-xl"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-md"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </motion.button>
                {editingUser && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold shadow-md"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </form>

            {/* CSV Format Help */}
            <div className="mt-8 bg-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">CSV Format Guide</h3>
              <p className="text-sm mb-2">Your CSV file should have these columns:</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                Username,Password,Name,Role
                student1,pass123,John Smith,student
                teacher1,secure456,Ms. Johnson,admin
              </pre>
              <ul className="text-xs mt-2 text-gray-600 list-disc pl-5">
                <li>First row must be the header</li>
                <li>Role must be either "admin" or "student"</li>
                <li>Name is optional (will use username if empty)</li>
                <li>At least one admin user is required</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;