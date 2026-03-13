'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Target,
  User,
  TrendingUp,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

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
}

const colorClasses: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-yellow-600',
  pink: 'from-pink-500 to-pink-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  indigo: 'from-indigo-500 to-indigo-600',
  teal: 'from-teal-500 to-teal-600',
  cyan: 'from-cyan-500 to-cyan-600',
};

const bgLightClasses: Record<string, string> = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  red: 'bg-red-50',
  yellow: 'bg-yellow-50',
  pink: 'bg-pink-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  indigo: 'bg-indigo-50',
  teal: 'bg-teal-50',
  cyan: 'bg-cyan-50',
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchCourse();
    }
  }, [params.slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses?admin=true`);
      const data = await res.json();
      if (data.success) {
        const foundCourse = data.data.find((c: Course) => c.slug === params.slug);
        if (foundCourse) {
          setCourse(foundCourse);
        }
      }
    } catch (error) {
      console.error('Kurs alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Kurs yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kurs tapılmadı</h1>
          <p className="text-gray-600 mb-4">Axtardığınız kurs mövcud deyil</p>
          <Link href="/kurslar" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Kurslara qayıt
          </Link>
        </div>
      </div>
    );
  }

  const gradientClass = colorClasses[course.color] || 'from-blue-500 to-blue-600';
  const bgLightClass = bgLightClasses[course.color] || 'bg-blue-50';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/kurslar" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kurslara qayıt</span>
            </Link>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl bg-gradient-to-br ${gradientClass} p-8 mb-8 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-white/90 text-lg mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4">
                {course.lessons > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.lessons} dərs</span>
                  </div>
                )}
                {course.hours > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5" />
                    <span>{course.hours} saat</span>
                  </div>
                )}
                {course.students && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <Users className="w-5 h-5" />
                    <span>{course.students} tələbə</span>
                  </div>
                )}
                {course.certificate && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                    <span>Sertifikat verilir</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ətraflı Təsvir */}
            {course.fullDescription && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Ətraflı Təsvir
                </h2>
                <p className="text-gray-600 whitespace-pre-line">{course.fullDescription}</p>
              </div>
            )}

            {/* Proqram */}
            {course.program && course.program.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Kurs Proqramı
                </h2>
                <ul className="space-y-3">
                  {course.program.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nəticələr */}
            {course.outcomes && course.outcomes.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Kursu Bitirənlər Əldə Edəcək
                </h2>
                <ul className="space-y-3">
                  {course.outcomes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tələblər */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Tələblər
                </h2>
                <ul className="space-y-3">
                  {course.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Kurs Məlumatları */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kurs Məlumatları</h3>
              <div className="space-y-4">
                {course.teacher && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Müəllim</p>
                      <p className="font-medium text-gray-900">{course.teacher}</p>
                    </div>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Səviyyə</p>
                      <p className="font-medium text-gray-900">{course.level}</p>
                    </div>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Müddət</p>
                      <p className="font-medium text-gray-900">{course.duration}</p>
                    </div>
                  </div>
                )}
                {course.targetAudience && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hədəf Kütlə</p>
                      <p className="font-medium text-gray-900">{course.targetAudience}</p>
                    </div>
                  </div>
                )}
                {course.price && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Qiymət</p>
                    <p className="text-2xl font-bold text-indigo-600">{course.price}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Xüsusiyyətlər */}
            {course.features && course.features.length > 0 && (
              <div className={`rounded-xl border border-gray-200 p-6 ${bgLightClass}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Xüsusiyyətlər
                </h3>
                <ul className="space-y-2">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qeydiyyat Düyməsi */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <a 
                href="https://wa.me/994500000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp ilə Qeydiyyat
              </a>
              <p className="text-xs text-gray-500 text-center mt-3">
                Ətraflı məlumat üçün bizimlə əlaqə saxlayın
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}