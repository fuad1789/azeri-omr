'use client'

import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Book, Clock, Users, CheckCircle, Star, Calendar } from 'lucide-react'
import Link from 'next/link'

const subjects = [
  {
    id: 1,
    name: 'Azərbaycan dili',
    hours: 48,
    lessons: 24,
    teacher: 'Leyla Əhmədova',
    description: 'Fonetika, leksika, morfoloji təhlil. Oxu və yazı bacarıqlarının inkişafı.'
  },
  {
    id: 2,
    name: 'Riyaziyyat',
    hours: 64,
    lessons: 32,
    teacher: 'Rəşad Məmmədov',
    description: 'Ədədlər, həndəsi fiqurlar, kəsrlər, faizlər. Məntiqi təfəkkürün inkişafı.'
  },
  {
    id: 3,
    name: 'İngilis dili',
    hours: 48,
    lessons: 24,
    teacher: 'Aysel Kərimova',
    description: 'Əlifba, əsas sözlər, sadə cümlələr. Danışıq və yazı bacarıqları.'
  },
  {
    id: 4,
    name: 'Tarix',
    hours: 32,
    lessons: 16,
    teacher: 'Elşən Hüseynov',
    description: 'Azərbaycan tarixi, qədim dövlətlər, mədəniyyət abidələri.'
  }
]

const features = [
  'Yaşa uyğun tədris proqramı',
  'İnteraktiv dərslər və oyunlar',
  'Kiçik qruplarda məşğələlər',
  'Müntəzəm qiymətləndirmə',
  'Valideynlərə hesabat',
  'Ev tapşırıqlarına nəzarət'
]

const schedule = [
  { day: 'Bazar ertəsi', time: '15:00 - 17:00', subject: 'Riyaziyyat' },
  { day: 'Çərşənbə axşamı', time: '15:00 - 17:00', subject: 'Azərbaycan dili' },
  { day: 'Çərşənbə', time: '15:00 - 17:00', subject: 'İngilis dili' },
  { day: 'Cümə axşamı', time: '15:00 - 17:00', subject: 'Tarix' },
  { day: 'Cümə', time: '15:00 - 17:00', subject: 'Ümumi təkrar' }
]

export default function Grade5_7Page() {
  return (
    <>
      <PageHeader 
        title="5-7-ci siniflər üçün kurslar" 
        description="Orta məktəbin aşağı sinifləri üçün əsas fənnlər üzrə kompleks hazırlıq"
      />
      
      <Section>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-dark mb-4">Kurs haqqında</h3>
            <p className="text-gray-medium mb-4">
              5-7-ci sinif şagirdləri üçün nəzərdə tutulan bu kurs, əsas fənnlər üzrə möhkəm baza yaratmağa 
              yönəlib. Proqram şagirdlərin yaş xüsusiyyətlərinə uyğun olaraq hazırlanmışdır.
            </p>
            <p className="text-gray-medium">
              Məqsədimiz şagirdlərdə öyrənmə həvəsi yaratmaq, əsas bilikləri mənimsətmək və 
              gələcək akademik uğurlar üçün təməl qoymaqdır.
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

        <h3 className="text-2xl font-bold text-gray-dark mb-6">Fənnlər</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {subjects.map((subject) => (
            <Card key={subject.id} hover>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
                    <Book className="text-brand-red" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-dark">{subject.name}</h4>
                </div>
                <p className="text-gray-medium mb-4">{subject.description}</p>
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