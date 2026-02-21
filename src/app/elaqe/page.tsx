'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { MapPin, Phone, Mail, Globe, MessageCircle, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 5000)
  }

  return (
    <>
      <PageHeader 
        title="Əlaqə" 
        description="Bizimlə əlaqə saxlayın və suallarınızı verin"
      />
      
      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-dark mb-6">
              Əlaqə məlumatları
            </h2>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-red-light p-3 rounded-full">
                    <MapPin className="text-brand-red" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-2">Ünvan</h3>
                    <p className="text-gray-medium">
                      Sumqayıt şəhəri, 13-cü mkr., Niyazi küç.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-red-light p-3 rounded-full">
                    <Phone className="text-brand-red" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-2">Telefon</h3>
                    <p className="text-gray-medium mb-1">+994 12 345 67 89</p>
                    <p className="text-gray-medium">+994 50 123 45 67</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-red-light p-3 rounded-full">
                    <MessageCircle className="text-brand-red" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-2">WhatsApp</h3>
                    <a 
                      href="https://wa.me/994501234567" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-red hover:underline"
                    >
                      +994 50 123 45 67
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-red-light p-3 rounded-full">
                    <Mail className="text-brand-red" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-2">E-mail</h3>
                    <a 
                      href="mailto:info@azerikurslari.edu.az"
                      className="text-brand-red hover:underline"
                    >
                      info@azerikurslari.edu.az
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-red-light p-3 rounded-full">
                    <Globe className="text-brand-red" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-2">Vebsayt</h3>
                    <a 
                      href="https://www.azerikurslari.edu.az"
                      className="text-brand-red hover:underline"
                    >
                      www.azerikurslari.edu.az
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-dark mb-6">
              Mesaj göndərin
            </h2>
            
            <Card className="p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-dark mb-2">
                    Mesajınız göndərildi!
                  </h3>
                  <p className="text-gray-medium">
                    Tezliklə sizinlə əlaqə saxlanılacaq.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Ad Soyad"
                    placeholder="Adınız və soyadınız"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  
                  <Textarea
                    label="Mesaj"
                    placeholder="Mesajınızı buraya yazın..."
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  
                  <Button type="submit" size="lg" className="w-full">
                    Göndər
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}
