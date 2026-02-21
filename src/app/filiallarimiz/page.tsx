'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { MapPin, Phone, Mail, Clock, Users, Award, Navigation } from 'lucide-react'

export default function FiliallarimizPage() {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)

  const branches = [
    {
      id: 1,
      name: 'Nəsimi filialı',
      address: 'Nəsimi rayonu, Azadlıq prospekti 12',
      phone: '+994 12 XXX XX XX',
      email: 'nesimi@azerikurslari.edu.az',
      workingHours: 'Bazar ertəsi - Şənbə: 09:00 - 20:00',
      students: '500+',
      teachers: '15',
      classrooms: '8',
      features: ['Kompüter sinifləri', 'Kitabxana', 'Konfrans zalı', 'Kantin'],
      mapLink: 'https://maps.google.com',
      image: '/images/branch1.jpg'
    },
 
    {
      id: 5,
      name: 'Sumqayıt filialı',
      address: 'Sumqayıt şəhəri, 1-ci mikrorayon',
      phone: '+994 18 XXX XX XX',
      email: 'sumqayit@azerikurslari.edu.az',
      workingHours: 'Bazar ertəsi - Şənbə: 09:00 - 20:00',
      students: '300+',
      teachers: '8',
      classrooms: '5',
      features: ['Kompüter sinifləri', 'Kitabxana', 'Konfrans zalı', 'Wi-Fi'],
      mapLink: 'https://maps.google.com',
      image: '/images/branch5.jpg'
    },
    {
      id: 6,
      name: 'Gəncə filialı',
      address: 'Gəncə şəhəri, Heydər Əliyev prospekti 89',
      phone: '+994 22 XXX XX XX',
      email: 'gence@azerikurslari.edu.az',
      workingHours: 'Bazar ertəsi - Şənbə: 09:00 - 20:00',
      students: '280+',
      teachers: '8',
      classrooms: '5',
      features: ['İnteraktiv lövhələr', 'Kitabxana', 'Kantin', 'Parkinq'],
      mapLink: 'https://maps.google.com',
      image: '/images/branch6.jpg'
    }
  ]

  const stats = [
    { number: '3', label: 'Filial', icon: <MapPin size={24} /> },
    { number: '2500+', label: 'Tələbə', icon: <Users size={24} /> },
    { number: '63', label: 'Müəllim', icon: <Award size={24} /> },
    { number: '36', label: 'Sinif otağı', icon: <Clock size={24} /> }
  ]

  return (
    <>
      <PageHeader
        title="Filiallarımız"
        description="Azərbaycanın müxtəlif bölgələrində yerləşən filiallarımız"
      />

      {/* Stats Section */}
      <Section background="gray">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-white text-center hover:shadow-lg transition-all">
              <div className="text-brand-red mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-dark mb-1">{stat.number}</div>
              <div className="text-sm text-gray-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Branches Grid */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-dark mb-4">
            Filiallarımızın siyahısı
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Sizə ən yaxın filialı seçin və bizimlə əlaqə saxlayın
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <Card 
              key={branch.id} 
              className={`p-6 hover:shadow-xl transition-all cursor-pointer ${
                selectedBranch === branch.id ? 'border-2 border-brand-red' : 'border border-gray-200'
              }`}
              onClick={() => setSelectedBranch(branch.id)}
            >
              {/* Branch Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-dark mb-2">{branch.name}</h3>
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                  <MapPin size={16} className="flex-shrink-0 mt-1 text-brand-red" />
                  <span>{branch.address}</span>
                </div>
              </div>

              {/* Branch Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-red">{branch.students}</div>
                  <div className="text-xs text-gray-500">Tələbə</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-red">{branch.teachers}</div>
                  <div className="text-xs text-gray-500">Müəllim</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-red">{branch.classrooms}</div>
                  <div className="text-xs text-gray-500">Sinif</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-brand-red" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-brand-red" />
                  <span className="truncate">{branch.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} className="text-brand-red" />
                  <span>{branch.workingHours}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-dark mb-2">İmkanlar:</h4>
                <div className="flex flex-wrap gap-2">
                  {branch.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-brand-red/10 text-brand-red px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(branch.mapLink, '_blank')
                }}
              >
                <Navigation size={16} className="mr-2" />
                Xəritədə bax
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section background="gray">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="p-8 bg-gradient-to-br from-brand-red/5 to-brand-red/10 border-brand-red/20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-dark mb-4">
              Sizə uyğun filialı tapa bilmirsiniz?
            </h2>
            <p className="text-lg text-gray-medium mb-6">
              Bizimlə əlaqə saxlayın, sizə ən yaxın filialı təklif edək
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Phone size={20} className="mr-2" />
                Zəng edin
              </Button>
              <Button variant="outline" size="lg">
                <Mail size={20} className="mr-2" />
                Mesaj göndərin
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* Additional Info */}
      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border border-gray-200">
            <div className="text-brand-red mb-3">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-dark mb-2">İş saatları</h3>
            <p className="text-sm text-gray-600">
              Bütün filiallarımız həftənin 6 günü, 09:00-dan 20:00-dək açıqdır
            </p>
          </Card>
          <Card className="p-6 bg-white border border-gray-200">
            <div className="text-brand-red mb-3">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-dark mb-2">Kiçik qruplar</h3>
            <p className="text-sm text-gray-600">
              Hər qrupda maksimum 12 tələbə, fərdi yanaşma və keyfiyyətli təhsil
            </p>
          </Card>
          <Card className="p-6 bg-white border border-gray-200">
            <div className="text-brand-red mb-3">
              <Award size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-dark mb-2">Müasir avadanlıq</h3>
            <p className="text-sm text-gray-600">
              Bütün filiallarımızda müasir texnologiya və təhsil materialları
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
