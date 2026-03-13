'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ArrowLeft,
  LogOut,
  Settings,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  _id: string;
  vacancyId: string;
  name: string;
  surname: string;
  specialty: string;
  department: string;
  branch: string;
  birthDate: string;
  phone: string;
  email: string;
  cvUrl: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminApplicationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchApplications();
    }
  }, [session, filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all' 
        ? '/api/vacancy-applications' 
        : `/api/vacancy-applications?status=${filterStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Müraciətlər alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/vacancy-applications?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Status yenilənmədi:', error);
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/vacancy-applications?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notes[id] || '' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Qeydlər yadda saxlanıldı');
      }
    } catch (error) {
      console.error('Qeydlər yadda saxlanılmadı:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müraciəti silmək istədiyinizə əminsiniz?')) return;
    try {
      const res = await fetch(`/api/vacancy-applications?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Müraciət silinmədi:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3" />Gözləyir</span>;
      case 'reviewed':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"><Eye className="w-3 h-3" />Baxılıb</span>;
      case 'accepted':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Qəbul</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Rədd</span>;
      default:
        return null;
    }
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
                <h1 className="text-xl font-bold text-gray-900">Vakansiya Müraciətləri</h1>
                <p className="text-xs text-gray-500">Cəmi {applications.length} müraciət</p>
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Hamısı</option>
              <option value="pending">Gözləyir</option>
              <option value="reviewed">Baxılıb</option>
              <option value="accepted">Qəbul</option>
              <option value="rejected">Rədd</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Müraciətlər yüklənir...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Heç bir müraciət tapılmadı</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {applications.map((app) => (
                <div key={app._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.name} {app.surname}</p>
                        <p className="text-sm text-gray-500">{app.specialty} • {app.branch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status)}
                      <button
                        onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {expandedId === app._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {expandedId === app._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Doğum: {new Date(app.birthDate).toLocaleDateString('az-AZ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Şöbə: {app.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Filial: {app.branch}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            CV: {app.cvUrl ? <a href={app.cvUrl} target="_blank" className="text-indigo-600 hover:underline">Yüklə</a> : 'Yoxdur'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Qeydlər</label>
                        <textarea
                          value={notes[app._id] || app.notes || ''}
                          onChange={(e) => setNotes({ ...notes, [app._id]: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Müraciət haqqında qeydlərinizi yazın..."
                        />
                        <button
                          onClick={() => saveNotes(app._id)}
                          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Qeydləri Yadda Saxla
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          >
                            <option value="pending">Gözləyir</option>
                            <option value="reviewed">Baxılıb</option>
                            <option value="accepted">Qəbul</option>
                            <option value="rejected">Rədd</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            Tarix: {new Date(app.createdAt).toLocaleDateString('az-AZ')} {new Date(app.createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}