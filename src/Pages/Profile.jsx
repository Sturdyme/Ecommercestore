import React, { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaCheck, FaTimes, FaUser, FaLock, FaShieldAlt, FaBell, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

import COUNTRIES from '../Utilities/countries.js';


// ============================================================
// CONFIGURATION
// ============================================================

const API_URL = import.meta.env.VITE_API_URL;


// ============================================================
// TABS
// ============================================================

const TABS = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: FaUser,
  },
  {
    id: 'security',
    label: 'Password & Security',
    icon: FaLock,
  },
  {
    id: 'addresses',
    label: 'Addresses',
    icon: FaMapMarkerAlt,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: FaBell,
  },
  {
    id: 'privacy',
    label: 'Privacy & Data',
    icon: FaShieldAlt,
  },
  {
    id: 'danger',
    label: 'Danger Zone',
    icon: FaExclamationTriangle,
  },
];


// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const Banner = ({ tone = 'success', children }) => {
  const styles =
    tone === 'success'
      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400'
      : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400';

  return (
    <div
      className={`mb-4 rounded-lg border p-3 text-sm font-semibold ${styles}`}
    >
      {children}
    </div>
  );
};


const SectionCard = ({ title, description, children }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
    <h3 className="text-lg font-bold text-black dark:text-white">
      {title}
    </h3>

    {description ? (
      <p className="mt-1 mb-6 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    ) : (
      <div className="mb-6" />
    )}

    {children}
  </div>
);


const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </span>

    <input
      {...props}
      className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
    />
  </label>
);


const CountrySelect = ({ value, onChange }) => (
  <label className="block">
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
      Country
    </span>

    <select
      value={value || ''}
      onChange={onChange}
      className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
    >
      <option value="" disabled>
        Select your country
      </option>

      {COUNTRIES.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  </label>
);


const Toggle = ({
  label,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-start justify-between border-b border-gray-100 py-4 last:border-0 dark:border-gray-700">
    <div className="pr-6">
      <p className="text-sm font-semibold text-black dark:text-white">
        {label}
      </p>

      {description && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        checked
          ? 'bg-purple-600'
          : 'bg-gray-300 dark:bg-gray-600'
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


// ============================================================
// PROFILE COMPONENT
// ============================================================

const Profile = () => {

  // ==========================================================
  // USER DATA
  // ==========================================================

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');

      return storedUser && storedUser !== 'undefined'
        ? JSON.parse(storedUser)
        : {};
    } catch (error) {
      console.error(
        'Error parsing user from localStorage:',
        error
      );

      return {};
    }
  });


  // ==========================================================
  // GENERAL STATE
  // ==========================================================

  const [activeTab, setActiveTab] = useState('personal');


  // ==========================================================
  // PROFILE PHOTO STATE
  // ==========================================================

  const [profilePic, setProfilePic] = useState(
    user.profilePic || null
  );

  const [tempProfilePic, setTempProfilePic] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);


  // ==========================================================
  // PERSONAL INFORMATION STATE
  // ==========================================================

  const [name, setName] = useState(user.name || '');

  const [email, setEmail] = useState(user.email || '');

  const [phone, setPhone] = useState(user.phone || '');

  const [personalStatus, setPersonalStatus] = useState(null);

  const [savingPersonal, setSavingPersonal] = useState(false);


  // ==========================================================
  // PASSWORD STATE
  // ==========================================================

  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordStatus, setPasswordStatus] = useState(null);

  const [savingPassword, setSavingPassword] = useState(false);


  // ==========================================================
  // ADDRESS STATE
  // ==========================================================

  const [address, setAddress] = useState({
    line1: user.address?.line1 || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    postalCode: user.address?.postalCode || '',
    country: user.address?.country || '',
  });

  const [addressStatus, setAddressStatus] = useState(null);

  const [savingAddress, setSavingAddress] = useState(false);


  // ==========================================================
  // NOTIFICATION STATE
  // ==========================================================

  const [notifications, setNotifications] = useState({
    orderUpdates:
      user.notifications?.orderUpdates ?? true,

    promotions:
      user.notifications?.promotions ?? false,

    newsletter:
      user.notifications?.newsletter ?? false,

    smsAlerts:
      user.notifications?.smsAlerts ?? false,
  });


  // ==========================================================
  // PRIVACY STATE
  // ==========================================================

  const [privacy, setPrivacy] = useState({
    shareActivity:
      user.privacy?.shareActivity ?? false,

    personalizedAds:
      user.privacy?.personalizedAds ?? true,
  });


  // ==========================================================
  // AUTHENTICATION HELPERS
  // ==========================================================

  const authHeaders = () => {
    const token = localStorage.getItem('token');

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };


  // ==========================================================
  // LOCAL USER PERSISTENCE
  // ==========================================================

  const persistUser = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields,
    };

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };


  // ==========================================================
  // PROFILE PHOTO HANDLERS
  // ==========================================================

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

    persistUser({
      profilePic: tempProfilePic,
    });

    if (user?.email) {
      localStorage.setItem(
        `profilePic_${user.email}`,
        tempProfilePic
      );
    }

    setSaveSuccess(true);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };


  const handleCancelImage = () => {
    setTempProfilePic(null);
  };


  // ==========================================================
  // PERSONAL INFORMATION HANDLER
  // ==========================================================

  const handleSavePersonal = async (e) => {
    e.preventDefault();

    setSavingPersonal(true);

    setPersonalStatus(null);

    try {
      await axios.put(
        `${API_URL}/api/user/profile`,
        {
          name,
          email,
          phone,
        },
        {
          headers: authHeaders(),
        }
      );

      persistUser({
        name,
        email,
        phone,
      });

      setPersonalStatus({
        tone: 'success',
        message:
          'Personal information updated.',
      });
    } catch (error) {
      setPersonalStatus({
        tone: 'error',
        message:
          error.response?.data?.message ||
          'Could not save your changes. Please try again.',
      });
    } finally {
      setSavingPersonal(false);
    }
  };


  // ==========================================================
  // PASSWORD HANDLER
  // ==========================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({
        tone: 'error',
        message:
          'New password must be at least 8 characters.',
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        tone: 'error',
        message:
          'New password and confirmation do not match.',
      });

      return;
    }

    setSavingPassword(true);

    try {
      await axios.put(
        `${API_URL}/api/user/password`,
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        {
          headers: authHeaders(),
        }
      );

      setPasswordStatus({
        tone: 'success',
        message: 'Password changed successfully.',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordStatus({
        tone: 'error',
        message:
          error.response?.data?.message ||
          'Could not change your password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };


  // ==========================================================
  // ADDRESS HANDLER
  // ==========================================================

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    setSavingAddress(true);

    setAddressStatus(null);

    try {
      await axios.put(
        `${API_URL}/api/user/address`,
        address,
        {
          headers: authHeaders(),
        }
      );

      persistUser({
        address,
      });

      setAddressStatus({
        tone: 'success',
        message: 'Address saved.',
      });
    } catch (error) {
      setAddressStatus({
        tone: 'error',
        message:
          error.response?.data?.message ||
          'Could not save your address.',
      });
    } finally {
      setSavingAddress(false);
    }
  };


  // ==========================================================
  // NOTIFICATION HANDLER
  // ==========================================================

  const toggleNotification = (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updated);

    persistUser({
      notifications: updated,
    });

    axios
      .put(
        `${API_URL}/api/user/notifications`,
        updated,
        {
          headers: authHeaders(),
        }
      )
      .catch(() => {});
  };


  // ==========================================================
  // PRIVACY HANDLER
  // ==========================================================

  const togglePrivacy = (key) => {
    const updated = {
      ...privacy,
      [key]: !privacy[key],
    };

    setPrivacy(updated);

    persistUser({
      privacy: updated,
    });

    axios
      .put(
        `${API_URL}/api/user/privacy`,
        updated,
        {
          headers: authHeaders(),
        }
      )
      .catch(() => {});
  };


  // ==========================================================
  // DANGER ZONE
  // ==========================================================

  const handleLogoutAllDevices = async () => {
    if (
      !window.confirm(
        'Log out of all devices? You will need to sign in again everywhere.'
      )
    ) {
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/logout-all`,
        {},
        {
          headers: authHeaders(),
        }
      );
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
    ) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/user`,
        {
          headers: authHeaders(),
        }
      );
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/';
    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Account Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your profile, security, and preferences.
          </p>
        </div>


        {/* ====================================================
            MAIN LAYOUT
        ==================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <div className="h-fit rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:sticky lg:top-8">

            {/* Mini Profile */}
            <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-2 pb-4 dark:border-gray-700">

              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-purple-600">

                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500 dark:bg-gray-700">
                    <FaUser />
                  </div>
                )}

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-black dark:text-white">
                  {user.name || 'Your account'}
                </p>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.email || '-'}
                </p>

              </div>

            </div>


            {/* Navigation */}
            <nav className="space-y-1">

              {TABS.map(
                ({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setActiveTab(id)
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      activeTab === id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="shrink-0 text-base" />

                    {label}
                  </button>
                )
              )}

            </nav>

          </div>


          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="space-y-6">


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            {activeTab === 'personal' && (
              <>

                {/* Profile Photo */}
                <SectionCard
                  title="Profile photo"
                  description="Shown on your reviews and order history."
                >

                  {saveSuccess && (
                    <Banner tone="success">
                      Profile picture saved successfully!
                    </Banner>
                  )}

                  <div className="flex items-center gap-6">

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-purple-600 shadow">

                      {tempProfilePic ? (
                        <img
                          src={tempProfilePic}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-700">
                          <FaCamera />
                        </div>
                      )}

                    </div>


                    <div className="flex-1">

                      <label className="inline-block">

                        <span className="sr-only">
                          Choose profile photo
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100 dark:text-gray-400 dark:file:bg-purple-900/30 dark:file:text-purple-400 dark:hover:file:bg-purple-900/50"
                          onChange={handleImageChange}
                          disabled={
                            uploading ||
                            tempProfilePic !== null
                          }
                        />

                      </label>


                      {uploading && (
                        <p className="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                          Processing image...
                        </p>
                      )}


                      {tempProfilePic && (
                        <div className="mt-3 flex gap-3">

                          <button
                            type="button"
                            onClick={handleSaveImage}
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-purple-700"
                          >
                            <FaCheck />
                            Save
                          </button>


                          <button
                            type="button"
                            onClick={handleCancelImage}
                            className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            <FaTimes />
                            Cancel
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                </SectionCard>


                {/* Personal Information */}
                <SectionCard
                  title="Personal information"
                  description="Your name, email, and phone number."
                >

                  {personalStatus && (
                    <Banner tone={personalStatus.tone}>
                      {personalStatus.message}
                    </Banner>
                  )}


                  <form
                    onSubmit={handleSavePersonal}
                    className="space-y-4"
                  >

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <Field
                        label="Full name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                      />

                      <Field
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                      />

                    </div>


                    <Field
                      label="Phone number"
                      type="tel"
                      placeholder="e.g. 08012345678"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                    />


                    <button
                      type="submit"
                      disabled={savingPersonal}
                      className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                    >
                      {savingPersonal
                        ? 'Saving...'
                        : 'Save changes'}
                    </button>

                  </form>

                </SectionCard>

              </>
            )}


            {/* =================================================
                SECURITY
            ================================================= */}

            {activeTab === 'security' && (
              <SectionCard
                title="Change password"
                description="Choose a strong password you don't use elsewhere."
              >

                {passwordStatus && (
                  <Banner tone={passwordStatus.tone}>
                    {passwordStatus.message}
                  </Banner>
                )}


                <form
                  onSubmit={handleChangePassword}
                  className="max-w-md space-y-4"
                >

                  <Field
                    label="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    autoComplete="current-password"
                  />


                  <Field
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                  />


                  <Field
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                  />


                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  >
                    {savingPassword
                      ? 'Updating...'
                      : 'Update password'}
                  </button>

                </form>

              </SectionCard>
            )}


            {/* =================================================
                ADDRESSES
            ================================================= */}

            {activeTab === 'addresses' && (
              <SectionCard
                title="Shipping address"
                description="Used to prefill checkout and estimate delivery."
              >

                {addressStatus && (
                  <Banner tone={addressStatus.tone}>
                    {addressStatus.message}
                  </Banner>
                )}


                <form
                  onSubmit={handleSaveAddress}
                  className="space-y-4"
                >

                  {/* Street */}
                  <Field
                    label="Street address"
                    value={address.line1}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        line1: e.target.value,
                      })
                    }
                  />


                  {/* Location Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <Field
                      label="City"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          city: e.target.value,
                        })
                      }
                    />


                    <Field
                      label="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          state: e.target.value,
                        })
                      }
                    />


                    <Field
                      label="Postal code"
                      value={address.postalCode}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          postalCode:
                            e.target.value,
                        })
                      }
                    />


                    <CountrySelect
                      value={address.country}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          country:
                            e.target.value,
                        })
                      }
                    />

                  </div>


                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  >
                    {savingAddress
                      ? 'Saving...'
                      : 'Save address'}
                  </button>

                </form>

              </SectionCard>
            )}


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            {activeTab === 'notifications' && (
              <SectionCard
                title="Notification preferences"
                description="Choose what we contact you about."
              >

                <Toggle
                  label="Order updates"
                  description="Shipping, delivery, and OTP verification emails."
                  checked={
                    notifications.orderUpdates
                  }
                  onChange={() =>
                    toggleNotification(
                      'orderUpdates'
                    )
                  }
                />


                <Toggle
                  label="Promotions & discounts"
                  description="Sales, new arrivals, and limited-time offers."
                  checked={
                    notifications.promotions
                  }
                  onChange={() =>
                    toggleNotification(
                      'promotions'
                    )
                  }
                />


                <Toggle
                  label="Newsletter"
                  description="Occasional style guides and store news."
                  checked={
                    notifications.newsletter
                  }
                  onChange={() =>
                    toggleNotification(
                      'newsletter'
                    )
                  }
                />


                <Toggle
                  label="SMS alerts"
                  description="Text messages for time-sensitive order updates."
                  checked={
                    notifications.smsAlerts
                  }
                  onChange={() =>
                    toggleNotification(
                      'smsAlerts'
                    )
                  }
                />

              </SectionCard>
            )}


            {/* =================================================
                PRIVACY
            ================================================= */}

            {activeTab === 'privacy' && (
              <SectionCard
                title="Privacy & data"
                description="Control how your data is used."
              >

                <Toggle
                  label="Share activity for recommendations"
                  description="Lets us suggest products based on your browsing and past orders."
                  checked={
                    privacy.shareActivity
                  }
                  onChange={() =>
                    togglePrivacy(
                      'shareActivity'
                    )
                  }
                />


                <Toggle
                  label="Personalized ads"
                  description="Show ads based on your shopping activity on this site."
                  checked={
                    privacy.personalizedAds
                  }
                  onChange={() =>
                    togglePrivacy(
                      'personalizedAds'
                    )
                  }
                />


                {/* Data Export */}
                <div className="mt-2 border-t border-gray-100 pt-4 dark:border-gray-700">

                  <p className="mb-1 text-sm font-semibold text-black dark:text-white">
                    Download your data
                  </p>

                  <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                    Get a copy of your orders, profile, and account activity.
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      axios
                        .post(
                          `${API_URL}/api/user/data-export`,
                          {},
                          {
                            headers:
                              authHeaders(),
                          }
                        )
                        .then(() =>
                          alert(
                            'Your data export has been emailed to you.'
                          )
                        )
                        .catch(() =>
                          alert(
                            'Could not start data export. Please try again.'
                          )
                        )
                    }
                    className="text-sm font-semibold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Request data export
                  </button>

                </div>

              </SectionCard>
            )}


            {/* =================================================
                DANGER ZONE
            ================================================= */}

            {activeTab === 'danger' && (
              <SectionCard
                title="Danger zone"
                description="These actions are difficult or impossible to undo."
              >

                <div className="space-y-4">

                  {/* Logout */}
                  <div className="flex items-center justify-between border-b border-gray-100 py-4 dark:border-gray-700">

                    <div>

                      <p className="text-sm font-semibold text-black dark:text-white">
                        Log out of all devices
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Ends every active session, including this one.
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={
                        handleLogoutAllDevices
                      }
                      className="shrink-0 rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Log out everywhere
                    </button>

                  </div>


                  {/* Delete Account */}
                  <div className="flex items-center justify-between py-4">

                    <div>

                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        Delete account
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Permanently deletes your account and order history.
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={
                        handleDeleteAccount
                      }
                      className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
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