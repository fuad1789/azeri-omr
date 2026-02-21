'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Calendar, ChevronRight } from 'lucide-react'

const newsData = [
  {
    id: 1,
    title: 'Yeni tədris ili qeydiyyatı başladı',
    date: '2024-08-15',
    excerpt: '2024-2025 tədris ili üçün qeydiyyat prosesi başlamışdır. Erkən qeydiyyat endirimi mövcuddur.',
    image: '/placeholder-news.jpg'
  },
  {
    id: 2,
    title: 'Məzunlarımızın uğurları',
    date: '2024-07-20',
    excerpt: 'Bu il məzunlarımızın 98%-i arzuladıqları universitetlərə qəbul olublar.',
    image: '/placeholder-news.jpg'
  },
  {
    id: 3,
    title: 'Yeni filial açıldı',
    date: '2024-06-10',
    excerpt: 'Bakı şəhərində yeni filialımız fəaliyyətə başladı. Müasir avadanlıq və geniş sinif otaqları.',
    image: '/placeholder-news.jpg'
  },
  {
    id: 4,
    title: 'Beynəlxalq olimpiadada uğur',
    date: '2024-05-15',
    excerpt: 'Tələbələrimiz beynəlxalq riyaziyyat olimpiadasında qızıl medal qazandılar.',
    image: '/placeholder-news.jpg'
  },
  {
    id: 5,
    title: 'Yay intensiv kursları',
    date: '2024-05-01',
    excerpt: 'Yay aylarında intensiv hazırlıq kurslarımız başlayır. Məhdud yer sayı.',
    image: '/placeholder-news.jpg'
  },
  {
    id: 6,
    title: 'Pulsuz seminar keçirildi',
    date: '2024-04-20',
    excerpt: 'Valideynlər və tələbələr üçün universitet seçimi mövzusunda pulsuz seminar təşkil edildi.',
    image: '/placeholder-news.jpg'
  }
]

export default function NewsPage() {
  const [visibleNews, setVisibleNews] = useState(6)

  const loadMore = () => {
    setVisibleNews(prev => prev + 3)
  }

  return (
    <>
      <PageHeader 
        title="Xəbərlər" 
        description="Mərkəzimizdən son xəbərlər və elanlar"
      />
      
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.slice(0, visibleNews).map((news) => (
            <Card key={news.id} hover>
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Şəkil</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-medium mb-3">
                  <Calendar size={16} />
                  <span>{new Date(news.date).toLocaleDateString('az-AZ')}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">{news.title}</h3>
                <p className="text-gray-medium mb-4">{news.excerpt}</p>
                <button className="text-brand-red font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Ətraflı
                  <ChevronRight size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
        
        {visibleNews < newsData.length && (
          <div className="text-center mt-12">
            <Button onClick={loadMore} variant="outline" size="lg">
              Daha çox
            </Button>
          </div>
        )}
      </Section>
    </>
  )
}
