'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { BookOpen, Users, Award, Globe, Brain, GraduationCap, Search, CheckCircle, Target, TrendingUp, Shield } from 'lucide-react'

export default function HomePage() {
  const [examResult, setExamResult] = useState<any>(null)
  const [examForm, setExamForm] = useState({
    exam: '',
    class: '',
    group: '',
    department: '',
    workNumber: ''
  })

  const handleExamSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock result
    setExamResult({
      name: 'Əli Məmmədov',
      score: 650,
      rank: 15,
      status: 'Uğurlu'
    })
  }

  const services = [
    {
      icon: <GraduationCap size={40} />,
      title: 'Universitet hazırlıq',
      description: 'Universitet qəbul imtahanlarına peşəkar hazırlıq proqramları'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Attestat imtahanları',
      description: 'IX və XI sinif attestat imtahanlarına hazırlıq kursları'
    },
    {
      icon: <Award size={40} />,
      title: 'Sınaq imtahanları',
      description: 'Real imtahan şəraitində sınaq imtahanlarının keçirilməsi'
    },
    {
      icon: <Users size={40} />,
      title: 'Təkmilləşdirmə kursları',
      description: 'Müəllimlər və mütəxəssislər üçün təkmilləşdirmə proqramları'
    },
    {
      icon: <Globe size={40} />,
      title: 'Xaricdə təhsil',
      description: 'Xarici universitetlərə qəbul üzrə məsləhət və yardım'
    },
    {
      icon: <Brain size={40} />,
      title: 'Mental arifmetik',
      description: 'Uşaqlar üçün mental arifmetik və zehni inkişaf proqramları'
    }
  ]

  const stats = [
    { number: '15+', label: 'İl təcrübə' },
    { number: '5000+', label: 'Məzun tələbə' },
    { number: '98%', label: 'Uğur nisbəti' },
    { number: '50+', label: 'Peşəkar müəllim' }
  ]

  const whyChooseUs = [
    {
      icon: <Target size={32} />,
      title: 'Fərdi yanaşma',
      description: 'Hər tələbənin ehtiyaclarına uyğun fərdiləşdirilmiş təhsil proqramları'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Yüksək nəticələr',
      description: '98% uğur nisbəti ilə tələbələrimizin əksəriyyəti arzuladıqları universitetə daxil olur'
    },
    {
      icon: <Shield size={32} />,
      title: 'Təcrübəli müəllimlər',
      description: '15+ il təcrübəyə malik peşəkar müəllim heyəti və müasir təhsil metodları'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Müasir infrastruktur',
      description: 'Tam təchiz olunmuş sinif otaqları və interaktiv təhsil materialları'
    }
  ]

  return (
    <>
      {/* Hero Section - Modern & Airy */}
      <Section className="bg-white relative overflow-hidden">
        {/* Red accent gradient on the side */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-red/10 to-transparent -z-0"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -z-0"></div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-brand-red to-brand-red-dark bg-clip-text text-transparent text-sm font-semibold tracking-wide uppercase">
                Azərbaycanın ən yaxşı hazırlıq mərkəzi
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-dark">
              Gələcəyinizə{' '}
              <span className="bg-gradient-to-r from-brand-red to-brand-red-dark bg-clip-text text-transparent">
                investisiya edin
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-medium leading-relaxed">
              Universitet qəbul imtahanlarına peşəkar hazırlıq və uğurlu gələcək üçün etibarlı tərəfdaşınız
            </p>
            
            {/* Stats as small badges/pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-full px-5 py-3 border border-gray-200 hover:border-brand-red hover:shadow-md transition-all">
                  <span className="text-2xl font-bold text-brand-red mr-2">{stat.number}</span>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sinaq-imtahani">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  Sınaq imtahanına yazıl
                </Button>
              </Link>
              <Link href="/filiallarimiz">
                <Button variant="outline" size="lg">
                  Filiallarımız
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Visual element - hero image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-brand-red-dark/20 rounded-3xl blur-2xl"></div>
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
      </Section>

      {/* Services Section - Premium Design */}
      <Section background="gray">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Xidmətlərimiz
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Müasir təhsil metodları və təcrübəli müəllim heyəti ilə keyfiyyətli təhsil xidməti
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red/10 to-brand-red/5 flex items-center justify-center mb-6">
                <div className="text-brand-red">{service.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">{service.title}</h3>
              <p className="text-gray-medium leading-relaxed">{service.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Exam Results Lookup - Compact Design */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Sınaq imtahanının nəticələri
          </h2>
          <p className="text-lg text-gray-medium">
            İş nömrənizi daxil edərək sınaq imtahanınızın nəticəsini öyrənin
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-brand-red/5 to-brand-red/10 border-brand-red/20 h-full">
              <h3 className="text-lg font-bold text-gray-dark mb-4">Nəticə sorğusu</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                  <p>İmtahan nəticələri 24 saat ərzində yayımlanır</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                  <p>İş nömrənizi düzgün daxil etdiyinizdən əmin olun</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                  <p>Suallarınız üçün bizimlə əlaqə saxlayın</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-brand-red/20">
                <p className="text-xs text-gray-500">
                  <strong>Qeyd:</strong> Nəticələr yalnız imtahan tarixindən sonra əlçatandır
                </p>
              </div>
            </Card>
          </div>
          
          {/* Form Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              <form onSubmit={handleExamSearch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="İmtahan"
                    options={[
                      { value: '', label: 'İmtahan seçin' },
                      { value: 'sinaq1', label: 'I Sınaq imtahanı' },
                      { value: 'sinaq2', label: 'II Sınaq imtahanı' },
                      { value: 'sinaq3', label: 'III Sınaq imtahanı' }
                    ]}
                    value={examForm.exam}
                    onChange={(e: any) => setExamForm({ ...examForm, exam: e.target.value })}
                  />
                  <Select
                    label="Sinif"
                    options={[
                      { value: '', label: 'Sinif seçin' },
                      { value: '9', label: '9-cu sinif' },
                      { value: '11', label: '11-ci sinif' }
                    ]}
                    value={examForm.class}
                    onChange={(e: any) => setExamForm({ ...examForm, class: e.target.value })}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="Qrup"
                    options={[
                      { value: '', label: 'Qrup seçin' },
                      { value: 'a', label: 'A qrupu' },
                      { value: 'b', label: 'B qrupu' },
                      { value: 'c', label: 'C qrupu' }
                    ]}
                    value={examForm.group}
                    onChange={(e: any) => setExamForm({ ...examForm, group: e.target.value })}
                  />
                  <Select
                    label="Şöbə"
                    options={[
                      { value: '', label: 'Şöbə seçin' },
                      { value: 'riyazi', label: 'Riyazi' },
                      { value: 'humanitar', label: 'Humanitar' }
                    ]}
                    value={examForm.department}
                    onChange={(e: any) => setExamForm({ ...examForm, department: e.target.value })}
                  />
                </div>
                
                <Input
                  label="İş nömrəsi"
                  placeholder="İş nömrənizi daxil edin"
                  value={examForm.workNumber}
                  onChange={(e: any) => setExamForm({ ...examForm, workNumber: e.target.value })}
                />
                
                <Button type="submit" className="w-full" size="lg">
                  <Search size={20} className="mr-2" />
                  Nəticəni yoxla
                </Button>
              </form>

              {examResult && (
                <div className="mt-6 p-5 bg-green-50 border-2 border-green-500 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-dark mb-3">Nəticə tapıldı</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-medium mb-1">Ad Soyad</p>
                      <p className="font-semibold text-gray-dark">{examResult.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-medium mb-1">Bal</p>
                      <p className="font-semibold text-gray-dark">{examResult.score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-medium mb-1">Sıra</p>
                      <p className="font-semibold text-gray-dark">{examResult.rank}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-medium mb-1">Status</p>
                      <p className="font-semibold text-green-600">{examResult.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section background="gray">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Niyə bizi seçməlisiniz?
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Tələbələrimizin uğuru bizim prioritetimizdir
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, index) => (
            <Card key={index} className="p-6 bg-white border border-gray-100 hover:border-brand-red transition-all">
              <div className="text-brand-red mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-dark mb-2">{item.title}</h3>
              <p className="text-sm text-gray-medium leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
        
        {/* Success Highlights */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-dark mb-6 text-center">Uğur hekayələrimiz</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-green-600" />
              </div>
              <p className="text-sm text-gray-600 italic">"Azəri kurslarında aldığım biliklərlə 700 bal toplayıb ADNSU-ya qəbul oldum"</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold">- Nigar Əliyeva</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={32} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 italic">"Müəllimlər çox peşəkar, hər dərsdə yeni biliklər öyrənirəm"</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold">- Rəşad Məmmədov</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 italic">"3 ay ərzində balımı 200 xal artırdım, təşəkkürlər!"</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold">- Leyla Həsənova</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Bizimlə əlaqə saxlayın
          </h2>
          <p className="text-lg text-gray-medium mb-8">
            Kurslarımız haqqında ətraflı məlumat almaq və qeydiyyatdan keçmək üçün bizimlə əlaqə saxlayın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/elaqe">
              <Button size="lg">Əlaqə</Button>
            </Link>
            <Link href="/haqqimizda">
              <Button variant="outline" size="lg">Haqqımızda</Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
