import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload as UploadIcon, Save, Link as LinkIcon, Check, Image } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import FileManager from '../components/FileManager';
import { supabase } from '../lib/supabase';

interface AdminProps {
  onBackToHome: () => void;
}

interface TestimonialFile {
  id: string;
  file_name: string;
  url: string;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

type Tab = 'main-videos' | 'video-testimonials' | 'text-testimonial-images' | 'vsl-video';

export default function Admin({ onBackToHome }: AdminProps) {
  const [activeTab, setActiveTab] = useState<Tab>('main-videos');
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
    return () => { subscription.unsubscribe(); };
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to sign in');
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); };
  const handleUploadComplete = () => { setRefreshKey(prev => prev + 1); };

  useEffect(() => {
    if (isAuthenticated) fetchVslUrl();
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            <button onClick={onBackToHome} className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'main-videos' as const, label: 'Main Videos' },
    { id: 'video-testimonials' as const, label: 'Video Testimonials' },
    { id: 'text-testimonial-images' as const, label: 'Text Testimonial Images' },
    { id: 'vsl-video' as const, label: 'VSL Video' },
  ];

  const isFileBucket = activeTab === 'main-videos' || activeTab === 'text-testimonial-images';

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
            <button onClick={handleSignOut} className="text-sm text-gray-600 hover:text-gray-900">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'video-testimonials' ? (
          <TestimonialsManager refreshKey={refreshKey} onUploadComplete={handleUploadComplete} />
        ) : isFileBucket ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
              {activeTab === 'main-videos' && (
                <div className="mb-5 flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-1">Compress videos before uploading for faster load times</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Use <strong>HandBrake</strong> (free, desktop) or <strong>Clideo</strong> (free, browser-based) to compress to H.264 MP4 at 720p, quality ~28, 30fps. This typically reduces file size by 60-80% with no visible quality loss on small screens.
                    </p>
                  </div>
                </div>
              )}
              <FileUploader bucketId={activeTab as 'main-videos' | 'text-testimonial-images'} onUploadComplete={handleUploadComplete} />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h2>
              <FileManager bucketId={activeTab as 'main-videos' | 'text-testimonial-images'} refreshTrigger={refreshKey} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
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
        )}
      </div>
    </div>
  );
}

function TestimonialsManager({ refreshKey, onUploadComplete }: { refreshKey: number; onUploadComplete: () => void }) {
  const [testimonials, setTestimonials] = useState<TestimonialFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('id, file_name, url, testimonial_name, testimonial_designation, thumbnail_url, created_at')
      .eq('bucket_id', 'video-testimonials')
      .order('created_at', { ascending: false });
    if (!error) setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTestimonials(); }, [refreshKey]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Videos</h2>
        <div className="mb-5 flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Compress videos before uploading for faster load times</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Use <strong>HandBrake</strong> (free, desktop) or <strong>Clideo</strong> (free, browser-based) to compress to H.264 MP4 at 720p, quality ~28, 30fps.
            </p>
          </div>
        </div>
        <FileUploader bucketId="video-testimonials" onUploadComplete={() => { onUploadComplete(); fetchTestimonials(); }} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Testimonials ({testimonials.length})
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No testimonials uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <TestimonialRow
                key={t.id}
                testimonial={t}
                onUpdate={(updated) => {
                  setTestimonials(prev => prev.map(x => x.id === updated.id ? updated : x));
                }}
                onDelete={(id) => {
                  setTestimonials(prev => prev.filter(x => x.id !== id));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function TestimonialRow({
  testimonial,
  onUpdate,
  onDelete,
}: {
  testimonial: TestimonialFile;
  onUpdate: (t: TestimonialFile) => void;
  onDelete: (id: string) => void;
}) {
  const [designation, setDesignation] = useState(testimonial.testimonial_designation || '');
  const [name, setName] = useState(testimonial.testimonial_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const thumbRef = useRef<HTMLInputElement>(null);

  const isDirty = designation !== (testimonial.testimonial_designation || '') ||
    name !== (testimonial.testimonial_name || '');

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('uploaded_files')
      .update({
        testimonial_name: name.trim() || null,
        testimonial_designation: designation.trim() || null,
      })
      .eq('id', testimonial.id);
    setSaving(false);
    if (!error) {
      onUpdate({ ...testimonial, testimonial_name: name.trim() || null, testimonial_designation: designation.trim() || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) return;

    setUploadingThumb(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `thumb-${testimonial.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('text-testimonial-images')
        .upload(fileName, file, { cacheControl: '2592000', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('text-testimonial-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('uploaded_files')
        .update({ thumbnail_url: publicUrl })
        .eq('id', testimonial.id);
      if (dbError) throw dbError;

      onUpdate({ ...testimonial, thumbnail_url: publicUrl });
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
    } finally {
      setUploadingThumb(false);
      if (thumbRef.current) thumbRef.current.value = '';
    }
  };

  const handleRemoveThumbnail = async () => {
    const { error } = await supabase
      .from('uploaded_files')
      .update({ thumbnail_url: null })
      .eq('id', testimonial.id);
    if (!error) onUpdate({ ...testimonial, thumbnail_url: null });
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${testimonial.testimonial_name || testimonial.file_name}?`)) return;
    setDeleting(true);
    const filePath = testimonial.url.split('/').slice(-1)[0];
    await supabase.storage.from('video-testimonials').remove([filePath]);
    const { error } = await supabase.from('uploaded_files').delete().eq('id', testimonial.id);
    if (!error) onDelete(testimonial.id);
    setDeleting(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row">
        {/* Video preview */}
        <div className="sm:w-48 flex-shrink-0 bg-gray-900 relative">
          <video
            src={testimonial.url}
            className="w-full h-full object-cover sm:aspect-[9/12]"
            style={{ maxHeight: '180px' }}
            preload="metadata"
            muted
            playsInline
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client name"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. CEO, Entrepreneur, etc."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Thumbnail section */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Thumbnail</label>
            {testimonial.thumbnail_url ? (
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.thumbnail_url}
                  alt="Thumbnail"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => thumbRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    onClick={handleRemoveThumbnail}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => thumbRef.current?.click()}
                disabled={uploadingThumb}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-lg transition-colors disabled:opacity-50"
              >
                {uploadingThumb ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-500" />
                ) : (
                  <Image className="w-3.5 h-3.5" />
                )}
                {uploadingThumb ? 'Uploading...' : 'Add thumbnail'}
              </button>
            )}
            <input
              ref={thumbRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-40 ${
                saved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
