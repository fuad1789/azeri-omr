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

interface Course {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  slug: string;
  features: string[];
  duration: string;
  students: string;
  displayOrder: number;
  isActive: boolean;
  fullDescription: string;
  lessons: number;
  hours: number;
  teacher: string;
  price: string;
  program: string[];
  requirements: string[];
  outcomes: string[];
  targetAudience: string;
  level: string;
  certificate: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function AdminCoursesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'BookOpen',
    color: 'blue',
    href: '',
    slug: '',
    features: '',
    duration: '9 ay',
    students: '0+',
    displayOrder: 0,
    isActive: true,
    fullDescription: '',
    lessons: 0,
    hours: 0,
    teacher: '',
    price: '',
    program: '',
    requirements: '',
    outcomes: '',
    targetAudience: '',
    level: 'Başlanğıc',
    certificate: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCourses();
    }
  }, [session]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses?admin=true');
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Kurslar alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        icon: course.icon,
        color: course.color,
        href: course.href,
        slug: course.slug || '',
        features: course.features.join(', '),
        duration: course.duration,
        students: course.students,
        displayOrder: course.displayOrder,
        isActive: course.isActive,
        fullDescription: course.fullDescription || '',
        lessons: course.lessons || 0,
        hours: course.hours || 0,
        teacher: course.teacher || '',
        price: course.price || '',
        program: course.program?.join(', ') || '',
        requirements: course.requirements?.join(', ') || '',
        outcomes: course.outcomes?.join(', ') || '',
        targetAudience: course.targetAudience || '',
        level: course.level || 'Başlanğıc',
        certificate: course.certificate || false,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        icon: 'BookOpen',
        color: 'blue',
        href: '',
        slug: '',
        features: '',
        duration: '9 ay',
        students: '0+',
        displayOrder: courses.length,
        isActive: true,
        fullDescription: '',
        lessons: 0,
        hours: 0,
        teacher: '',
        price: '',
        program: '',
        requirements: '',
        outcomes: '',
        targetAudience: '',
        level: 'Başlanğıc',
        certificate: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = formData.features.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    const programArray = formData.program.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    const requirementsArray = formData.requirements.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    const outcomesArray = formData.outcomes.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
    
    // Generate slug from title if not provided
    const slugValue = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    const courseData = { 
      ...formData, 
      features: featuresArray,
      program: programArray,
      requirements: requirementsArray,
      outcomes: outcomesArray,
      slug: slugValue,
    };

    if (editingCourse) {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCourse._id, ...courseData }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    } else {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kursu silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/courses?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchCourses();
    else alert(data.error || 'Xəta baş verdi');
  };

  const toggleActive = async (course: Course) => {
    const res = await fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: course._id, isActive: !course.isActive }),
    });
    const data = await res.json();
    if (data.success) fetchCourses();
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newCourses = [...courses];
    const temp = newCourses[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCourses.length) return;
    newCourses[index] = newCourses[targetIndex];
    newCourses[targetIndex] = temp;
    newCourses.forEach((course, i) => { course.displayOrder = i; });
    setCourses(newCourses);
    await Promise.all(newCourses.map((course) =>
      fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: course._id, displayOrder: course.displayOrder }),
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
                <h1 className="text-xl font-bold text-gray-900">Kursları İdarə Et</h1>
                <p className="text-xs text-gray-500">Kursları əlavə et, redaktə et, sil</p>
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
          <p className="text-gray-600">Cəmi <span className="font-semibold">{courses.length}</span> kurs</p>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Yeni Kurs
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Kurslar yüklənir...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Heç bir kurs tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rəng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map((course, index) => (
                    <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveOrder(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{index + 1}</span>
                          <button onClick={() => moveOrder(index, 'down')} disabled={index === courses.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500">{course.href}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${colorOptions.find((c) => c.value === course.color)?.class}`} />
                          <span className="text-sm text-gray-600 capitalize">{course.color}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(course)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {course.isActive ? (<><Eye className="w-4 h-4" />Aktiv</>) : (<><EyeOff className="w-4 h-4" />Qeyri-aktiv</>)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal(course)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(course._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              <h2 className="text-xl font-bold text-gray-900">{editingCourse ? 'Kursu Redaktə Et' : 'Yeni Kurs Əlavə Et'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kursun adı *</label>
                  <input type="text" value={formData.title} onChange={(e) => {
                    const newTitle = e.target.value;
                    const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    const newHref = `/kurslar/${newSlug}`;
                    setFormData({ ...formData, title: newTitle, slug: newSlug, href: newHref });
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Müəllim</label>
                  <input type="text" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL (Avtomatik)</label>
                <input type="text" value={formData.href} readOnly className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Təsvir *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
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
                    }[icon] || BookOpen;
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qiymət</label>
                  <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Müddət</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tələbə sayı</label>
                  <input type="text" value={formData.students} onChange={(e) => setFormData({ ...formData, students: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
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
                <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Xüsusiyyət 1, Xüsusiyyət 2, Xüsusiyyət 3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proqram (vergüllə ayırın)</label>
                <input type="text" value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} placeholder="Mövzu 1, Mövzu 2, Mövzu 3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tələblər (vergüllə ayırın)</label>
                <input type="text" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Tələb 1, Tələb 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nəticələr (vergüllə ayırın)</label>
                <input type="text" value={formData.outcomes} onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })} placeholder="Nəticə 1, Nəticə 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sıra nömrəsi</label>
                <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
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
                  {editingCourse ? 'Yadda Saxla' : 'Əlavə Et'}
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