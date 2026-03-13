'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Search,
  Plus,
  Trash2,
  Database,
  Calendar,
  Users,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface StudentResult {
  ad: string
  soyad: string
  ataAdi: string
  isNomresi: string
  mekteb: string
  sinif: string
  sinfinAdi: string
  dil: string
  variant: string
  bolme: string
  cins: string
  qrup: string
  fullAnswerString: string
  totalNetScore: number
  rank?: number
}

interface Exam {
  _id: string
  examName: string
  examDate: string
  examType: 'standard' | 'buraxilis'
  totalStudents: number
  validStudents: number
  students: StudentResult[]
  classes: string[]
  variants: string[]
  groups: string[]
  savedAt: string
}

export default function ExamsPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const examsPerPage = 10

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    } else if (sessionStatus === 'authenticated') {
      fetchExams()
    }
  }, [sessionStatus, router])

  const fetchExams = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/exams')
      const data = await res.json()
      
      if (data.success) {
        setExams(data.data)
      } else {
        setError(data.error || 'Məlumatlar yüklənərkən xəta baş verdi')
      }
    } catch (err) {
      setError('Server xətası baş verdi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu imtahanı silmək istədiyinizə əminsiniz?')) return
    
    try {
      setDeletingId(id)
      const res = await fetch(`/api/exams?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await res.json()
      if (data.success) {
        setSuccessMessage('İmtahan uğurla silindi')
        fetchExams()
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err) {
      setError('Silinərkən xəta baş verdi')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || exam.examType === typeFilter
    return matchesSearch && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / examsPerPage)
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * examsPerPage,
    currentPage * examsPerPage
  )

  const stats = {
    total: exams.length,
    standard: exams.filter(e => e.examType === 'standard').length,
    buraxilis: exams.filter(e => e.examType === 'buraxilis').length,
    totalStudents: exams.reduce((acc, e) => acc + e.validStudents, 0)
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Database className="w-4 h-4 text-purple-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">İmtahanlar</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/omr"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni İmtahan
              </Link>
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || ''}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Cəmi İmtahan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.standard}</p>
                <p className="text-xs text-gray-500">Fənn İmtahanı</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.buraxilis}</p>
                <p className="text-xs text-gray-500">Buraxılış</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
                <p className="text-xs text-gray-500">Şagird</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="İmtahan adı axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Bütün növlər</option>
              <option value="standard">Fənn İmtahanı</option>
              <option value="buraxilis">Buraxılış İmtahanı</option>
            </select>
            <button
              onClick={fetchExams}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">İmtahan Adı</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tarix</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Növ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Şagirdlər</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Siniflər</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedExams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>İmtahan tapılmadı</p>
                    </td>
                  </tr>
                ) : (
                  paginatedExams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{exam.examName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(exam.examDate).toLocaleDateString('az-AZ')}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exam.examType === 'standard'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {exam.examType === 'standard' ? 'Fənn' : 'Buraxılış'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-gray-400" />
                          {exam.validStudents} / {exam.totalStudents}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {exam.classes.slice(0, 3).map((cls) => (
                            <span key={cls} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {cls}
                            </span>
                          ))}
                          {exam.classes.length > 3 && (
                            <span className="px-2 py-0.5 text-gray-400 text-xs">
                              +{exam.classes.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(exam.savedAt).toLocaleDateString('az-AZ')}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDelete(exam._id)}
                          disabled={deletingId === exam._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          {deletingId === exam._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {((currentPage - 1) * examsPerPage) + 1}-{Math.min(currentPage * examsPerPage, filteredExams.length)} / {filteredExams.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Səhifə {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}