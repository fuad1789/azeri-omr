'use client'

import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Book, Clock, Users, CheckCircle, Zap, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const subjects = [
  {
    id: 1,
    name: 'Azərbaycan dili - Intensiv',
    hours: 24,
    lessons: 12,
    teacher: 'Elmira Qasımova',
    description: 'Əsas mövzuların sürətli təkrarı. Test texnikaları. İmtahan strategiyaları.'
  },
  {
    id: 2,
    name: 'Riyaziyyat - Intensiv',
    hours: 32,
    lessons: 16,
    teacher: 'Murad Əliyev',
    description: 'Əsas formullar və qaydalar. Tipik məsələlərin həlli. Sürətli hesablama üsulları.'
  },
  {
    id: 3,
    name: 'İngilis dili - Intensiv',
    hours: 24,
    lessons: 12,
    teacher: 'Sevda Məmmədova',
    description: 'Əsas qrammatika qaydaları. Lügət ehtiyatının artırılması. Test oxuma texnikaları.'
  },
  {
    id: 4,
    name: 'Ümumi təkrar',
    hours: 16,
    lessons: 8,
    teacher: 'Bütün müəllimlər',
    description: 'Bütün fənnlər üzrə ümumi təkrar. Sınaq imtahanları. Səhv analizi.'
  }
]

const features = [
  '3 ayda tam hazırlıq',
  'Gündə 4 saat intensiv dərslər',
  'Həftədə 2 sınaq imtahanı',
  'Fərdi səhv analizi',
  'Test həlli texnikaları',
  'Psixoloji hazırlıq',
  'Həftə sonu məsləhət saatları',
  'Onlayn dəstək'
]

const schedule = [
  { day: 'Bazar ertəsi', time: '09:00 - 11:00', subject: 'Riyaziyyat' },
  { day: 'Bazar ertəsi', time: '11:30 - 13:30', subject: 'Azərbaycan dili' },
  { day: 'Bazar ertəsi', time: '15:00 - 17:00', subject: 'İngilis dili' },
  { day: 'Çərşənbə axşamı', time: '09:00 - 11:00', subject: 'Riyaziyyat' },
  { day: 'Çərşənbə axşamı', time: '11:30 - 13:30', subject: 'Azərbaycan dili' },
  { day: 'Çərşənbə', time: '09:00 - 11:00', subject: 'Riyaziyyat' },
  { day: 'Çərşənbə', time: '11:30 - 13:30', subject: 'İngilis dili' },
  { day: 'Çərşənbə', time: '15:00 - 17:00', subject: 'Ümumi təkrar' },
  { day: 'Cümə axşamı', time: '09:00 - 11:00', subject: 'Riyaziyyat' },
  { day: 'Cümə axşamı', time: '11:30 - 13:30', subject: 'Azərbaycan dili' },
  { day: 'Cümə', time: '09:00 - 11:00', subject: 'Sınaq imtahanı' },
  { day: 'Cümə', time: '11:30 - 13:30', subject: 'Səhv analizi' }
]

const phases = [
  {
    phase: 'I Mərhələ',
    duration: '4 həftə',
    title: 'Əsas biliklərin bərpası',
    description: 'Unudulmuş mövzuların təkrarı, əsas qaydaların xatırlanması'
  },
  {
    phase: 'II Mərhələ',
    duration: '4 həftə',
    title: 'Mövzuların dərinləşdirilməsi',
    description: 'Hər fənn üzrə əsas mövzuların detallı öyrənilməsi'
  },
  {
    phase: 'III Mərhələ',
    duration: '4 həftə',
    title: 'Test texnikaları və təkrar',
    description: 'İmtahan formatında testlər, zaman menecmenti, səhv analizi'
  }
]

export default function ExpressCoursePage() {
  return (
    <>
      <PageHeader 
        title="Ekspress-kurs" 
        description="Qısa müddətdə intensiv hazırlıq - 3 ayda imtahana tam hazır olun"
      />
      
      <Section>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-dark mb-4">Kurs haqqında</h3>
            <p className="text-gray-medium mb-4">
              Ekspress-kurs imtahana qısa müddətdə hazırlaşmaq istəyən şagirdlər üçün 
              nəzərdə tutulmuş intensiv proqramdır. 3 ay ərzində gündə 4 saatlıq dərslər 
              sayəsində şagirdlər imtahana tam hazır olurlar.
            </p>
            <p className="text-gray-medium">
              Bu kurs xüsusilə 11-ci sinif məzunları və imtahana son anda hazırlaşan 
              şagirdlər üçün idealdır.
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

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Zap className="text-yellow-600" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-dark mb-2">Niyə ekspress-kurs?</h4>
              <p className="text-gray-medium">
                Ekspress-kurs sayəsində şagirdlər qısa müddətdə maksimum nəticə əldə edirlər. 
                İntensiv proqram, təcrübəli müəllimlər və fərdi yanaşma sayəsində 3 ay ərzində 
                imtahan ballarınızı 200-300 xal artıra bilərsiniz.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-dark mb-6">Tədris mərhələləri</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {phases.map((phase, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h4 className="text-lg font-bold text-gray-dark">{phase.phase}</h4>
              </div>
              <p className="text-sm text-brand-red font-medium mb-2">{phase.duration}</p>
              <h5 className="font-bold text-gray-dark mb-2">{phase.title}</h5>
              <p className="text-sm text-gray-medium">{phase.description}</p>
            </Card>
          ))}
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
              <TrendingUp className="text-green-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Bal artımı</h4>
            <p className="text-3xl font-bold text-green-600 mb-2">200-300</p>
            <p className="text-sm text-gray-medium">Orta bal artımı 3 ayda</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Qrup ölçüsü</h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">4-8</p>
            <p className="text-sm text-gray-medium">Çox kiçik qruplar</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-yellow-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Müddət</h4>
            <p className="text-3xl font-bold text-yellow-600 mb-2">3 ay</p>
            <p className="text-sm text-gray-medium">İntensiv hazırlıq</p>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-brand-red/5 to-brand-red/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-dark mb-4">Qeydiyyatdan keçin</h3>
          <p className="text-gray-medium mb-6 max-w-2xl mx-auto">
            Ekspress-kurs haqqında ətraflı məlumat almaq və qeydiyyatdan keçmək üçün 
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