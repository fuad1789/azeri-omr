'use client'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import {
  FileText,
  CheckCircle,
  Database,
  ArrowRight,
  LogOut,
  User,
  BarChart3,
  Settings,
  BookOpen,
  Book,
  Briefcase,
  Newspaper,
  Award,
  ClipboardList,
  MapPin,
  Upload
} from 'lucide-react'
import Link from 'next/link'

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

function DashboardCard({ title, description, icon, href, color }: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`} />
      
      <div className="relative">
        <div className={`w-14 h-14 rounded-xl ${color} bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-6">
          {description}
        </p>
        
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
          Keçid et
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">İdarəetmə Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || ''}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                />
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Xoş gəlmisiniz, {session?.user?.name || 'İstifadəçi'}!
          </h2>
          <p className="text-gray-500">
            İdarəetmə panelinə daxil oldunuz. İstədiyiniz bölməni seçin.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="OMR Dashboard"
            description="İmtahan vərəqələrinin OMR analizi və nəticələrin emalı"
            icon={<FileText className="w-6 h-6 text-indigo-600" />}
            href="/admin/omr"
            color="bg-indigo-600"
          />

          <DashboardCard
            title="Hazır nəticə yüklə"
            description="Xaricdə yoxlanılmış TSV faylını sistemə əlavə edin"
            icon={<Upload className="w-6 h-6 text-fuchsia-600" />}
            href="/admin/results-import"
            color="bg-fuchsia-600"
          />
          
          <DashboardCard
            title="İmtahan Qeydiyyatları"
            description="Sınaq imtahanlarına qeydiyyatları idarə edin"
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            href="/admin/registrations"
            color="bg-green-600"
          />
          
          <DashboardCard
            title="İmtahanlar"
            description="İmtahan bazasını idarə edin, yeni imtahanlar əlavə edin"
            icon={<Database className="w-6 h-6 text-purple-600" />}
            href="/admin/exams"
            color="bg-purple-600"
          />

          <DashboardCard
            title="Nəticələr"
            description="İmtahan nəticələrini təhlil edin və hesabatlar alın"
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
            href="/admin/results"
            color="bg-blue-600"
          />

          <DashboardCard
            title="Kurslar"
            description="Kursları idarə edin, yeni kurslar əlavə edin"
            icon={<BookOpen className="w-6 h-6 text-orange-600" />}
            href="/admin/courses"
            color="bg-orange-600"
          />

          <DashboardCard
            title="İmtahan Mövzuları"
            description="İmtahan mövzularını idarə edin, yeni mövzular əlavə edin"
            icon={<Book className="w-6 h-6 text-teal-600" />}
            href="/admin/exam-topics"
            color="bg-teal-600"
          />

          <DashboardCard
            title="Vakansiya Müraciətləri"
            description="Vakansiya müraciətlərini izləyin və idarə edin"
            icon={<ClipboardList className="w-6 h-6 text-green-600" />}
            href="/admin/applications"
            color="bg-green-600"
          />

          <DashboardCard
            title="Vakansiyalar"
            description="Vakansiyaları idarə edin, yeni vakansiyalar əlavə edin"
            icon={<Briefcase className="w-6 h-6 text-red-600" />}
            href="/admin/vacancies"
            color="bg-red-600"
          />

          <DashboardCard
            title="Xəbərlər"
            description="Xəbərləri idarə edin, yeni xəbərlər əlavə edin"
            icon={<Newspaper className="w-6 h-6 text-yellow-600" />}
            href="/admin/news"
            color="bg-yellow-600"
          />

          <DashboardCard
            title="Fəxrlərimiz"
            description="Uğur hekayələrini idarə edin, yeni hekayələr əlavə edin"
            icon={<Award className="w-6 h-6 text-pink-600" />}
            href="/admin/success-stories"
            color="bg-pink-600"
          />

          <DashboardCard
            title="Filiallar"
            description="Filialları idarə edin, yeni filiallar əlavə edin"
            icon={<MapPin className="w-6 h-6 text-cyan-600" />}
            href="/admin/branches"
            color="bg-cyan-600"
          />
        </div>

      </main>
    </div>
  )
}