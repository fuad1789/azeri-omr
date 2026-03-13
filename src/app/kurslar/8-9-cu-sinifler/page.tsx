'use client'

import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Book, Clock, Users, CheckCircle, Target, Award } from 'lucide-react'
import Link from 'next/link'

const subjects = [
  {
    id: 1,
    name: 'Azərbaycan dili',
    hours: 64,
    lessons: 32,
    teacher: 'Nargiz Qasımova',
    description: 'Morfoloji təhlil, sintaksis, punktuasiya. Attestat imtahanına xüsusi hazırlıq.'
  },
  {
    id: 2,
    name: 'Riyaziyyat',
    hours: 80,
    lessons: 40,
    teacher: 'Fikrət Əliyev',
    description: 'Cəbr, həndəsə, funksiyalar. Attestat imtahanı formatında testlər.'
  },
  {
    id: 3,
    name: 'İngilis dili',
    hours: 64,
    lessons: 32,
    teacher: 'Günay Məmmədova',
    description: 'Qrammatika, oxu, yazı. Beynəlxalq imtahanlara hazırlıq.'
  },
  {
    id: 4,
    name: 'Tarix',
    hours: 48,
    lessons: 24,
    teacher: 'Vüqar Həsənov',
    description: 'Azərbaycan və ümumi tarix. Xronologiya və tarixi şəxsiyyətlər.'
  },
  {
    id: 5,
    name: 'Fizika',
    hours: 48,
    lessons: 24,
    teacher: 'Elman Rzayev',
    description: 'Mexanika, termodinamika, elektrik. Laboratoriya işləri.'
  },
  {
    id: 6,
    name: 'Kimya',
    hours: 48,
    lessons: 24,
    teacher: 'Aysel İbrahimova',
    description: 'Üzvi və qeyri-üzvi kimya. Kimyəvi reaksiyalar və hesablamalar.'
  }
]

const features = [
  'Attestat imtahanına xüsusi hazırlıq',
  'Dövlət imtahan proqramına uyğun tədris',
  'Müntəzəm sınaq imtahanları',
  'Fərdi yanaşma və konsultasiyalar',
  'Valideyn konfransları',
  'Peşəkar müəllim heyəti'
]

const schedule = [
  { day: 'Bazar ertəsi', time: '16:00 - 18:00', subject: 'Riyaziyyat' },
  { day: 'Bazar ertəsi', time: '18:00 - 20:00', subject: 'Azərbaycan dili' },
  { day: 'Çərşənbə axşamı', time: '16:00 - 18:00', subject: 'İngilis dili' },
  { day: 'Çərşənbə', time: '16:00 - 18:00', subject: 'Fizika' },
  { day: 'Cümə axşamı', time: '16:00 - 18:00', subject: 'Kimya' },
  { day: 'Cümə', time: '16:00 - 18:00', subject: 'Tarix' },
  { day: 'Şənbə', time: '12:00 - 14:00', subject: 'Sınaq imtahanı' }
]

export default function Grade8_9Page() {
  return (
    <>
      <PageHeader 
        title="8-9-cu siniflər üçün kurslar" 
        description="9-cu sinif attestat imtahanına tam hazırlıq və əsas fənnlər üzrə dərinləşdirilmiş tədris"
      />
      
      <Section>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-dark mb-4">Kurs haqqında</h3>
            <p className="text-gray-medium mb-4">
              8-9-cu sinif şagirdləri üçün nəzərdə tutulan bu kurs, attestat imtahanına 
              sistemli hazırlıq və əsas fənnlər üzrə dərin biliklər əldə etməyə yönəlib.
            </p>
            <p className="text-gray-medium">
              Proqram dövlət təhsil standartlarına uyğun hazırlanmışdır və şagirdlərin 
              attestat imtahanından uğurla keçməsi üçün bütün zəruri bilikləri əhatə edir.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-dark mb-4">Kursun xüsusiyyətləri</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Target className="text-green-600" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-dark mb-2">Attestat imtahanı məqsədi</h4>
              <p className="text-gray-medium">
                Kursun əsas məqsədi şagirdləri 9-cu sinif attestat imtahanına tam hazırlamaqdır. 
                İmtahan Azərbaycan dili və riyaziyyat fənnlərindən ibarətdir və hər iki fənn üzrə 
                proqram tam əhatə olunur.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-dark mb-6">Fənnlər</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {subjects.map((subject) => (
            <Card key={subject.id} hover>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
                    <Book className="text-brand-red" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-dark">{subject.name}</h4>
                </div>
                <p className="text-gray-medium mb-4 text-sm">{subject.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{subject.hours} saat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{subject.lessons} dərs</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Müəllim: <span className="font-medium">{subject.teacher}</span></p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-dark mb-6">Dərs cədvəli</h3>
        <Card className="mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-dark">Gün</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-dark">Vaxt</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-dark">Fənn</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-dark font-medium">{item.day}</td>
                    <td className="px-6 py-4 text-sm text-gray-medium">{item.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-dark">{item.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Award className="text-green-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Uğur nisbəti</h4>
            <p className="text-3xl font-bold text-green-600 mb-2">97%</p>
            <p className="text-sm text-gray-medium">Məzunlarımız attestat imtahanından uğurla keçir</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Qrup ölçüsü</h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">8-12</p>
            <p className="text-sm text-gray-medium">Kiçik qruplarda fərdi yanaşma</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-purple-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Kurs müddəti</h4>
            <p className="text-3xl font-bold text-purple-600 mb-2">9 ay</p>
            <p className="text-sm text-gray-medium">Tam tədris ili ərzində hazırlıq</p>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-brand-red/5 to-brand-red/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-dark mb-4">Qeydiyyatdan keçin</h3>
          <p className="text-gray-medium mb-6 max-w-2xl mx-auto">
            Kurslarımız haqqında ətraflı məlumat almaq və qeydiyyatdan keçmək üçün 
            bizimlə əlaqə saxlayın və ya birbaşa müraciət edin.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/elaqe">
              <Button size="lg">Əlaqə</Button>
            </Link>
            <a href="tel:+994123456789">
              <Button variant="outline" size="lg">Zəng et</Button>
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}