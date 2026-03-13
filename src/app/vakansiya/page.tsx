'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Briefcase, CheckCircle } from 'lucide-react'

interface Vacancy {
  _id: string
  title: string
  description: string
  requirements: string[]
  department: string
  branch: string
  isActive: boolean
  displayOrder: number
}

export default function VacancyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    specialty: '',
    department: '',
    branch: '',
    birthDate: '',
    phone: '',
    email: '',
    cvUrl: ''
  })

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vacancies')
      const data = await res.json()
      if (data.success) {
        setVacancies(data.data)
        if (data.data.length > 0 && !selectedVacancyId) {
          setSelectedVacancyId(data.data[0]._id)
        }
      }
    } catch (error) {
      console.error('Vakansiyalar alınmadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVacancyId) {
      alert('Zəhmət olmasa vakansiya seçin')
      return
    }
    
    setSubmitting(true)
    try {
      const res = await fetch('/api/vacancy-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacancyId: selectedVacancyId,
          ...formData
        })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          surname: '',
          specialty: '',
          department: '',
          branch: '',
          birthDate: '',
          phone: '',
          email: '',
          cvUrl: ''
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert(data.error || 'Müraciət göndərilmədi')
      }
    } catch (error) {
      console.error('Müraciət göndərilmədi:', error)
      alert('Müraciət göndərilmədi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader 
        title="Vakansiya" 
        description="Komandamıza qoşulun və gələcək nəsillərin təhsilində rol oynayın"
      />
      
      <Section>
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-2">Vakansiyalar yüklənir...</p>
            </div>
          ) : vacancies.length === 0 ? (
            <Card className="p-8 mb-8 text-center">
              <p className="text-gray-500">Hazırda aktiv vakansiya yoxdur</p>
            </Card>
          ) : (
            vacancies.map((vacancy) => (
              <Card key={vacancy._id} className="p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-brand-red-light p-3 rounded-full">
                    <Briefcase className="text-brand-red" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-dark mb-3">
                      {vacancy.title}
                    </h2>
                    <p className="text-gray-medium leading-relaxed mb-4">
                      {vacancy.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {vacancy.department}
                      </span>
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {vacancy.branch}
                      </span>
                    </div>
                    {vacancy.requirements && vacancy.requirements.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h3 className="font-semibold text-gray-dark">Tələblər:</h3>
                        <ul className="list-disc list-inside text-gray-medium space-y-1">
                          {vacancy.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}

          {vacancies.length > 0 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-dark mb-6">
                Müraciət forması
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Vakansiya seçin *
                </label>
                <select
                  value={selectedVacancyId}
                  onChange={(e) => setSelectedVacancyId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                  required
                >
                  {vacancies.map((vacancy) => (
                    <option key={vacancy._id} value={vacancy._id}>
                      {vacancy.title} - {vacancy.department}
                    </option>
                  ))}
                </select>
              </div>
              
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

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? 'Göndərilir...' : 'Göndər'}
                  </Button>
                </form>
              )}
            </Card>
          )}
        </div>
      </Section>
    </>
  )
}