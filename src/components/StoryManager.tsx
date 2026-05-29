import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, RefreshCw, Video, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StoryPanel {
  id: string;
  image_url: string;
  sequence_order: number;
  created_at: string;
}

interface TestimonialPanel {
  id: string;
  video_url: string;
  client_name: string;
  context_line: string;
  sequence_order: number;
  created_at: string;
}

export default function StoryManager() {
  const [storyPanels, setStoryPanels] = useState<StoryPanel[]>([]);
  const [testimonialPanels, setTestimonialPanels] = useState<TestimonialPanel[]>([]);
  const [loadingStory, setLoadingStory] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [uploadingTestimonial, setUploadingTestimonial] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'story' | 'testimonial'; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<{ clientName: string; contextLine: string; file: File | null } | null>(null);

  const storyFileRef = useRef<HTMLInputElement>(null);
  const testimonialFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStoryPanels();
    fetchTestimonialPanels();
  }, []);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  const fetchStoryPanels = async () => {
    setLoadingStory(true);
    const { data, error } = await supabase
      .from('story_panels')
      .select('*')
      .order('sequence_order', { ascending: true });
    if (error) showError('Failed to load story panels');
    else setStoryPanels(data || []);
    setLoadingStory(false);
  };

  const fetchTestimonialPanels = async () => {
    setLoadingTestimonials(true);
    const { data, error } = await supabase
      .from('testimonial_panels')
      .select('*')
      .order('sequence_order', { ascending: true });
    if (error) showError('Failed to load testimonial panels');
    else setTestimonialPanels(data || []);
    setLoadingTestimonials(false);
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Invalid file type. Use JPG, PNG, or WebP.');
      return;
    }

    setUploadingStory(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('story-images')
        .upload(fileName, file, { cacheControl: '2592000', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('story-images')
        .getPublicUrl(fileName);

      const nextOrder = storyPanels.length > 0
        ? Math.max(...storyPanels.map(p => p.sequence_order)) + 1
        : 1;

      const { error: dbError } = await supabase
        .from('story_panels')
        .insert({ image_url: publicUrl, sequence_order: nextOrder });
      if (dbError) throw dbError;

      await fetchStoryPanels();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingStory(false);
      if (storyFileRef.current) storyFileRef.current.value = '';
    }
  };

  const handleReplaceStoryImage = async (panelId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Invalid file type. Use JPG, PNG, or WebP.');
      return;
    }

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('story-images')
        .upload(fileName, file, { cacheControl: '2592000', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('story-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('story_panels')
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', panelId);
      if (dbError) throw dbError;

      await fetchStoryPanels();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Replace failed');
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const { error } = await supabase.from('story_panels').delete().eq('id', id);
      if (error) throw error;
      setStoryPanels(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Delete failed');
    }
    setDeleteConfirm(null);
  };

  const handleStoryOrderChange = async (id: string, newOrder: number) => {
    setStoryPanels(prev =>
      prev.map(p => p.id === id ? { ...p, sequence_order: newOrder } : p)
        .sort((a, b) => a.sequence_order - b.sequence_order)
    );
    const { error } = await supabase
      .from('story_panels')
      .update({ sequence_order: newOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showError('Failed to update order');
      await fetchStoryPanels();
    }
  };

  const handleTestimonialUpload = async () => {
    if (!newTestimonial?.file || !newTestimonial.clientName.trim() || !newTestimonial.contextLine.trim()) {
      showError('Please fill in all fields and select a video.');
      return;
    }

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(newTestimonial.file.type)) {
      showError('Invalid file type. Use MP4, MOV, or WebM.');
      return;
    }

    setUploadingTestimonial(true);
    try {
      const ext = newTestimonial.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('video-testimonials')
        .upload(fileName, newTestimonial.file, { cacheControl: '2592000', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('video-testimonials')
        .getPublicUrl(fileName);

      const nextOrder = testimonialPanels.length > 0
        ? Math.max(...testimonialPanels.map(p => p.sequence_order)) + 1
        : 1;

      const { error: dbError } = await supabase
        .from('testimonial_panels')
        .insert({
          video_url: publicUrl,
          client_name: newTestimonial.clientName.trim(),
          context_line: newTestimonial.contextLine.trim(),
          sequence_order: nextOrder,
        });
      if (dbError) throw dbError;

      setNewTestimonial(null);
      await fetchTestimonialPanels();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingTestimonial(false);
    }
  };

  const handleReplaceTestimonialVideo = async (panelId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      showError('Invalid file type. Use MP4, MOV, or WebM.');
      return;
    }

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('video-testimonials')
        .upload(fileName, file, { cacheControl: '2592000', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('video-testimonials')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('testimonial_panels')
        .update({ video_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', panelId);
      if (dbError) throw dbError;

      await fetchTestimonialPanels();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Replace failed');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase.from('testimonial_panels').delete().eq('id', id);
      if (error) throw error;
      setTestimonialPanels(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Delete failed');
    }
    setDeleteConfirm(null);
  };

  const handleTestimonialOrderChange = async (id: string, newOrder: number) => {
    setTestimonialPanels(prev =>
      prev.map(p => p.id === id ? { ...p, sequence_order: newOrder } : p)
        .sort((a, b) => a.sequence_order - b.sequence_order)
    );
    const { error } = await supabase
      .from('testimonial_panels')
      .update({ sequence_order: newOrder, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showError('Failed to update order');
      await fetchTestimonialPanels();
    }
  };

  const handleTestimonialFieldUpdate = async (id: string, field: 'client_name' | 'context_line', value: string) => {
    setTestimonialPanels(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
    const { error } = await supabase
      .from('testimonial_panels')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showError('Failed to update field');
      await fetchTestimonialPanels();
    }
  };

  return (
    <div className="space-y-10">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete panel?</h3>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'story') handleDeleteStory(deleteConfirm.id);
                  else handleDeleteTestimonial(deleteConfirm.id);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Story Panels */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Story Panels</h2>
          <p className="text-sm text-gray-500 mt-1">
            These appear in order between the VSL and the testimonials. Each image fills one full screen on /schedule.
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {storyPanels.length} panel{storyPanels.length !== 1 ? 's' : ''} in sequence.
        </p>

        {loadingStory ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {storyPanels.map((panel) => (
              <StoryPanelCard
                key={panel.id}
                panel={panel}
                onOrderChange={handleStoryOrderChange}
                onReplace={handleReplaceStoryImage}
                onDelete={() => setDeleteConfirm({ type: 'story', id: panel.id })}
              />
            ))}

            {/* Add Panel Card */}
            <div
              onClick={() => !uploadingStory && storyFileRef.current?.click()}
              className={`relative border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors ${uploadingStory ? 'opacity-50 pointer-events-none' : ''}`}
              style={{ aspectRatio: '9/16', minHeight: '220px' }}
            >
              {uploadingStory ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 font-medium">Add panel</span>
                </>
              )}
            </div>
          </div>
        )}

        <input
          ref={storyFileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleStoryImageUpload}
          className="hidden"
        />
      </section>

      {/* Section 2: Testimonial Panels */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Testimonial Panels</h2>
          <p className="text-sm text-gray-500 mt-1">
            These appear in order after the story. Each is a full-screen video on /schedule.
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {testimonialPanels.length} testimonial{testimonialPanels.length !== 1 ? 's' : ''} in sequence.
        </p>

        {loadingTestimonials ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testimonialPanels.map((panel) => (
              <TestimonialPanelCard
                key={panel.id}
                panel={panel}
                onOrderChange={handleTestimonialOrderChange}
                onFieldUpdate={handleTestimonialFieldUpdate}
                onReplace={handleReplaceTestimonialVideo}
                onDelete={() => setDeleteConfirm({ type: 'testimonial', id: panel.id })}
              />
            ))}

            {/* Add Testimonial Card */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              style={{ minHeight: '280px' }}
              onClick={() => !newTestimonial && setNewTestimonial({ clientName: '', contextLine: '', file: null })}
            >
              {!newTestimonial ? (
                <>
                  <Plus className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 font-medium">Add testimonial</span>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* New Testimonial Form */}
        {newTestimonial && (
          <div className="mt-4 border border-blue-200 bg-blue-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">New Testimonial</h3>
              <button onClick={() => setNewTestimonial(null)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={newTestimonial.clientName}
                  onChange={(e) => setNewTestimonial(prev => prev ? { ...prev, clientName: e.target.value } : null)}
                  placeholder="e.g. Sid"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Context Line *</label>
                <input
                  type="text"
                  value={newTestimonial.contextLine}
                  onChange={(e) => setNewTestimonial(prev => prev ? { ...prev, contextLine: e.target.value.slice(0, 80) } : null)}
                  placeholder="e.g. Tried everything before. Never stuck with any of it."
                  maxLength={80}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-400 mt-0.5">{newTestimonial.contextLine.length}/80</span>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Video File *</label>
              <input
                ref={testimonialFileRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewTestimonial(prev => prev ? { ...prev, file } : null);
                }}
                className="w-full text-sm text-gray-600"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTestimonialUpload}
                disabled={uploadingTestimonial || !newTestimonial.clientName.trim() || !newTestimonial.contextLine.trim() || !newTestimonial.file}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
              >
                {uploadingTestimonial ? 'Uploading...' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StoryPanelCard({
  panel,
  onOrderChange,
  onReplace,
  onDelete,
}: {
  panel: StoryPanel;
  onOrderChange: (id: string, newOrder: number) => void;
  onReplace: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}) {
  const replaceRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group">
      {/* Order badge */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="number"
          min={1}
          value={panel.sequence_order}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) onOrderChange(panel.id, val);
          }}
          className="w-10 h-7 text-center text-xs font-bold bg-black/70 text-white rounded-md border-0 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Image */}
      <div style={{ aspectRatio: '9/16' }} className="bg-gray-100">
        <img
          src={panel.image_url}
          alt={`Story panel ${panel.sequence_order}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 p-2 border-t border-gray-100">
        <button
          onClick={() => replaceRef.current?.click()}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Replace image"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Replace</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <input
        ref={replaceRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => onReplace(panel.id, e)}
        className="hidden"
      />
    </div>
  );
}

function TestimonialPanelCard({
  panel,
  onOrderChange,
  onFieldUpdate,
  onReplace,
  onDelete,
}: {
  panel: TestimonialPanel;
  onOrderChange: (id: string, newOrder: number) => void;
  onFieldUpdate: (id: string, field: 'client_name' | 'context_line', value: string) => void;
  onReplace: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}) {
  const replaceRef = useRef<HTMLInputElement>(null);
  const [localName, setLocalName] = useState(panel.client_name);
  const [localContext, setLocalContext] = useState(panel.context_line);

  useEffect(() => {
    setLocalName(panel.client_name);
    setLocalContext(panel.context_line);
  }, [panel.client_name, panel.context_line]);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Order badge */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="number"
          min={1}
          value={panel.sequence_order}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) onOrderChange(panel.id, val);
          }}
          className="w-10 h-7 text-center text-xs font-bold bg-black/70 text-white rounded-md border-0 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Video preview */}
      <div className="relative bg-gray-900" style={{ aspectRatio: '9/16', maxHeight: '200px' }}>
        <video
          src={panel.video_url}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Video className="w-8 h-8 text-white/70" />
        </div>
      </div>

      {/* Editable fields */}
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={() => {
            if (localName.trim() && localName !== panel.client_name) {
              onFieldUpdate(panel.id, 'client_name', localName.trim());
            }
          }}
          placeholder="Client name"
          className="w-full px-2 py-1.5 text-sm font-medium border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <input
          type="text"
          value={localContext}
          onChange={(e) => setLocalContext(e.target.value.slice(0, 80))}
          onBlur={() => {
            if (localContext.trim() && localContext !== panel.context_line) {
              onFieldUpdate(panel.id, 'context_line', localContext.trim());
            }
          }}
          placeholder="Context line"
          maxLength={80}
          className="w-full px-2 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 p-2 border-t border-gray-100">
        <button
          onClick={() => replaceRef.current?.click()}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Replace video"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Replace</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <input
        ref={replaceRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        onChange={(e) => onReplace(panel.id, e)}
        className="hidden"
      />
    </div>
  );
}
