import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const statusVariant = (status) => {
  switch (status) {
    case 'accepted':
      return 'success';
    case 'completed':
      return 'primary';
    default:
      return 'warning';
  }
};

export default function MockInterviews() {
  const [role, setRole] = useState('Software Engineer');
  const [message, setMessage] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [budget, setBudget] = useState('');
  const [mode, setMode] = useState('Online');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error(userError?.message || 'User not authenticated');
      }

      console.log('Fetching mock interviews for user:', userData.user.id);

      const { data, error: fetchError } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }
      setRequests(data || []);
    } catch (err) {
      console.error('Error in fetchRequests:', err);
      setError(err.message || 'Unable to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!role || !message.trim() || !scheduledAt || !budget || !mode) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error(userError?.message || 'User not authenticated');
      }

      console.log('Submitting mock interview for user:', userData.user.id);
      const scheduledAtISO = new Date(scheduledAt).toISOString();
      console.log('Scheduled at ISO:', scheduledAtISO);

      const insertData = {
        user_id: userData.user.id,
        role,
        message,
        scheduled_at: scheduledAtISO,
        budget: parseInt(budget, 10), // Ensure integer
        mode,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      console.log('Insert data:', insertData);

      const { data, error: insertError } = await supabase.from('mock_interviews').insert([insertData]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      console.log('Insert successful:', data);
      setSuccess('Mock interview request submitted successfully!');
      setRole('Software Engineer');
      setMessage('');
      setScheduledAt('');
      setBudget('');
      setMode('Online');

      await fetchRequests();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatScheduled = (scheduled) => {
    if (!scheduled) return 'Not scheduled';
    try {
      const dt = new Date(scheduled);
      return dt.toLocaleString();
    } catch {
      return scheduled;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Mock Interviews</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Request mock interviews and track your submissions in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-900 xl:col-span-1">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Create Request</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">{success}</div>}

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Software Engineer"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-experr-500 focus:ring-2 focus:ring-experr-100 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe your goals for the mock interview"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-experr-500 focus:ring-2 focus:ring-experr-100 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-experr-500 focus:ring-2 focus:ring-experr-100 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget</label>
                <input
                  type="number"
                  value={budget}
                  min={0}
                  step={0.01}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="100"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-experr-500 focus:ring-2 focus:ring-experr-100 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-experr-500 focus:ring-2 focus:ring-experr-100 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>

        <div className="xl:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Your Requests</h2>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600 dark:border-dark-700 dark:bg-dark-900 dark:text-gray-300">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600 dark:border-dark-700 dark:bg-dark-900 dark:text-gray-300">No mock interview requests yet.</div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-700 dark:bg-dark-900">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{req.role || 'Unknown role'}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                        {req.message ? `${req.message.slice(0, 120)}${req.message.length > 120 ? '...' : ''}` : 'No message provided'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant(req.status || 'pending')}>{req.status || 'pending'}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-300">{formatScheduled(req.scheduled_at)}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Budget: ₹{req.budget ?? '0'}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Mode: {req.mode}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Created: {new Date(req.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
