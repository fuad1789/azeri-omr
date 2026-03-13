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
  BookOpen,
  Target,
  GraduationCap,
  Zap,
  Globe,
  Users,
  Award,
  Book,
  PenTool,
  Lightbulb,
  Rocket,
  Star,
  CheckCircle,
  TrendingUp,
  Shield,
  Brain,
  Layers,
  FileText,
  Calculator,
  Microscope,
  History,
  Music,
  Palette,
  Dumbbell,
  Code,
  Atom,
  Languages,
} from 'lucide-react';
import Link from 'next/link';

interface ExamTopic {
  _id: string;
  category: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  students: number;
  displayOrder: number;
  isActive: boolean;
  slug: string;
  icon: string;
  color: string;
  fullDescription: string;
  teacher: string;
  price: string;
  program: string[];
  requirements: string[];
  outcomes: string[];
  targetAudience: string;
  level: string;
  certificate: boolean;
  hours: number;
  features: string[];
}

const categories = ['Riyaziyyat', 'Azərbaycan dili', 'Tarix', 'Xarici dil', 'Fizika', 'Kimya', 'Biologiya', 'Ədəbiyyat', 'Coğrafiya', 'İnformatika'];

const iconOptions = [
  'BookOpen', 'Target', 'GraduationCap', 'Zap', 'Globe', 'Users',
  'Award', 'Book', 'PenTool', 'Lightbulb', 'Rocket', 'Star',
  'CheckCircle', 'TrendingUp', 'Shield', 'Brain', 'Layers', 'FileText',
  'Calculator', 'Microscope', 'History', 'Music', 'Palette', 'Dumbbell',
  'Code', 'Atom', 'Languages',
];

const colorOptions = [
  { value: 'blue', class: 'bg-blue-500' },
  { value: 'green', class: 'bg-green-500' },
  { value: 'red', class: 'bg-red-500' },
  { value: 'yellow', class: 'bg-yellow-500' },
  { value: 'pink', class: 'bg-pink-500' },
  { value: 'purple', class: 'bg-purple-500' },
  { value: 'orange', class: 'bg-orange-500' },
  { value: 'indigo', class: 'bg-indigo-500' },
  { value: 'teal', class: 'bg-teal-500' },
  { value: 'cyan', class: 'bg-cyan-500' },
];

export default function AdminExamTopicsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<ExamTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ExamTopic | null>(null);
  const [formData, setFormData] = useState({
    category: 'Riyaziyyat',
    title: '',
    description: '',
    slug: '',
    icon: 'Book',
    color: 'red',
    lessons: 0,
    hours: 0,
    duration: '0 saat',
    students: 0,
    displayOrder: 0,
    isActive: true,
    fullDescription: '',
    teacher: '',
    price: '',
    program: '',
    requirements: '',
    outcomes: '',
    targetAudience: '',
    level: 'Başlanğıc',
    certificate: false,
    features: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTopics();
    }
  }, [session]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/exam-topics?admin=true');
      const data = await res.json();
      if (data.success) {
        setTopics(data.data);
      }
    } catch (error) {
      console.error('Mövzular alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (topic?: ExamTopic) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        category: topic.category,
        title: topic.title,
        description: topic.description,
        slug: topic.slug || '',
        icon: topic.icon || 'Book',
        color: topic.color || 'red',
        lessons: topic.lessons || 0,
        hours: topic.hours || 0,
        duration: topic.duration,
        students: topic.students || 0,
        displayOrder: topic.displayOrder,
        isActive: topic.isActive,
        fullDescription: topic.fullDescription || '',
        teacher: topic.teacher || '',
        price: topic.price || '',
        program: topic.program?.join(', ') || '',
        requirements: topic.requirements?.join(', ') || '',
        outcomes: topic.outcomes?.join(', ') || '',
        targetAudience: topic.targetAudience || '',
        level: topic.level || 'Başlanğıc',
        certificate: topic.certificate || false,
        features: topic.features?.join(', ') || '',
      });
    } else {
      setEditingTopic(null);
      setFormData({
        category: 'Riyaziyyat',
        title: '',
        description: '',
        slug: '',
        icon: 'Book',
        color: 'red',
        lessons: 0,
        hours: 0,
        duration: '0 saat',
        students: 0,
        displayOrder: topics.length,
        isActive: true,
        fullDescription: '',
        teacher: '',
        price: '',
        program: '',
        requirements: '',
        outcomes: '',
        targetAudience: '',
        level: 'Başlanğıc',
        certificate: false,
        features: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTopic(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = formData.features.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    const programArray = formData.program.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    const requirementsArray = formData.requirements.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    const outcomesArray = formData.outcomes.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    
    // Generate slug from title if not provided
    const slugValue = formData.slug || `${formData.category.toLowerCase()}-${formData.title.toLowerCase()}`.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    const topicData = { 
      ...formData, 
      features: featuresArray,
      program: programArray,
      requirements: requirementsArray,
      outcomes: outcomesArray,
      slug: slugValue,
    };

    if (editingTopic) {
      const res = await fetch('/api/exam-topics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTopic._id, ...topicData }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTopics();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    } else {
      const res = await fetch('/api/exam-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topicData),
      });
      const data = await res.json();
      if (data.success) {
        fetchTopics();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mövzunu silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/exam-topics?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchTopics();
    else alert(data.error || 'Xəta baş verdi');
  };

  const toggleActive = async (topic: ExamTopic) => {
    const res = await fetch('/api/exam-topics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: topic._id, isActive: !topic.isActive }),
    });
    const data = await res.json();
    if (data.success) fetchTopics();
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newTopics = [...topics];
    const temp = newTopics[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTopics.length) return;
    newTopics[index] = newTopics[targetIndex];
    newTopics[targetIndex] = temp;
    newTopics.forEach((topic, i) => { topic.displayOrder = i; });
    setTopics(newTopics);
    await Promise.all(newTopics.map((topic) =>
      fetch('/api/exam-topics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: topic._id, displayOrder: topic.displayOrder }),
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
                <h1 className="text-xl font-bold text-gray-900">İmtahan Mövzularını İdarə Et</h1>
                <p className="text-xs text-gray-500">Mövzuları əlavə et, redaktə et, sil</p>
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
          <p className="text-gray-600">Cəmi <span className="font-semibold">{topics.length}</span> mövzu</p>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Yeni Mövzu
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Mövzular yüklənir...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Heç bir mövzu tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kateqoriya</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mövzu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dərs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müddət</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topics.map((topic, index) => (
                    <tr key={topic._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveOrder(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{index + 1}</span>
                          <button onClick={() => moveOrder(index, 'down')} disabled={index === topics.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {topic.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{topic.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{topic.description}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{topic.lessons}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{topic.duration}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(topic)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${topic.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {topic.isActive ? (<><Eye className="w-4 h-4" />Aktiv</>) : (<><EyeOff className="w-4 h-4" />Qeyri-aktiv</>)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal(topic)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(topic._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50">
              <h2 className="text-xl font-bold text-gray-900">{editingTopic ? 'Mövzunu Redaktə Et' : 'Yeni Mövzu Əlavə Et'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya *</label>
                  <select value={formData.category} onChange={(e) => {
                    const newCategory = e.target.value;
                    const newSlug = formData.slug || `${newCategory.toLowerCase()}-${formData.title.toLowerCase()}`.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setFormData({ ...formData, category: newCategory, slug: newSlug });
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mövzu adı *</label>
                  <input type="text" value={formData.title} onChange={(e) => {
                    const newTitle = e.target.value;
                    const newSlug = formData.slug || `${formData.category.toLowerCase()}-${newTitle.toLowerCase()}`.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setFormData({ ...formData, title: newTitle, slug: newSlug });
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL (Avtomatik)</label>
                <input type="text" value={`/imtahan-movzulari/${formData.slug}`} readOnly className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qısa Təsvir *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon seçin</label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                  {iconOptions.map((icon) => {
                    const IconComponent = {
                      BookOpen, Target, GraduationCap, Zap, Globe, Users,
                      Award, Book, PenTool, Lightbulb, Rocket, Star,
                      CheckCircle, TrendingUp, Shield, Brain, Layers, FileText,
                      Calculator, Microscope, History, Music, Palette, Dumbbell,
                      Code, Atom, Languages,
                    }[icon] || Book;
                    const isSelected = formData.icon === icon;
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md scale-110'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                        title={icon}
                      >
                        <IconComponent size={20} />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Seçilmiş ikon: {formData.icon}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rəng seçin</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => {
                    const isSelected = formData.color === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        className={`w-10 h-10 rounded-full ${c.class} transition-all ${
                          isSelected
                            ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                        title={c.value}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Seçilmiş rəng: {formData.color}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ətraflı Təsvir</label>
                <textarea value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dərs sayı</label>
                  <input type="number" value={formData.lessons} onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saat sayı</label>
                  <input type="number" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Müddət</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="12 saat" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Müəllim</label>
                  <input type="text" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qiymət</label>
                  <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Səviyyə</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="Başlanğıc">Başlanğıc</option>
                    <option value="Orta">Orta</option>
                    <option value="İrəli">İrəli</option>
                    <option value="Hər səviyyə">Hər səviyyə</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hədəf Kütlə</label>
                  <input type="text" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xüsusiyyətlər (vergüllə ayırın)</label>
                <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Xüsusiyyət 1, Xüsusiyyət 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proqram (vergüllə ayırın)</label>
                <input type="text" value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} placeholder="Mövzu 1, Mövzu 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tələblər (vergüllə ayırın)</label>
                <input type="text" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Tələb 1, Tələb 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nəticələr (vergüllə ayırın)</label>
                <input type="text" value={formData.outcomes} onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })} placeholder="Nəticə 1, Nəticə 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-indigo-600" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktiv</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="certificate" checked={formData.certificate} onChange={(e) => setFormData({ ...formData, certificate: e.target.checked })} className="w-4 h-4 text-indigo-600" />
                  <label htmlFor="certificate" className="text-sm font-medium text-gray-700">Sertifikat verilir</label>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingTopic ? 'Yadda Saxla' : 'Əlavə Et'}
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