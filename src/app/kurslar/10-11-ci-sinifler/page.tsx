'use client'

import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Book, Clock, Users, CheckCircle, Target, Award, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

const subjects = [
  {
    id: 1,
    name: 'Azərbaycan dili',
    hours: 96,
    lessons: 48,
    teacher: 'Sevinc Əliyeva',
    description: 'Tam morfoloji və sintaktik təhlil. İnşa və esse yazma texnikaları. Qəbul imtahanı formatında testlər.'
  },
  {
    id: 2,
    name: 'Riyaziyyat',
    hours: 128,
    lessons: 64,
    teacher: 'Bəhram Quliyev',
    description: 'Cəbr, həndəsə, riyazi analiz. Qəbul imtahanının bütün mövzuları. Olimpiada məsələləri.'
  },
  {
    id: 3,
    name: 'İngilis dili',
    hours: 96,
    lessons: 48,
    teacher: 'Nigar Hüseynova',
    description: 'Advanced qrammatika, IELTS hazırlığı, akademik yazı. Dövlət imtahanı və beynəlxalq sertifikatlar.'
  },
  {
    id: 4,
    name: 'Tarix',
    hours: 80,
    lessons: 40,
    teacher: 'Zaur Məmmədov',
    description: 'Azərbaycan tarixi, ümumi tarix, mədəniyyət tarixi. Xronologiya, tarixi coğrafiya.'
  },
  {
    id: 5,
    name: 'Fizika',
    hours: 96,
    lessons: 48,
    teacher: 'Rəşad Rzayev',
    description: 'Bütün bölmələr üzrə dərin tədris. Laboratoriya işləri, praktik məsələlər.'
  },
  {
    id: 6,
    name: 'Kimya',
    hours: 96,
    lessons: 48,
    teacher: 'Günel Kərimova',
    description: 'Üzvi, qeyri-üzvi, analitik kimya. Kimyəvi hesablamalar, reaksiyalar.'
  },
  {
    id: 7,
    name: 'Biologiya',
    hours: 80,
    lessons: 40,
    teacher: 'Leyla Vəliyeva',
    description: 'Botanika, zoologiya, anatomiya, ümumi biologiya. Tibb universitetinə hazırlıq.'
  }
]

const groups = [
  {
    id: 1,
    name: 'I Qrup',
    subjects: 'Riyaziyyat, Fizika, Kimya',
    universities: 'Texniki universitetlər, IT, mühəndislik'
  },
  {
    id: 2,
    name: 'II Qrup',
    subjects: 'Azərbaycan dili, Tarix, Ədəbiyyat',
    universities: 'Humanitar elmlər, jurnalistika, filologiya'
  },
  {
    id: 3,
    name: 'III Qrup',
    subjects: 'Biologiya, Kimya, Fizika',
    universities: 'Tibb, biologiya, ekologiya'
  },
  {
    id: 4,
    name: 'IV Qrup',
    subjects: 'Xarici dil, Azərbaycan dili, Tarix',
    universities: 'Xarici dil, beynəlxalq münasibətlər'
  }
]

const features = [
  'Universitet qəbul imtahanına tam hazırlıq',
  'Dövlət İmtahan Mərkəzi proqramına uyğun tədris',
  'Hər ay sınaq imtahanları',
  'Fərdi tədris planı',
  'Peşəkar psixoloji dəstək',
  'Valideynlərə müntəzəm hesabat',
  'Qəbul sonrası məsləhət xidməti',
  'Məzun klubuna üzvlük'
]

const schedule = [
  { day: 'Bazar ertəsi', time: '15:00 - 17:00', subject: 'Riyaziyyat' },
  { day: 'Bazar ertəsi', time: '17:00 - 19:00', subject: 'Azərbaycan dili' },
  { day: 'Çərşənbə axşamı', time: '15:00 - 17:00', subject: 'Fizika' },
  { day: 'Çərşənbə axşamı', time: '17:00 - 19:00', subject: 'Kimya' },
  { day: 'Çərşənbə', time: '15:00 - 17:00', subject: 'İngilis dili' },
  { day: 'Cümə axşamı', time: '15:00 - 17:00', subject: 'Tarix' },
  { day: 'Cümə axşamı', time: '17:00 - 19:00', subject: 'Biologiya' },
  { day: 'Cümə', time: '15:00 - 17:00', subject: 'Fənn seçimi' },
  { day: 'Şənbə', time: '11:00 - 13:00', subject: 'Sınaq imtahanı' }
]

export default function Grade10_11Page() {
  return (
    <>
      <PageHeader 
        title="10-11-ci siniflər üçün kurslar" 
        description="Universitet qəbul imtahanlarına tam hazırlıq və peşəkar yönümlü tədris"
      />
      
      <Section>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-dark mb-4">Kurs haqqında</h3>
            <p className="text-gray-medium mb-4">
              10-11-ci sinif şagirdləri üçün nəzərdə tutulan bu kurs, universitet qəbul 
              imtahanlarına sistemli və hərtərəfli hazırlıq məqsədi daşıyır.
            </p>
            <p className="text-gray-medium">
              Proqram Dövlət İmtahan Mərkəzinin tələblərinə tam uyğun hazırlanmışdır və 
              şagirdlərin arzuladıqları universitetə qəbul olması üçün lazım olan bütün 
              bilik və bacarıqları əhatə edir.
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

        <div className="bg-gradient-to-r from-brand-red/5 to-brand-red/10 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-brand-red/20 flex items-center justify-center flex-shrink-0">
              <Target className="text-brand-red" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-dark mb-2">Qəbul imtahanı məqsədi</h4>
              <p className="text-gray-medium">
                Kursun əsas məqsədi şagirdləri universitet qəbul imtahanına tam hazırlamaqdır. 
                Hər bir şagirdin seçdiyi ixtisas qrupuna uyğun fənnlər üzrə dərinləşdirilmiş 
                tədris həyata keçirilir.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-dark mb-6">İxtisas qrupları</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {groups.map((group) => (
            <Card key={group.id} className="p-6 border-l-4 border-l-brand-red">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold">
                  {group.id}
                </div>
                <h4 className="text-lg font-bold text-gray-dark">{group.name}</h4>
              </div>
              <p className="text-sm text-gray-medium mb-2">
                <span className="font-semibold">Fənnlər:</span> {group.subjects}
              </p>
              <p className="text-sm text-gray-medium">
                <span className="font-semibold">Universitetlər:</span> {group.universities}
              </p>
            </Card>
          ))}
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

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Award className="text-green-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Uğur nisbəti</h4>
            <p className="text-3xl font-bold text-green-600 mb-2">98%</p>
            <p className="text-sm text-gray-medium">Məzunlarımızın qəbul nisbəti</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Qrup ölçüsü</h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">6-10</p>
            <p className="text-sm text-gray-medium">Maksimal fərdi yanaşma</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-purple-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Kurs müddəti</h4>
            <p className="text-3xl font-bold text-purple-600 mb-2">2 il</p>
            <p className="text-sm text-gray-medium">Tam hazırlıq dövrü</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Star className="text-yellow-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Orta bal</h4>
            <p className="text-3xl font-bold text-yellow-600 mb-2">650+</p>
            <p className="text-sm text-gray-medium">Məzunlarımızın orta balı</p>
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