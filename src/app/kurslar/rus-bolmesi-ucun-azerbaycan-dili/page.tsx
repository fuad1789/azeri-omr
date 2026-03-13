'use client'

import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Book, Clock, Users, CheckCircle, Globe, MessageCircle, Award } from 'lucide-react'
import Link from 'next/link'

const modules = [
  {
    id: 1,
    name: 'Fonetika',
    hours: 16,
    lessons: 8,
    teacher: 'Zəhra Əliyeva',
    description: 'Azərbaycan səsləri, vurğu, intonasiya. Rusdilli şagirdlər üçün xüsusi təlim.'
  },
  {
    id: 2,
    name: 'Qrammatika',
    hours: 48,
    lessons: 24,
    teacher: 'Leyla Məmmədova',
    description: 'İsim, sifət, feli, cümlə quruluşu. Rus dili ilə müqayisəli təhlil.'
  },
  {
    id: 3,
    name: 'Danışıq',
    hours: 32,
    lessons: 16,
    teacher: 'Aysel Hüseynova',
    description: 'Gündəlik mövzular, dialoqlar, monoloqlar. Kommunikativ bacarıqların inkişafı.'
  },
  {
    id: 4,
    name: 'Oxu və Yazı',
    hours: 32,
    lessons: 16,
    teacher: 'Nigar Qasımova',
    description: 'Mətn analizi, esse yazma, imla qaydaları. İmtahan formatında tapşırıqlar.'
  },
  {
    id: 5,
    name: 'Test hazırlığı',
    hours: 24,
    lessons: 12,
    teacher: 'Bütün müəllimlər',
    description: 'DİM formatında testlər, test texnikaları, zaman menecmenti.'
  }
]

const features = [
  'Rusdilli şagirdlər üçün xüsusi metodika',
  'Müqayisəli dil öyrənmə',
  'Danışıq klubları',
  'Azərbaycan mədəniyyəti ilə tanışlıq',
  'Fərdi yanaşma və dəstək',
  'Müntəzəm qiymətləndirmə',
  'Valideynlərə hesabat',
  'Sertifikat proqramı'
]

const levels = [
  {
    level: 'A1 - Başlanğıc',
    duration: '2 ay',
    description: 'Əlifba, əsas sözlər, sadə cümlələr. Özünü təqdim, gündəlik mövzular.'
  },
  {
    level: 'A2 - Elementary',
    duration: '2 ay',
    description: 'Genişlənmiş lüğət, qrammatika əsasları. Gündəlik ünsiyyət bacarıqları.'
  },
  {
    level: 'B1 - Orta',
    duration: '3 ay',
    description: 'Mürəkkəb qrammatika, esse yazma. İmtahana hazırlıq başlanır.'
  },
  {
    level: 'B2 - İmtahan',
    duration: '3 ay',
    description: 'İmtahan formatında tapşırıqlar, test texnikaları. Tam hazırlıq.'
  }
]

const schedule = [
  { day: 'Bazar ertəsi', time: '15:00 - 17:00', subject: 'Qrammatika' },
  { day: 'Bazar ertəsi', time: '17:00 - 18:30', subject: 'Danışıq' },
  { day: 'Çərşənbə axşamı', time: '15:00 - 17:00', subject: 'Oxu və Yazı' },
  { day: 'Çərşənbə', time: '15:00 - 17:00', subject: 'Qrammatika' },
  { day: 'Çərşənbə', time: '17:00 - 18:30', subject: 'Fonetika' },
  { day: 'Cümə axşamı', time: '15:00 - 17:00', subject: 'Danışıq' },
  { day: 'Cümə', time: '15:00 - 17:00', subject: 'Test hazırlığı' },
  { day: 'Şənbə', time: '12:00 - 13:30', subject: 'Danışıq klubu' }
]

export default function RussianSectionPage() {
  return (
    <>
      <PageHeader 
        title="Rus bölməsi üçün Azərbaycan dili" 
        description="Rusdilli şagirdlər üçün xüsusi metodika ilə Azərbaycan dili öyrənmə kursu"
      />
      
      <Section>
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-dark mb-4">Kurs haqqında</h3>
            <p className="text-gray-medium mb-4">
              Rus bölməsi şagirdləri üçün nəzərdə tutulan bu kurs, Azərbaycan dilini 
              rus dili ilə müqayisəli şəkildə öyrətməyə yönəlib. Xüsusi metodika sayəsində 
              şagirdlər daha sürətli və effektiv öyrənirlər.
            </p>
            <p className="text-gray-medium">
              Kurs məzunlar üçün Azərbaycan dili imtahanından uğurla keçmək və 
              ali məktəblərə qəbul olmaq üçün zəruri bilikləri təmin edir.
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

        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
              <Globe className="text-pink-600" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-dark mb-2">Niyə bu kurs?</h4>
              <p className="text-gray-medium">
                Rusdilli şagirdlər üçün Azərbaycan dili xüsusi çətinliklər törədir. 
                Bizim metodika bu çətinlikləri nəzərə alaraq hazırlanmışdır. 
                Müqayisəli təhlil sayəsində şagirdlər hər iki dilin fərqlərini başa düşür və 
                daha effektiv öyrənirlər.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-dark mb-6">Səviyyələr</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {levels.map((level, index) => (
            <Card key={index} className="p-6 border-l-4 border-l-pink-500">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-gray-dark">{level.level}</h4>
                <span className="text-sm text-pink-600 font-medium bg-pink-50 px-3 py-1 rounded-full">
                  {level.duration}
                </span>
              </div>
              <p className="text-sm text-gray-medium">{level.description}</p>
            </Card>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-dark mb-6">Kurs modulları</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module) => (
            <Card key={module.id} hover>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                    <Book className="text-pink-600" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-dark">{module.name}</h4>
                </div>
                <p className="text-gray-medium mb-4 text-sm">{module.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{module.hours} saat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{module.lessons} dərs</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Müəllim: <span className="font-medium">{module.teacher}</span></p>
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
            <p className="text-3xl font-bold text-green-600 mb-2">95%</p>
            <p className="text-sm text-gray-medium">İmtahandan keçən tələbələr</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-blue-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Danışıq bacarığı</h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">B1-B2</p>
            <p className="text-sm text-gray-medium">Kurs bitirəndə səviyyə</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-pink-600" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-dark mb-2">Kurs müddəti</h4>
            <p className="text-3xl font-bold text-pink-600 mb-2">10 ay</p>
            <p className="text-sm text-gray-medium">Tam proqram</p>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-dark mb-4">Qeydiyyatdan keçin</h3>
          <p className="text-gray-medium mb-6 max-w-2xl mx-auto">
            Rus bölməsi üçün Azərbaycan dili kursu haqqında ətraflı məlumat almaq və 
            qeydiyyatdan keçmək üçün bizimlə əlaqə saxlayın və ya birbaşa müraciət edin.
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