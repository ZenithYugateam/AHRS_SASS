import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      setMessage("No user is currently logged in.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    setLoading(true);
    setMessage("");

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage(error.message || "Error updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-xl font-bold mb-4">Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Current Password</label>
          <input 
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">New Password</label>
          <input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Confirm New Password</label>
          <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        {message && (
          <p className="mb-4 text-sm text-red-400">{message}</p>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
