'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Briefcase, CheckCircle } from 'lucide-react'

export default function VacancyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    specialty: '',
    department: '',
    branch: '',
    birthDate: '',
    phone: '',
    email: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      <PageHeader 
        title="Vakansiya" 
        description="Komandamıza qoşulun və gələcək nəsillərin təhsilində rol oynayın"
      />
      
      <Section>
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-brand-red-light p-3 rounded-full">
                <Briefcase className="text-brand-red" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-dark mb-3">
                  Müəllim və mentor axtarışı
                </h2>
                <p className="text-gray-medium leading-relaxed">
                  Azəri Hazırlıq Kursları peşəkar müəllim və mentorlar axtarır. 
                  Əgər siz təhsilə həvəsli, təcrübəli və tələbələrə öz biliklərini ötürməkdə 
                  maraqlısınızsa, bizim komandamıza qoşulun.
                </p>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-gray-dark">Tələblər:</h3>
                  <ul className="list-disc list-inside text-gray-medium space-y-1">
                    <li>Ali təhsil (müvafiq ixtisas üzrə)</li>
                    <li>Təcrübə (minimum 2 il)</li>
                    <li>Yaxşı kommunikasiya bacarıqları</li>
                    <li>Müasir təhsil metodlarına bələdlik</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-dark mb-6">
              Müraciət forması
            </h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-2">
                  Müraciətiniz qəbul edildi!
                </h3>
                <p className="text-gray-medium">
                  Tezliklə sizinlə əlaqə saxlanılacaq.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Ad"
                    placeholder="Adınız"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Soyad"
                    placeholder="Soyadınız"
                    required
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="İxtisas"
                    options={[
                      { value: '', label: 'İxtisas seçin' },
                      { value: 'riyaziyyat', label: 'Riyaziyyat' },
                      { value: 'fizika', label: 'Fizika' },
                      { value: 'kimya', label: 'Kimya' },
                      { value: 'biologiya', label: 'Biologiya' },
                      { value: 'azərbaycan-dili', label: 'Azərbaycan dili' },
                      { value: 'ingilis-dili', label: 'İngilis dili' },
                      { value: 'tarix', label: 'Tarix' },
                      { value: 'coğrafiya', label: 'Coğrafiya' }
                    ]}
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                  <Select
                    label="Şöbə"
                    options={[
                      { value: '', label: 'Şöbə seçin' },
                      { value: 'riyazi', label: 'Riyazi şöbə' },
                      { value: 'humanitar', label: 'Humanitar şöbə' },
                      { value: 'təbiət', label: 'Təbiət şöbəsi' }
                    ]}
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="Filial"
                    options={[
                      { value: '', label: 'Filial seçin' },
                      { value: 'sumqayit', label: 'Sumqayıt filialı' },
                      { value: 'baku', label: 'Bakı filialı' }
                    ]}
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  />
                  <Input
                    label="Doğum tarixi"
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Telefon"
                    type="tel"
                    placeholder="+994 XX XXX XX XX"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    CV yüklə (PDF, DOC, DOCX)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Göndər
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Section>
    </>
  )
}
