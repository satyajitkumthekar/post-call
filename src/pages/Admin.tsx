import { useState, useEffect } from 'react';
import { ArrowLeft, Upload as UploadIcon, Save, Link as LinkIcon } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import FileManager from '../components/FileManager';
import { supabase } from '../lib/supabase';

interface AdminProps {
  onBackToHome: () => void;
}

export default function Admin({ onBackToHome }: AdminProps) {
  const [selectedBucket, setSelectedBucket] = useState<'main-videos' | 'video-testimonials' | 'text-testimonial-images'>('main-videos');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [vslUrl, setVslUrl] = useState('');
  const [vslSaving, setVslSaving] = useState(false);
  const [vslSaved, setVslSaved] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setAuthError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to sign in');
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVslUrl();
    }
  }, [isAuthenticated]);

  const fetchVslUrl = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'vsl_video_url')
      .maybeSingle();
    if (data) setVslUrl(data.value);
  };

  const handleSaveVslUrl = async () => {
    setVslSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('site_settings')
      .update({ value: vslUrl, updated_by: user?.id, updated_at: new Date().toISOString() })
      .eq('key', 'vsl_video_url');
    setVslSaving(false);
    if (!error) {
      setVslSaved(true);
      setTimeout(() => setVslSaved(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <UploadIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
              <p className="text-gray-600 mt-2">Sign in to manage uploads</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSigningIn ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <button
              onClick={onBackToHome}
              className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const buckets = [
    { id: 'main-videos' as const, label: 'Main Videos' },
    { id: 'video-testimonials' as const, label: 'Video Testimonials' },
    { id: 'text-testimonial-images' as const, label: 'Text Testimonial Images' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-2">
            {buckets.map((bucket) => (
              <button
                key={bucket.id}
                onClick={() => setSelectedBucket(bucket.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBucket === bucket.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {bucket.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
          {(selectedBucket === 'main-videos' || selectedBucket === 'video-testimonials') && (
            <div className="mb-5 flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">Compress videos before uploading for faster load times</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Use <strong>HandBrake</strong> (free, desktop) or <strong>Clideo</strong> (free, browser-based) to compress to H.264 MP4 at 720p, quality ~28, 30fps. This typically reduces file size by 60–80% with no visible quality loss on small screens.
                </p>
              </div>
            </div>
          )}
          <FileUploader bucketId={selectedBucket} onUploadComplete={handleUploadComplete} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h2>
          <FileManager bucketId={selectedBucket} refreshTrigger={refreshKey} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">VSL Video URL</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Set the video URL for the /book landing page. This can be a direct MP4 link or a hosted video URL.
          </p>
          <div className="flex gap-3">
            <input
              type="url"
              value={vslUrl}
              onChange={(e) => setVslUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSaveVslUrl}
              disabled={vslSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {vslSaving ? 'Saving...' : vslSaved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
