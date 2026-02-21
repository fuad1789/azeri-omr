'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Section from '@/components/ui/Section'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import PageHeader from '@/components/ui/PageHeader'
import TestResultDisplay from '@/components/TestResultDisplay'
import { CheckCircle, Calendar, Clock, Users, Award, Search, Loader2 } from 'lucide-react'

interface FormOption {
  value: string
  label: string
}

interface FormOptions {
  sinaq: FormOption[]
  sinif: FormOption[]
  qrup: FormOption[]
  bolme: FormOption[]
}

export default function SinaqImtahaniPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    phone: '',
    email: '',
    class: '',
    department: '',
    examDate: '',
    previousScore: ''
  })

  const [resultFormData, setResultFormData] = useState({
    sinaq: '',
    sinif: '',
    qrup: '',
    bolme: '',
    isNomresi: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [error, setError] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'register' | 'results'>('results')
  const [formOptions, setFormOptions] = useState<FormOptions>({
    sinaq: [],
    sinif: [],
    qrup: [],
    bolme: []
  })

  // Fetch form options from azeri.edu.az on component mount
  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        setLoadingOptions(true)
        const response = await fetch('/api/get-form-options')
        const data = await response.json()
        
        if (data.success && data.options) {
          setFormOptions(data.options)
        }
      } catch (err) {
        console.error('Error loading form options:', err)
        // Fallback options will be used from API
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchFormOptions()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic here
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleResultFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setResultFormData({
      ...resultFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleCheckResult = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTestResult(null)

    try {
      const response = await fetch('/api/check-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Xəta baş verdi')
      }

      setTestResult(data)
    } catch (err: any) {
      setError(err.message || 'Nəticə yoxlanarkən xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  const examDates = [
    { value: '', label: 'Tarix seçin' },
    { value: '2024-01-15', label: '15 Yanvar 2024' },
    { value: '2024-02-15', label: '15 Fevral 2024' },
    { value: '2024-03-15', label: '15 Mart 2024' },
    { value: '2024-04-15', label: '15 Aprel 2024' }
  ]

  const benefits = [
    {
      icon: <Award size={32} />,
      title: 'Real imtahan şəraiti',
      description: 'Həqiqi imtahan mühitində özünüzü sınayın'
    },
    {
      icon: <Clock size={32} />,
      title: 'Vaxt idarəetməsi',
      description: 'Zaman məhdudiyyətində sualları cavablandırma bacarığı'
    },
    {
      icon: <Users size={32} />,
      title: 'Detallı analiz',
      description: 'Güclü və zəif tərəflərinizin ətraflı təhlili'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Peşəkar qiymətləndirmə',
      description: 'Təcrübəli müəllimlər tərəfindən nəticələrin təhlili'
    }
  ]

  // If test result is displayed, show only the result
  if (testResult) {
    return (
      <Section>
        <TestResultDisplay 
          result={testResult} 
          onClose={() => setTestResult(null)}
        />
      </Section>
    )
  }

  return (
    <>
      <PageHeader
        title="Sınaq İmtahanı"
        description="İmtahan nəticələrinizi yoxlayın və ya sınaq imtahanına yazılın"
      />

      {/* Tab Navigation */}
      <Section background="gray">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                activeTab === 'results'
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Search className="inline-block mr-2" size={20} />
              Nəticəni Yoxla
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="inline-block mr-2" size={20} />
              Qeydiyyat
            </button>
          </div>

          {/* Results Check Form */}
          {activeTab === 'results' && (
            <Card className="p-8 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-dark mb-2">Nəticə sorğusu</h2>
                <p className="text-gray-medium">
                  İmtahan nəticələrinizi yoxlamaq üçün aşağıdakı məlumatları daxil edin
                </p>
              </div>

              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Nəticə sorğusu
                </h4>
                <ul className="text-sm text-pink-800 space-y-1 ml-6 list-disc">
                  <li>İmtahan nəticələri 24 saat ərzində yayımlanır</li>
                  <li>İş nömrənizi düzgün daxil etdiyinizdən əmin olun</li>
                  <li>Suallarınız üçün bizimlə əlaqə saxlayın</li>
                </ul>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                  <p className="text-red-800 font-semibold">{error}</p>
                </div>
              )}

              {loadingOptions && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center gap-3">
                  <Loader2 className="animate-spin text-blue-600" size={20} />
                  <p className="text-blue-800">Seçimlər azeri.edu.az saytından yüklənir...</p>
                </div>
              )}

              <form onSubmit={handleCheckResult} className="space-y-6">
                {/* İmtahan seçimi - tam genişlik */}
                <Select
                  label="İmtahan"
                  name="sinaq"
                  options={[
                    { value: '', label: 'İmtahan seçin' },
                    ...formOptions.sinaq
                  ]}
                  value={resultFormData.sinaq}
                  onChange={handleResultFormChange}
                  required
                  disabled={loadingOptions}
                />

                {/* Sinif və Qrup */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Select
                    label="Sinif"
                    name="sinif"
                    options={[
                      { value: '', label: 'Sinif seçin' },
                      ...formOptions.sinif
                    ]}
                    value={resultFormData.sinif}
                    onChange={handleResultFormChange}
                    required
                    disabled={loadingOptions}
                  />
                  <Select
                    label="Qrup"
                    name="qrup"
                    options={[
                      { value: '', label: 'Qrup seçin' },
                      ...formOptions.qrup
                    ]}
                    value={resultFormData.qrup}
                    onChange={handleResultFormChange}
                    required
                    disabled={loadingOptions}
                  />
                  <Select
                    label="Şöbə"
                    name="bolme"
                    options={[
                      { value: '', label: 'Şöbə seçin' },
                      ...formOptions.bolme
                    ]}
                    value={resultFormData.bolme}
                    onChange={handleResultFormChange}
                    required
                    disabled={loadingOptions}
                  />
                </div>

                <Input
                  label="İş nömrəsi"
                  name="isNomresi"
                  placeholder="İş nömrənizi daxil edin"
                  value={resultFormData.isNomresi}
                  onChange={handleResultFormChange}
                  required
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="inline-block mr-2 animate-spin" size={20} />
                      Yoxlanılır...
                    </>
                  ) : (
                    <>
                      <Search className="inline-block mr-2" size={20} />
                      Nəticəni Yoxla
                    </>
                  )}
                </Button>
              </form>
            </Card>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <Card className="p-8 shadow-lg">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-dark mb-2">Qeydiyyat formu</h2>
                <p className="text-gray-medium">
                  Aşağıdakı formu dolduraraq sınaq imtahanına qeydiyyatdan keçin
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">Qeydiyyat uğurla tamamlandı!</h3>
                    <p className="text-sm text-green-700">
                      Tezliklə sizinlə əlaqə saxlanılacaq. Təşəkkürlər!
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-dark mb-4 pb-2 border-b border-gray-200">
                    Şəxsi məlumatlar
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      label="Ad"
                      name="firstName"
                      placeholder="Adınızı daxil edin"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Soyad"
                      name="lastName"
                      placeholder="Soyadınızı daxil edin"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Ata adı"
                      name="fatherName"
                      placeholder="Ata adınızı daxil edin"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-dark mb-4 pb-2 border-b border-gray-200">
                    Əlaqə məlumatları
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Telefon nömrəsi"
                      name="phone"
                      type="tel"
                      placeholder="+994 XX XXX XX XX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="E-mail"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-dark mb-4 pb-2 border-b border-gray-200">
                    Təhsil məlumatları
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      label="Sinif"
                      name="class"
                      options={[
                        { value: '', label: 'Sinif seçin' },
                        { value: '9', label: '9-cu sinif' },
                        { value: '10', label: '10-cu sinif' },
                        { value: '11', label: '11-ci sinif' }
                      ]}
                      value={formData.class}
                      onChange={handleChange}
                      required
                    />
                    <Select
                      label="Şöbə"
                      name="department"
                      options={[
                        { value: '', label: 'Şöbə seçin' },
                        { value: 'riyazi', label: 'Riyazi' },
                        { value: 'humanitar', label: 'Humanitar' }
                      ]}
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Exam Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-dark mb-4 pb-2 border-b border-gray-200">
                    İmtahan məlumatları
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      label="İmtahan tarixi"
                      name="examDate"
                      options={examDates}
                      value={formData.examDate}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Əvvəlki sınaq balı (varsa)"
                      name="previousScore"
                      type="number"
                      placeholder="Balınızı daxil edin"
                      value={formData.previousScore}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Calendar size={18} />
                    Vacib qeydlər
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                    <li>İmtahan günü 30 dəqiqə əvvəl gəlməlisiniz</li>
                    <li>Yanınızda şəxsiyyət vəsiqəsi olmalıdır</li>
                    <li>İmtahan müddəti 3 saatdır</li>
                    <li>Nəticələr 24 saat ərzində elan olunacaq</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Qeydiyyatdan keç
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="flex-1">
                    Formu təmizlə
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-dark mb-4">
            Sınaq imtahanının üstünlükləri
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Sınaq imtahanları real imtahana hazırlığın ən effektiv yoludur
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 bg-white border border-gray-100 hover:border-brand-red transition-all">
              <div className="text-brand-red mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-bold text-gray-dark mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-medium leading-relaxed">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
