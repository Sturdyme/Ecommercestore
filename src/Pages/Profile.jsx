import React, { useState } from 'react';
import {
  FaCheck,
  FaTimes,
  FaUser,
  FaLock,
  FaShieldAlt,
  FaBell,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCamera,
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: FaUser },
  { id: 'security', label: 'Password & Security', icon: FaLock },
  { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
  { id: 'notifications', label: 'Notifications', icon: FaBell },
  { id: 'privacy', label: 'Privacy & Data', icon: FaShieldAlt },
  { id: 'danger', label: 'Danger Zone', icon: FaExclamationTriangle },
];

// Small reusable banner for success/error feedback across sections
const Banner = ({ tone = 'success', children }) => {
  const styles =
    tone === 'success'
      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400'
      : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400';
  return (
    <div className={`mb-4 p-3 rounded-lg border text-sm font-semibold ${styles}`}>
      {children}
    </div>
  );
};

const SectionCard = ({ title, description, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
    <h3 className="text-lg font-bold text-black dark:text-white">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">{description}</p>
    )}
    {!description && <div className="mb-6" />}
    {children}
  </div>
);

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    <input
      {...props}
      className="mt-1.5 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
  </label>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="pr-6">
      <p className="text-sm font-semibold text-black dark:text-white">{label}</p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {};
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState('personal');

  // Profile photo state
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Personal info form state
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [personalStatus, setPersonalStatus] = useState(null); // { tone, message }
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Address form state
  const [address, setAddress] = useState({
    line1: user.address?.line1 || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    postalCode: user.address?.postalCode || '',
  });
  const [addressStatus, setAddressStatus] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: user.notifications?.orderUpdates ?? true,
    promotions: user.notifications?.promotions ?? false,
    newsletter: user.notifications?.newsletter ?? false,
    smsAlerts: user.notifications?.smsAlerts ?? false,
  });

  // Privacy preferences
  const [privacy, setPrivacy] = useState({
    shareActivity: user.privacy?.shareActivity ?? false,
    personalizedAds: user.privacy?.personalizedAds ?? true,
  });

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const persistUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // ---- Profile photo ----
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempProfilePic(reader.result);
      setUploading(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (!tempProfilePic) return;
    setProfilePic(tempProfilePic);
    setTempProfilePic(null);
    persistUser({ profilePic: tempProfilePic });
    if (user?.email) {
      localStorage.setItem(`profilePic_${user.email}`, tempProfilePic);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelImage = () => setTempProfilePic(null);

  // ---- Personal info ----
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    setPersonalStatus(null);
    try {
      await axios.put(
        `${API_URL}/api/user/profile`,
        { name, email, phone },
        { headers: authHeaders() }
      );
      persistUser({ name, email, phone });
      setPersonalStatus({ tone: 'success', message: 'Personal information updated.' });
    } catch (error) {
      setPersonalStatus({
        tone: 'error',
        message:
          error.response?.data?.message || 'Could not save your changes. Please try again.',
      });
    } finally {
      setSavingPersonal(false);
    }
  };

  // ---- Password ----
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({ tone: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ tone: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setSavingPassword(true);
    try {
      await axios.put(
        `${API_URL}/api/user/password`,
        { current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword },
        { headers: authHeaders() }
      );
      setPasswordStatus({ tone: 'success', message: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordStatus({
        tone: 'error',
        message: error.response?.data?.message || 'Could not change your password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // ---- Address ----
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressStatus(null);
    try {
      await axios.put(`${API_URL}/api/user/address`, address, { headers: authHeaders() });
      persistUser({ address });
      setAddressStatus({ tone: 'success', message: 'Address saved.' });
    } catch (error) {
      setAddressStatus({
        tone: 'error',
        message: error.response?.data?.message || 'Could not save your address.',
      });
    } finally {
      setSavingAddress(false);
    }
  };

  // ---- Notifications / Privacy (saved immediately on toggle) ----
  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    persistUser({ notifications: updated });
    axios
      .put(`${API_URL}/api/user/notifications`, updated, { headers: authHeaders() })
      .catch(() => {});
  };

  const togglePrivacy = (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    persistUser({ privacy: updated });
    axios
      .put(`${API_URL}/api/user/privacy`, updated, { headers: authHeaders() })
      .catch(() => {});
  };

  // ---- Danger zone ----
  const handleLogoutAllDevices = async () => {
    if (!window.confirm('Log out of all devices? You will need to sign in again everywhere.')) return;
    try {
      await axios.post(`${API_URL}/api/logout-all`, {}, { headers: authHeaders() });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Delete your account permanently? This cannot be undone and all your order history will be lost.'
      )
    )
      return;
    try {
      await axios.delete(`${API_URL}/api/user`, { headers: authHeaders() });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Manage your profile, security, and preferences.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* SIDEBAR */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:sticky lg:top-8 h-fit">
            {/* Mini profile card */}
            <div className="flex items-center gap-3 px-2 pb-4 mb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-600 shrink-0">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs">
                    <FaUser />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black dark:text-white truncate">
                  {user.name || 'Your account'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || '-'}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-base shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* CONTENT */}
          <div className="space-y-6">
            {activeTab === 'personal' && (
              <>
                <SectionCard title="Profile photo" description="Shown on your reviews and order history.">
                  {saveSuccess && <Banner tone="success">Profile picture saved successfully!</Banner>}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-600 shrink-0 shadow">
                      {tempProfilePic ? (
                        <img src={tempProfilePic} alt="Preview" className="w-full h-full object-cover" />
                      ) : profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                          <FaCamera />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-block">
                        <span className="sr-only">Choose profile photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 cursor-pointer"
                          onChange={handleImageChange}
                          disabled={uploading || tempProfilePic !== null}
                        />
                      </label>
                      {uploading && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-semibold">
                          Processing image...
                        </p>
                      )}
                      {tempProfilePic && (
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={handleSaveImage}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            <FaCheck /> Save
                          </button>
                          <button
                            onClick={handleCancelImage}
                            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Personal information" description="Your name, email, and phone number.">
                  {personalStatus && <Banner tone={personalStatus.tone}>{personalStatus.message}</Banner>}
                  <form onSubmit={handleSavePersonal} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                      <Field
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Field
                      label="Phone number"
                      type="tel"
                      placeholder="e.g. 08012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={savingPersonal}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
                    >
                      {savingPersonal ? 'Saving...' : 'Save changes'}
                    </button>
                  </form>
                </SectionCard>
              </>
            )}

            {activeTab === 'security' && (
              <SectionCard title="Change password" description="Choose a strong password you don't use elsewhere.">
                {passwordStatus && <Banner tone={passwordStatus.tone}>{passwordStatus.message}</Banner>}
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <Field
                    label="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <Field
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <Field
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
                  >
                    {savingPassword ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              </SectionCard>
            )}

            {activeTab === 'addresses' && (
              <SectionCard title="Shipping address" description="Used to prefill checkout and estimate delivery.">
                {addressStatus && <Banner tone={addressStatus.tone}>{addressStatus.message}</Banner>}
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <Field
                    label="Street address"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field
                      label="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                    <Field
                      label="State"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                    <Field
                      label="Postal code"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
                  >
                    {savingAddress ? 'Saving...' : 'Save address'}
                  </button>
                </form>
              </SectionCard>
            )}

            {activeTab === 'notifications' && (
              <SectionCard title="Notification preferences" description="Choose what we contact you about.">
                <Toggle
                  label="Order updates"
                  description="Shipping, delivery, and OTP verification emails."
                  checked={notifications.orderUpdates}
                  onChange={() => toggleNotification('orderUpdates')}
                />
                <Toggle
                  label="Promotions & discounts"
                  description="Sales, new arrivals, and limited-time offers."
                  checked={notifications.promotions}
                  onChange={() => toggleNotification('promotions')}
                />
                <Toggle
                  label="Newsletter"
                  description="Occasional style guides and store news."
                  checked={notifications.newsletter}
                  onChange={() => toggleNotification('newsletter')}
                />
                <Toggle
                  label="SMS alerts"
                  description="Text messages for time-sensitive order updates."
                  checked={notifications.smsAlerts}
                  onChange={() => toggleNotification('smsAlerts')}
                />
              </SectionCard>
            )}

            {activeTab === 'privacy' && (
              <SectionCard title="Privacy & data" description="Control how your data is used.">
                <Toggle
                  label="Share activity for recommendations"
                  description="Lets us suggest products based on your browsing and past orders."
                  checked={privacy.shareActivity}
                  onChange={() => togglePrivacy('shareActivity')}
                />
                <Toggle
                  label="Personalized ads"
                  description="Show ads based on your shopping activity on this site."
                  checked={privacy.personalizedAds}
                  onChange={() => togglePrivacy('personalizedAds')}
                />
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-black dark:text-white mb-1">Download your data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Get a copy of your orders, profile, and account activity.
                  </p>
                  <button
                    onClick={() =>
                      axios
                        .post(`${API_URL}/api/user/data-export`, {}, { headers: authHeaders() })
                        .then(() => alert('Your data export has been emailed to you.'))
                        .catch(() => alert('Could not start data export. Please try again.'))
                    }
                    className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Request data export
                  </button>
                </div>
              </SectionCard>
            )}

            {activeTab === 'danger' && (
              <SectionCard title="Danger zone" description="These actions are difficult or impossible to undo.">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">Log out of all devices</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Ends every active session, including this one.
                      </p>
                    </div>
                    <button
                      onClick={handleLogoutAllDevices}
                      className="shrink-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      Log out everywhere
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">Delete account</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Permanently deletes your account and order history.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
