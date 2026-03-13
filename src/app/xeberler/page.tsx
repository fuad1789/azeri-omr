'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Calendar, ChevronRight } from 'lucide-react'

interface News {
  _id: string
  title: string
  content: string
  excerpt: string
  image: string
  date: string
  category: string
  isActive: boolean
  displayOrder: number
}

export default function NewsPage() {
  const [visibleNews, setVisibleNews] = useState(6)
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/news')
      const data = await res.json()
      if (data.success) {
        setNews(data.data)
      }
    } catch (error) {
      console.error('Xəbərlər alınmadı:', error)
    } finally {
      setLoading(false)
    }
  }

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
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-2">Xəbərlər yüklənir...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Hazırda xəbər yoxdur</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, visibleNews).map((newsItem) => (
                <Card key={newsItem._id} hover>
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-lg">
                    {newsItem.image ? (
                      <img src={newsItem.image} alt={newsItem.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">Şəkil yoxdur</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-medium mb-3">
                      <Calendar size={16} />
                      <span>{new Date(newsItem.date).toLocaleDateString('az-AZ')}</span>
                      {newsItem.category && (
                        <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                          {newsItem.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-dark mb-3">{newsItem.title}</h3>
                    <p className="text-gray-medium mb-4">{newsItem.excerpt}</p>
                    <button className="text-brand-red font-medium flex items-center gap-1 hover:gap-2 transition-all">
                      Ətraflı
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
            
            {visibleNews < news.length && (
              <div className="text-center mt-12">
                <Button onClick={loadMore} variant="outline" size="lg">
                  Daha çox
                </Button>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  )
}