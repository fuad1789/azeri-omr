'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  LogOut,
  Settings,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  Award,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

interface SuccessStory {
  _id: string;
  name: string;
  university: string;
  faculty: string;
  score: number;
  year: number;
  department: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSuccessStoriesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    faculty: '',
    score: 0,
    year: new Date().getFullYear(),
    department: '',
    image: '',
    displayOrder: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStories();
    }
  }, [session]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/success-stories?admin=true');
      const data = await res.json();
      if (data.success) {
        setStories(data.data);
      }
    } catch (error) {
      console.error('Uğur hekayələri alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (story?: SuccessStory) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        name: story.name,
        university: story.university,
        faculty: story.faculty,
        score: story.score,
        year: story.year,
        department: story.department,
        image: story.image,
        displayOrder: story.displayOrder,
        isActive: story.isActive,
      });
      if (story.image) {
        setImagePreview(story.image);
      }
    } else {
      setEditingStory(null);
      setFormData({
        name: '',
        university: '',
        faculty: '',
        score: 0,
        year: new Date().getFullYear(),
        department: '',
        image: '',
        displayOrder: stories.length,
        isActive: true,
      });
      setImageFile(null);
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStory(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;
    
    const formDataImg = new FormData();
    formDataImg.append('file', imageFile);
    formDataImg.append('upload_preset', 'success_stories_images');
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formDataImg,
    });
    const data = await res.json();
    if (data.success) {
      return data.path;
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imagePath = formData.image;
    if (imageFile) {
      imagePath = await uploadImage();
    }
    
    const storyData = { ...formData, image: imagePath };

    if (editingStory) {
      const res = await fetch('/api/success-stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingStory._id, ...storyData }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStories();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    } else {
      const res = await fetch('/api/success-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData),
      });
      const data = await res.json();
      if (data.success) {
        fetchStories();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu uğur hekayəsini silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/success-stories?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchStories();
    else alert(data.error || 'Xəta baş verdi');
  };

  const toggleActive = async (story: SuccessStory) => {
    const res = await fetch('/api/success-stories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: story._id, isActive: !story.isActive }),
    });
    const data = await res.json();
    if (data.success) fetchStories();
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newStories = [...stories];
    const temp = newStories[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStories.length) return;
    newStories[index] = newStories[targetIndex];
    newStories[targetIndex] = temp;
    newStories.forEach((item, i) => { item.displayOrder = i; });
    setStories(newStories);
    await Promise.all(newStories.map((item) =>
      fetch('/api/success-stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, displayOrder: item.displayOrder }),
      })
    ));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Geri</span>
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fəxrlərimizi İdarə Et</h1>
                <p className="text-xs text-gray-500">Uğur hekayələrini əlavə et, redaktə et, sil</p>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Çıxış
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Cəmi <span className="font-semibold">{stories.length}</span> uğur hekayəsi</p>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Yeni Uğur Hekayəsi
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Uğur hekayələri yüklənir...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Heç bir uğur hekayəsi tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tələbə</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Universitet</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İl</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stories.map((story, index) => (
                    <tr key={story._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveOrder(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{index + 1}</span>
                          <button onClick={() => moveOrder(index, 'down')} disabled={index === stories.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{story.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-600">{story.university}</p>
                          {story.faculty && <p className="text-xs text-gray-400">{story.faculty}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-indigo-600">{story.score}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{story.year}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(story)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${story.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {story.isActive ? (<><Eye className="w-4 h-4" />Aktiv</>) : (<><EyeOff className="w-4 h-4" />Qeyri-aktiv</>)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal(story)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(story._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingStory ? 'Uğur Hekayəsini Redaktə Et' : 'Yeni Uğur Hekayəsi Əlavə Et'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İl *</label>
                  <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Universitet *</label>
                <input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fakültə</label>
                  <input type="text" value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şöbə</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="">Seçin</option>
                    <option value="Riyaziyyat">Riyaziyyat</option>
                    <option value="Fizika">Fizika</option>
                    <option value="Kimya">Kimya</option>
                    <option value="Biologiya">Biologiya</option>
                    <option value="Azərbaycan dili">Azərbaycan dili</option>
                    <option value="İngilis dili">İngilis dili</option>
                    <option value="Tarix">Tarix</option>
                    <option value="Coğrafiya">Coğrafiya</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bal *</label>
                <input type="number" value={formData.score} onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil (opsional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setImageFile(null); }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Şəkil seçin və ya bura sürüşdürün</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Şəkil Yüklə
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sıra nömrəsi</label>
                <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-indigo-600" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktiv</label>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingStory ? 'Yadda Saxla' : 'Əlavə Et'}
                </button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Ləğv
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}