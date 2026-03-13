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
} from 'lucide-react';
import Link from 'next/link';

interface Vacancy {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  department: string;
  branch: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminVacanciesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    department: '',
    branch: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchVacancies();
    }
  }, [session]);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vacancies?admin=true');
      const data = await res.json();
      if (data.success) {
        setVacancies(data.data);
      }
    } catch (error) {
      console.error('Vakansiyalar alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (vacancy?: Vacancy) => {
    if (vacancy) {
      setEditingVacancy(vacancy);
      setFormData({
        title: vacancy.title,
        description: vacancy.description,
        requirements: vacancy.requirements.join(', '),
        department: vacancy.department,
        branch: vacancy.branch,
        displayOrder: vacancy.displayOrder,
        isActive: vacancy.isActive,
      });
    } else {
      setEditingVacancy(null);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        department: '',
        branch: '',
        displayOrder: vacancies.length,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVacancy(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requirementsArray = formData.requirements.split(',').map((r) => r.trim()).filter((r) => r.length > 0);
    
    const vacancyData = { 
      ...formData, 
      requirements: requirementsArray,
    };

    if (editingVacancy) {
      const res = await fetch('/api/vacancies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingVacancy._id, ...vacancyData }),
      });
      const data = await res.json();
      if (data.success) {
        fetchVacancies();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    } else {
      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacancyData),
      });
      const data = await res.json();
      if (data.success) {
        fetchVacancies();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu vakansiyanı silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/vacancies?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchVacancies();
    else alert(data.error || 'Xəta baş verdi');
  };

  const toggleActive = async (vacancy: Vacancy) => {
    const res = await fetch('/api/vacancies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vacancy._id, isActive: !vacancy.isActive }),
    });
    const data = await res.json();
    if (data.success) fetchVacancies();
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newVacancies = [...vacancies];
    const temp = newVacancies[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newVacancies.length) return;
    newVacancies[index] = newVacancies[targetIndex];
    newVacancies[targetIndex] = temp;
    newVacancies.forEach((vacancy, i) => { vacancy.displayOrder = i; });
    setVacancies(newVacancies);
    await Promise.all(newVacancies.map((vacancy) =>
      fetch('/api/vacancies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vacancy._id, displayOrder: vacancy.displayOrder }),
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
                <h1 className="text-xl font-bold text-gray-900">Vakansiyaları İdarə Et</h1>
                <p className="text-xs text-gray-500">Vakansiyaları əlavə et, redaktə et, sil</p>
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
          <p className="text-gray-600">Cəmi <span className="font-semibold">{vacancies.length}</span> vakansiya</p>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Yeni Vakansiya
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Vakansiyalar yüklənir...</p>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Heç bir vakansiya tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vakansiya</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Şöbə</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filial</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vacancies.map((vacancy, index) => (
                    <tr key={vacancy._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveOrder(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{index + 1}</span>
                          <button onClick={() => moveOrder(index, 'down')} disabled={index === vacancies.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{vacancy.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{vacancy.department}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{vacancy.branch}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(vacancy)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${vacancy.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {vacancy.isActive ? (<><Eye className="w-4 h-4" />Aktiv</>) : (<><EyeOff className="w-4 h-4" />Qeyri-aktiv</>)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal(vacancy)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(vacancy._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              <h2 className="text-xl font-bold text-gray-900">{editingVacancy ? 'Vakansiyanı Redaktə Et' : 'Yeni Vakansiya Əlavə Et'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vakansiyanın adı *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Təsvir *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şöbə *</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required>
                    <option value="">Şöbə seçin</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filial *</label>
                  <select value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required>
                    <option value="">Filial seçin</option>
                    <option value="Sumqayıt">Sumqayıt</option>
                    <option value="Bakı">Bakı</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tələblər (vergüllə ayırın)</label>
                <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Tələb 1, Tələb 2, Tələb 3" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
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
                  {editingVacancy ? 'Yadda Saxla' : 'Əlavə Et'}
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