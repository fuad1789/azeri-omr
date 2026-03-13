'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { BookOpen, Users, Award, Globe, Brain, GraduationCap, Search, CheckCircle, Target, TrendingUp, Shield, Loader2, Languages, FileText, Layers, Calculator, PenTool, Microscope, History, Music, Palette, Dumbbell, Code, Lightbulb, Atom, Zap } from 'lucide-react'
import ExamRegistrationBanner from '@/components/ExamRegistrationBanner'

interface ExamOption {
  id: string;
  name: string;
  type: string;
  classes?: string[];
  groups?: string[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

const COURSES_PER_PAGE = 6;

export default function HomePage() {
  const router = useRouter();
  const [examOptions, setExamOptions] = useState<ExamOption[]>([]);
  const [isFetchingExams, setIsFetchingExams] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [examForm, setExamForm] = useState({
    examId: '',
    class: '',
    group: '',
    department: '',
    workNumber: ''
  })
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFetchingCourses, setIsFetchingCourses] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState<number>(COURSES_PER_PAGE);

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch('/api/public/exams');
        const data = await res.json();
        if (data.success) setExamOptions(data.exams);
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        setIsFetchingExams(false);
      }
    }
    fetchExams();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses?active=true');
        const data = await res.json();
        if (data.success) setCourses(data.data);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setIsFetchingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  const handleExamSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.examId || !examForm.workNumber) {
      setSearchError('Zəhmət olmasa İmtahan və İş nömrəsini daxil edin.');
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch('/api/public/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examForm)
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/neticeler?examId=${encodeURIComponent(examForm.examId)}&workNumber=${encodeURIComponent(examForm.workNumber)}`);
      } else {
        setSearchError(data.error || 'Nəticə tapılmadı.');
      }
    } catch (err) {
      setSearchError('Sistem xətası baş verdi. Yenidən cəhd edin.');
    } finally {
      setIsSearching(false);
    }
  }

  const services = [
    { icon: <GraduationCap size={24} className="sm:w-8 sm:h-8" />, title: 'Universitet hazırlıq', description: 'Universitet qəbul imtahanlarına peşəkar hazırlıq proqramları' },
    { icon: <BookOpen size={24} className="sm:w-8 sm:h-8" />, title: 'Attestat imtahanları', description: 'IX və XI sinif attestat imtahanlarına hazırlıq kursları' },
    { icon: <Award size={24} className="sm:w-8 sm:h-8" />, title: 'Sınaq imtahanları', description: 'Real imtahan şəraitində sınaq imtahanlarının keçirilməsi' },
    { icon: <Users size={24} className="sm:w-8 sm:h-8" />, title: 'Təkmilləşdirmə kursları', description: 'Müəllimlər və mütəxəssislər üçün təkmilləşdirmə proqramları' },
    { icon: <Globe size={24} className="sm:w-8 sm:h-8" />, title: 'Xaricdə təhsil', description: 'Xarici universitetlərə qəbul üzrə məsləhət və yardım' },
    { icon: <Brain size={24} className="sm:w-8 sm:h-8" />, title: 'Mental arifmetik', description: 'Uşaqlar üçün mental arifmetik və zehni inkişaf proqramları' },
  ]

  const stats = [
    { number: '15+', label: 'İl təcrübə' },
    { number: '5000+', label: 'Məzun tələbə' },
    { number: '98%', label: 'Uğur nisbəti' },
    { number: '50+', label: 'Peşəkar müəllim' }
  ]

  const whyChooseUs = [
    { icon: <Target size={24} className="sm:w-7 sm:h-7" />, title: 'Fərdi yanaşma', description: 'Hər tələbənin ehtiyaclarına uyğun fərdiləşdirilmiş təhsil proqramları' },
    { icon: <TrendingUp size={24} className="sm:w-7 sm:h-7" />, title: 'Yüksək nəticələr', description: '98% uğur nisbəti ilə tələbələrimizin əksəriyyəti arzuladıqları universitetə daxil olur' },
    { icon: <Shield size={24} className="sm:w-7 sm:h-7" />, title: 'Təcrübəli müəllimlər', description: '15+ il təcrübəyə malik peşəkar müəllim heyəti və müasir təhsil metodları' },
    { icon: <CheckCircle size={24} className="sm:w-7 sm:h-7" />, title: 'Müasir infrastruktur', description: 'Tam təchiz olunmuş sinif otaqları və interaktiv təhsil materialları' },
  ]

  const getSuffix = (n: string) => {
    if (n === '10') return 'cu';
    const lastDigit = n.slice(-1);
    if (lastDigit === '9') return 'cu';
    if (lastDigit === '3' || lastDigit === '4') return 'cü';
    if (lastDigit === '6') return 'cı';
    return 'ci';
  };

  const selectedExam = examOptions.find(e => e.id === examForm.examId);
  
  const availableClasses = selectedExam?.classes && selectedExam.classes.length > 0
    ? selectedExam.classes.sort((a, b) => parseInt(a) - parseInt(b))
    : Array.from({ length: 11 }, (_, i) => (i + 1).toString());

  const classOptions = [
    { value: '', label: 'Sinif seçin' },
    ...availableClasses.map(c => ({ value: c, label: `${c}-${getSuffix(c)} sinif` }))
  ];

  const availableGroups = selectedExam?.groups && selectedExam.groups.length > 0
    ? selectedExam.groups.sort()
    : ['1', '2', '3', '4'];

  const groupOptions = [
    { value: '', label: 'Qrup seçin' },
    ...availableGroups.map(g => ({ value: g, label: `${g}-${getSuffix(g)} qrup` }))
  ];

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-white">
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-red/5 to-transparent -z-0 hidden sm:block" />
        <div className="absolute top-10 right-5 w-40 h-40 sm:w-64 sm:h-64 bg-brand-red/5 rounded-full blur-3xl -z-0" />

        <div className="container-custom px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
            <div>
              <span className="inline-block bg-gradient-to-r from-brand-red to-brand-red-dark bg-clip-text text-transparent text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
                Azərbaycanın ən yaxşı hazırlıq mərkəzi
              </span>

              <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-[1.15] text-gray-dark">
                Sizin qələbəniz
                <br className="sm:hidden" />{" "}
                <span className="bg-gradient-to-r from-brand-red to-brand-red-dark bg-clip-text text-transparent">
                  Bizim uğurumuzdur
                </span>
              </h1>

              <p className="text-sm sm:text-lg md:text-xl mb-5 sm:mb-8 text-gray-medium leading-relaxed">
                Universitet qəbul imtahanlarına peşəkar hazırlıq və uğurlu
                gələcək üçün etibarlı tərəfdaşınız
              </p>

              {/* Stats — 2x2 grid on mobile, inline row on desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl sm:rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-gray-200 hover:border-brand-red/30 hover:shadow-sm transition-all text-center sm:text-left whitespace-nowrap"
                  >
                    <span className="text-base sm:text-xl font-bold text-brand-red mr-1">
                      {stat.number}
                    </span>
                    <span className="text-[11px] sm:text-sm text-gray-600">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4">
                <a href="#exam-search">
                  <Button
                    size="lg"
                    className="shadow-lg w-full sm:w-auto text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4"
                  >
                    İmtahan nəticələri
                  </Button>
                </a>
                <Link href="/imtahan-movzulari">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4"
                  >
                    İmtahan mövzuları
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero image — hidden on mobile */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-brand-red-dark/20 rounded-3xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden h-[500px]">
                  <Image
                    src="/images/unnamed.webp"
                    alt="Uğurlu gələcəyiniz burada başlayır"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SINAQ IMTAHANI BANNER ==================== */}
      <ExamRegistrationBanner />

      {/* ==================== KURS SEÇİN ==================== */}
      <Section background="gray">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-dark mb-2 sm:mb-4">
            Kurs seçin
          </h2>
          <p className="text-sm sm:text-lg text-gray-medium max-w-2xl mx-auto">
            Sizin üçün ən uyğun kursu seçin və uğura doğru ilk addımı atın
          </p>
        </div>

        {isFetchingCourses ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-2">Kurslar yüklənir...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Hazırda aktiv kurs yoxdur</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {courses.slice(0, visibleCourses).map((course) => (
                <Link href={course.href} key={course._id}>
                  <Card className={`p-4 sm:p-6 lg:p-8 bg-gradient-to-br border-${course.color}-200 hover:shadow-xl transition-all duration-300 sm:hover:-translate-y-1 cursor-pointer h-full from-${course.color}-50 to-${course.color}-100`}>
                    <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center mb-3 sm:mb-5 shadow-sm">
                      <div className={`text-${course.color}-600`}>
                        {course.icon === 'BookOpen' && <BookOpen size={24} />}
                        {course.icon === 'GraduationCap' && <GraduationCap size={24} />}
                        {course.icon === 'Target' && <Target size={24} />}
                        {course.icon === 'Award' && <Award size={24} />}
                        {course.icon === 'Users' && <Users size={24} />}
                        {course.icon === 'Globe' && <Globe size={24} />}
                        {course.icon === 'Brain' && <Brain size={24} />}
                        {course.icon === 'CheckCircle' && <CheckCircle size={24} />}
                        {course.icon === 'TrendingUp' && <TrendingUp size={24} />}
                        {course.icon === 'Shield' && <Shield size={24} />}
                        {course.icon === 'Lightning' && <Zap size={24} />}
                        {course.icon === 'Languages' && <Languages size={24} />}
                        {course.icon === 'FileText' && <FileText size={24} />}
                        {course.icon === 'Layers' && <Layers size={24} />}
                        {course.icon === 'Calculator' && <Calculator size={24} />}
                        {course.icon === 'PenTool' && <PenTool size={24} />}
                        {course.icon === 'Microscope' && <Microscope size={24} />}
                        {course.icon === 'History' && <History size={24} />}
                        {course.icon === 'Music' && <Music size={24} />}
                        {course.icon === 'Palette' && <Palette size={24} />}
                        {course.icon === 'Dumbbell' && <Dumbbell size={24} />}
                        {course.icon === 'Code' && <Code size={24} />}
                        {course.icon === 'Lightbulb' && <Lightbulb size={24} />}
                        {course.icon === 'Atom' && <Atom size={24} />}
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-dark mb-1 sm:mb-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-medium leading-relaxed hidden sm:block">
                      {course.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
            
            {visibleCourses < courses.length && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCourses(prev => prev + COURSES_PER_PAGE)}
                  className="mx-auto"
                >
                  Daha çox kurs göstər
                </Button>
              </div>
            )}
          </>
        )}
      </Section>

      {/* ==================== EXAM RESULTS LOOKUP ==================== */}
      <Section id="exam-search">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-dark mb-2 sm:mb-4">
            Sınaq imtahanının nəticələri
          </h2>
          <p className="text-sm sm:text-lg text-gray-medium">
            İş nömrənizi daxil edərək nəticəsini öyrənin
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Mobile: stacked | Desktop: side-by-side */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Info Card — collapsed on mobile */}
            <div className="lg:col-span-1 hidden lg:block">
              <Card className="p-6 bg-gradient-to-br from-brand-red/5 to-brand-red/10 border-brand-red/20 h-full">
                <h3 className="text-lg font-bold text-gray-dark mb-4">
                  Nəticə sorğusu
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      size={18}
                      className="text-brand-red flex-shrink-0 mt-0.5"
                    />
                    <p>İmtahan nəticələri 24 saat ərzində yayımlanır</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      size={18}
                      className="text-brand-red flex-shrink-0 mt-0.5"
                    />
                    <p>İş nömrənizi düzgün daxil etdiyinizdən əmin olun</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      size={18}
                      className="text-brand-red flex-shrink-0 mt-0.5"
                    />
                    <p>Suallarınız üçün bizimlə əlaqə saxlayın</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-brand-red/20">
                  <p className="text-xs text-gray-500">
                    <strong>Qeyd:</strong> Nəticələr yalnız imtahan tarixindən
                    sonra əlçatandır
                  </p>
                </div>
              </Card>
            </div>

            {/* Form Card — full width on mobile */}
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-6 shadow-lg">
                <form
                  onSubmit={handleExamSearch}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* On mobile: stack all inputs | Desktop: 2-col */}
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <Select
                      label="İmtahan"
                      options={[
                        {
                          value: "",
                          label: isFetchingExams
                            ? "Yüklənir..."
                            : "İmtahan seçin",
                        },
                        ...examOptions.map((exam) => ({
                          value: exam.id,
                          label: exam.name,
                        })),
                      ]}
                      value={examForm.examId}
                      onChange={(e: any) =>
                        setExamForm({ ...examForm, examId: e.target.value })
                      }
                    />
                    <Select
                      label="Sinif"
                      options={classOptions}
                      value={examForm.class}
                      onChange={(e: any) =>
                        setExamForm({ ...examForm, class: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <Select
                      label="Qrup"
                      options={groupOptions}
                      value={examForm.group}
                      onChange={(e: any) =>
                        setExamForm({ ...examForm, group: e.target.value })
                      }
                    />
                    <Input
                      label="İş nömrəsi"
                      placeholder="İş nömrənizi daxil edin"
                      value={examForm.workNumber}
                      onChange={(e: any) =>
                        setExamForm({ ...examForm, workNumber: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm sm:text-base py-3 sm:py-4"
                    size="lg"
                    disabled={isSearching || isFetchingExams}
                  >
                    {isSearching ? (
                      <Loader2 className="mr-2 animate-spin" size={18} />
                    ) : (
                      <Search size={18} className="mr-2" />
                    )}
                    {isSearching ? "Axtarılır..." : "Nəticəni yoxla"}
                  </Button>
                </form>

                {searchError && (
                  <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm">
                    {searchError}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <Section background="gray">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-dark mb-2 sm:mb-4">
            Niyə bizi seçməlisiniz?
          </h2>
          <p className="text-sm sm:text-lg text-gray-medium max-w-2xl mx-auto">
            Tələbələrimizin uğuru bizim prioritetimizdir
          </p>
        </div>

        {/* Mobile: 2x2 grid | Desktop: 4 col */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {whyChooseUs.map((item, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 bg-white border border-gray-100 hover:border-brand-red transition-all"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-red/10 flex items-center justify-center mb-3 sm:mb-4">
                <div className="text-brand-red">{item.icon}</div>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-dark mb-1 sm:mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-medium leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-dark mb-4 sm:mb-6 text-center">
            Uğur hekayələrimiz
          </h3>

          {/* Mobile: horizontal scroll cards | Desktop: 3-col grid */}
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto pb-2 sm:pb-0 -mx-1 sm:mx-0 px-1 sm:px-0 no-scrollbar">
            <div className="flex-shrink-0 w-[260px] sm:w-auto text-center bg-gray-50 sm:bg-transparent rounded-xl p-4 sm:p-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award size={24} className="text-green-600 sm:w-8 sm:h-8" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                &quot;Azəri kurslarında aldığım biliklərlə 700 bal toplayıb
                ADNSU-ya qəbul oldum&quot;
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-2 font-semibold">
                - Nigar Əliyeva
              </p>
            </div>
            <div className="flex-shrink-0 w-[260px] sm:w-auto text-center bg-gray-50 sm:bg-transparent rounded-xl p-4 sm:p-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <GraduationCap
                  size={24}
                  className="text-blue-600 sm:w-8 sm:h-8"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                &quot;Müəllimlər çox peşəkar, hər dərsdə yeni biliklər
                öyrənirəm&quot;
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-2 font-semibold">
                - Rəşad Məmmədov
              </p>
            </div>
            <div className="flex-shrink-0 w-[260px] sm:w-auto text-center bg-gray-50 sm:bg-transparent rounded-xl p-4 sm:p-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp
                  size={24}
                  className="text-purple-600 sm:w-8 sm:h-8"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                &quot;3 ay ərzində balımı 200 xal artırdım, təşəkkürlər!&quot;
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-2 font-semibold">
                - Leyla Həsənova
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ==================== CTA ==================== */}
      <Section>
        <div className="text-center max-w-3xl mx-auto px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-dark mb-2 sm:mb-4">
            Bizimlə əlaqə saxlayın
          </h2>
          <p className="text-sm sm:text-lg text-gray-medium mb-6 sm:mb-8">
            Kurslarımız haqqında ətraflı məlumat almaq və qeydiyyatdan keçmək
            üçün bizimlə əlaqə saxlayın
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center">
            <Link href="/elaqe">
              <Button
                size="lg"
                className="text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4"
              >
                Əlaqə
              </Button>
            </Link>
            <Link href="/haqqimizda">
              <Button
                variant="outline"
                size="lg"
                className="text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4"
              >
                Haqqımızda
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
