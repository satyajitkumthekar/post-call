import { useState, useEffect } from 'react';
import { Upload, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VideoTestimonial, TextTestimonial, MessageTestimonial } from '../lib/supabase';

type TabType = 'video' | 'text' | 'message';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([]);
  const [textTestimonials, setTextTestimonials] = useState<TextTestimonial[]>([]);
  const [messageTestimonials, setMessageTestimonials] = useState<MessageTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const [videos, texts, messages] = await Promise.all([
        supabase.from('video_testimonials').select('*').order('display_order'),
        supabase.from('text_testimonials').select('*').order('display_order'),
        supabase.from('message_testimonials').select('*').order('created_at'),
      ]);

      if (videos.data) setVideoTestimonials(videos.data);
      if (texts.data) setTextTestimonials(texts.data);
      if (messages.data) setMessageTestimonials(messages.data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
    setLoading(false);
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const toggleActive = async (
    id: string,
    table: string,
    currentState: boolean
  ) => {
    await supabase
      .from(table)
      .update({ is_active: !currentState })
      .eq('id', id);
    loadTestimonials();
  };

  const deleteTestimonial = async (id: string, table: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await supabase.from(table).delete().eq('id', id);
      loadTestimonials();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Testimonials Admin</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Video Testimonials
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Text Testimonials
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'message'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Messages
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'video' && (
              <VideoTestimonialsTab
                testimonials={videoTestimonials}
                onRefresh={loadTestimonials}
                onToggleActive={(id, state) =>
                  toggleActive(id, 'video_testimonials', state)
                }
                onDelete={(id) => deleteTestimonial(id, 'video_testimonials')}
                onUploadFile={uploadFile}
              />
            )}
            {activeTab === 'text' && (
              <TextTestimonialsTab
                testimonials={textTestimonials}
                onRefresh={loadTestimonials}
                onToggleActive={(id, state) =>
                  toggleActive(id, 'text_testimonials', state)
                }
                onDelete={(id) => deleteTestimonial(id, 'text_testimonials')}
              />
            )}
            {activeTab === 'message' && (
              <MessageTestimonialsTab
                testimonials={messageTestimonials}
                onRefresh={loadTestimonials}
                onToggleActive={(id, state) =>
                  toggleActive(id, 'message_testimonials', state)
                }
                onDelete={(id) => deleteTestimonial(id, 'message_testimonials')}
                onUploadFile={uploadFile}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function VideoTestimonialsTab({
  testimonials,
  onRefresh,
  onToggleActive,
  onDelete,
  onUploadFile,
}: {
  testimonials: VideoTestimonial[];
  onRefresh: () => void;
  onToggleActive: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
  onUploadFile: (file: File, bucket: string) => Promise<string | null>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    result: '',
    display_order: 0,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailFile) {
      alert('Please select a thumbnail image');
      return;
    }

    setUploading(true);

    const thumbnailUrl = await onUploadFile(thumbnailFile, 'testimonial-images');
    const videoUrl = videoFile
      ? await onUploadFile(videoFile, 'testimonial-videos')
      : null;

    if (!thumbnailUrl) {
      alert('Failed to upload thumbnail');
      setUploading(false);
      return;
    }

    await supabase.from('video_testimonials').insert({
      ...formData,
      thumbnail_url: thumbnailUrl,
      video_url: videoUrl,
    });

    setFormData({ name: '', role: '', result: '', display_order: 0 });
    setThumbnailFile(null);
    setVideoFile(null);
    setShowForm(false);
    setUploading(false);
    onRefresh();
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        {showForm ? 'Cancel' : 'Add Video Testimonial'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Result</label>
            <input
              type="text"
              required
              value={formData.result}
              onChange={(e) =>
                setFormData({ ...formData, result: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Thumbnail Image (Required)
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Video File (Optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Add Testimonial
              </>
            )}
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
          >
            <img
              src={testimonial.thumbnail_url}
              alt={testimonial.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{testimonial.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{testimonial.role}</p>
              <p className="text-blue-400 text-sm mb-4">{testimonial.result}</p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onToggleActive(testimonial.id, testimonial.is_active)
                  }
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    testimonial.is_active
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {testimonial.is_active ? (
                    <Eye className="w-4 h-4 mx-auto" />
                  ) : (
                    <EyeOff className="w-4 h-4 mx-auto" />
                  )}
                </button>
                <button
                  onClick={() => onDelete(testimonial.id)}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextTestimonialsTab({
  testimonials,
  onRefresh,
  onToggleActive,
  onDelete,
}: {
  testimonials: TextTestimonial[];
  onRefresh: () => void;
  onToggleActive: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    text: '',
    rating: 5,
    display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from('text_testimonials').insert(formData);

    setFormData({ author: '', title: '', text: '', rating: 5, display_order: 0 });
    setShowForm(false);
    onRefresh();
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        {showForm ? 'Cancel' : 'Add Text Testimonial'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title/Role</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Testimonial</label>
            <textarea
              required
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Testimonial
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-1">{testimonial.author}</h3>
              <p className="text-gray-400 text-sm mb-3">{testimonial.title}</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                "{testimonial.text}"
              </p>
              <p className="text-blue-400 text-sm">
                Rating: {testimonial.rating}/5
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onToggleActive(testimonial.id, testimonial.is_active)
                }
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  testimonial.is_active
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {testimonial.is_active ? (
                  <Eye className="w-4 h-4 mx-auto" />
                ) : (
                  <EyeOff className="w-4 h-4 mx-auto" />
                )}
              </button>
              <button
                onClick={() => onDelete(testimonial.id)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageTestimonialsTab({
  testimonials,
  onRefresh,
  onToggleActive,
  onDelete,
  onUploadFile,
}: {
  testimonials: MessageTestimonial[];
  onRefresh: () => void;
  onToggleActive: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
  onUploadFile: (file: File, bucket: string) => Promise<string | null>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    name: '',
  });
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);

    const screenshotUrl = screenshotFile
      ? await onUploadFile(screenshotFile, 'testimonial-images')
      : null;

    await supabase.from('message_testimonials').insert({
      ...formData,
      screenshot_url: screenshotUrl,
    });

    setFormData({ text: '', name: '' });
    setScreenshotFile(null);
    setShowForm(false);
    setUploading(false);
    onRefresh();
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        {showForm ? 'Cancel' : 'Add Message'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Message Text</label>
            <input
              type="text"
              required
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Screenshot (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Message
              </>
            )}
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-900 rounded-lg p-4 border border-gray-800"
          >
            {testimonial.screenshot_url && (
              <img
                src={testimonial.screenshot_url}
                alt={testimonial.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <p className="text-white text-sm mb-2">"{testimonial.text}"</p>
            <p className="text-gray-400 text-xs mb-3">— {testimonial.name}</p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onToggleActive(testimonial.id, testimonial.is_active)
                }
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  testimonial.is_active
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {testimonial.is_active ? (
                  <Eye className="w-4 h-4 mx-auto" />
                ) : (
                  <EyeOff className="w-4 h-4 mx-auto" />
                )}
              </button>
              <button
                onClick={() => onDelete(testimonial.id)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
