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
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminBranchesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    mapUrl: '',
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
      fetchBranches();
    }
  }, [session]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/branches?admin=true');
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error('Filiallar alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        mapUrl: branch.mapUrl,
        displayOrder: branch.displayOrder,
        isActive: branch.isActive,
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        mapUrl: '',
        displayOrder: branches.length,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBranch) {
      const res = await fetch(`/api/branches?id=${editingBranch._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchBranches();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    } else {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchBranches();
        closeModal();
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu filialı silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/branches?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchBranches();
    else alert(data.error || 'Xəta baş verdi');
  };

  const toggleActive = async (branch: Branch) => {
    const res = await fetch(`/api/branches?id=${branch._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !branch.isActive }),
    });
    const data = await res.json();
    if (data.success) fetchBranches();
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newBranches = [...branches];
    const temp = newBranches[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBranches.length) return;
    newBranches[index] = newBranches[targetIndex];
    newBranches[targetIndex] = temp;
    newBranches.forEach((branch, i) => { branch.displayOrder = i; });
    setBranches(newBranches);
    await Promise.all(newBranches.map((branch) =>
      fetch(`/api/branches?id=${branch._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayOrder: branch.displayOrder }),
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
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Filialları İdarə Et</h1>
                <p className="text-xs text-gray-500">Filialları əlavə et, redaktə et, sil</p>
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
          <p className="text-gray-600">Cəmi <span className="font-semibold">{branches.length}</span> filial</p>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Yeni Filial
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Filiallar yüklənir...</p>
            </div>
          ) : branches.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Heç bir filial tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filial</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əlaqə</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {branches.map((branch, index) => (
                    <tr key={branch._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveOrder(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{index + 1}</span>
                          <button onClick={() => moveOrder(index, 'down')} disabled={index === branches.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{branch.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{branch.address}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {branch.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{branch.phone}</span>
                            </div>
                          )}
                          {branch.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span>{branch.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(branch)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${branch.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {branch.isActive ? (<><Eye className="w-4 h-4" />Aktiv</>) : (<><EyeOff className="w-4 h-4" />Qeyri-aktiv</>)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal(branch)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(branch._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              <h2 className="text-xl font-bold text-gray-900">{editingBranch ? 'Filialı Redaktə Et' : 'Yeni Filial Əlavə Et'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filial adı *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                <input type="text" value={formData.mapUrl} onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                <p className="text-xs text-gray-500 mt-1">Google Maps-dən "Share" → "Embed a map" seçərək URL-i kopyalayın</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-indigo-600" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktiv</label>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingBranch ? 'Yadda Saxla' : 'Əlavə Et'}
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