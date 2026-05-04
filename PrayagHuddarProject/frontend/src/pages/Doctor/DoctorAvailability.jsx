import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../services/apiClient';
import { AVAILABILITY_DAYS, TIME_SLOTS } from '../../config/constants';

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState({
    days: [],
    timeSlots: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await apiClient.get('/doctor/availability');
      setAvailability(response.data);
    } catch (error) {
      toast.error('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day, checked) => {
    setAvailability((prev) => ({
      ...prev,
      days: checked ? [...prev.days, day] : prev.days.filter((d) => d !== day),
    }));
  };

  const handleTimeSlotChange = (slot, checked) => {
    setAvailability((prev) => ({
      ...prev,
      timeSlots: checked
        ? [...prev.timeSlots, slot]
        : prev.timeSlots.filter((s) => s !== slot),
    }));
  };

  const handleSave = async () => {
    if (availability.days.length === 0) {
      toast.warning('Please select at least one day');
      return;
    }

    if (availability.timeSlots.length === 0) {
      toast.warning('Please select at least one time slot');
      return;
    }

    setSaving(true);
    try {
      await apiClient.put('/doctor/availability', availability);
      toast.success('Availability updated successfully');
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '400px' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="doctor-availability max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <i className="bi bi-calendar-check text-primary-600"></i>
            My Availability
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="bi bi-clock text-primary-600"></i>
                Set Your Available Days and Times
              </h2>
              {/* Available Days */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Available Days</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABILITY_DAYS.map((day) => (
                    <label
                      key={day}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                        availability.days.includes(day)
                          ? 'bg-primary-50 border-primary-500 text-primary-700 font-semibold'
                          : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox accent-primary-600"
                        checked={availability.days.includes(day)}
                        onChange={(e) => handleDayChange(day, e.target.checked)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              {/* Time Slots */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Available Time Slots</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                        availability.timeSlots.includes(slot)
                          ? 'bg-primary-50 border-primary-500 text-primary-700 font-semibold'
                          : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox accent-primary-600"
                        checked={availability.timeSlots.includes(slot)}
                        onChange={(e) =>
                          handleTimeSlotChange(slot, e.target.checked)
                        }
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end sticky bottom-0 bg-white pt-4 pb-2 z-10">
                <button
                  className="btn btn-primary px-6 py-2 rounded-lg font-semibold shadow hover:shadow-md transition disabled:opacity-60"
                  onClick={handleSave}
                  disabled={
                    saving ||
                    availability.days.length === 0 ||
                    availability.timeSlots.length === 0
                  }
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle mr-2"></i>
                      Save Availability
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Card */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <i className="bi bi-info-circle text-primary-600"></i>
                Current Schedule
              </h3>
              {availability.days.length > 0 ? (
                <>
                  <div className="mb-3">
                    <span className="font-medium">Available Days:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availability.days.map((day) => (
                        <span
                          key={day}
                          className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="font-medium">Time Slots:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availability.timeSlots.map((slot) => (
                        <span
                          key={slot}
                          className="inline-block bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 py-6">
                  <i className="bi bi-calendar-x text-3xl mb-2"></i>
                  <p className="mb-0">No availability set</p>
                  <small>
                    Select your available days and times to get started
                  </small>
                </div>
              )}
            </div>
            <div className="bg-primary-50 rounded-xl shadow p-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <i className="bi bi-lightbulb text-primary-600"></i>
                Tips
              </h4>
              <ul className="list-disc pl-5 text-sm text-primary-800 space-y-1">
                <li>
                  Set realistic availability to manage patient expectations
                </li>
                <li>Update your schedule regularly to reflect changes</li>
                <li>Consider time zones when setting availability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAvailability;
