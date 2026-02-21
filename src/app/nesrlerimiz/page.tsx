import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { BookOpen } from 'lucide-react'

const publications = [
  {
    title: 'Riyaziyyat - Universitet hazırlıq',
    description: 'Universitet qəbul imtahanlarına hazırlıq üçün tam bələdçi',
    year: 2024,
    pages: 450
  },
  {
    title: 'Fizika - Test toplusu',
    description: '1000+ test sualı və həlli ilə',
    year: 2024,
    pages: 320
  },
  {
    title: 'Kimya - Praktiki məşğələlər',
    description: 'Laboratoriya işləri və təcrübələr',
    year: 2023,
    pages: 280
  },
  {
    title: 'Azərbaycan dili - Qrammatika',
    description: 'Tam qrammatika qaydaları və testlər',
    year: 2023,
    pages: 350
  },
  {
    title: 'İngilis dili - Lüğət',
    description: 'İmtahan üçün vacib 5000 söz',
    year: 2024,
    pages: 200
  },
  {
    title: 'Biologiya - Ümumi bələdçi',
    description: 'Botanika, zoologiya və insan anatomiyası',
    year: 2023,
    pages: 400
  }
]

export default function PublicationsPage() {
  return (
    <>
      <PageHeader 
        title="Nəşrlərimiz" 
        description="Mərkəzimiz tərəfindən hazırlanmış dərs vəsaitləri və kitablar"
      />
      
      <Section>
        <div className="text-center mb-12">
          <p className="text-lg text-gray-medium max-w-3xl mx-auto">
            Təcrübəli müəllimlərimiz tərəfindən hazırlanmış dərs vəsaitləri tələbələrimizin 
            imtahanlara daha yaxşı hazırlaşmasına kömək edir.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((pub, index) => (
            <Card key={index} hover className="overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center">
                <BookOpen className="text-white" size={80} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-dark mb-2">{pub.title}</h3>
                <p className="text-gray-medium mb-4">{pub.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-medium">
                  <span>{pub.year}</span>
                  <span>{pub.pages} səhifə</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-dark mb-4">
              Kitablarımızı əldə edin
            </h3>
            <p className="text-gray-medium mb-6">
              Nəşrlərimiz mərkəzimizdə və ya onlayn sifariş yolu ilə əldə edilə bilər.
            </p>
            <p className="text-brand-red font-semibold">
              Ətraflı məlumat üçün: +994 12 345 67 89
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
