'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { Award } from 'lucide-react'

interface SuccessStory {
  _id: string
  name: string
  university: string
  faculty: string
  score: number
  year: number
  department: string
  image: string
  isActive: boolean
  displayOrder: number
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/success-stories')
      const data = await res.json()
      if (data.success) {
        setStories(data.data)
      }
    } catch (error) {
      console.error('Uğur hekayələri alınmadı:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader 
        title="Fəxrlərimiz" 
        description="Uğurlu məzunlarımız və onların nailiyyətləri"
      />
      
      <Section>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-2">Uğur hekayələri yüklənir...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Hazırda uğur hekayəsi əlavə edilməyib</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="text-lg text-gray-medium max-w-3xl mx-auto">
                Mərkəzimizdə təhsil alan tələbələrimizin əldə etdikləri uğurlar bizim ən böyük fəxrimizdir. 
                Hər il yüzlərlə tələbəmiz arzuladıqları universitetlərə qəbul olur.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story._id} hover className="p-6">
                  <div className="flex items-start gap-4">
                    {story.image ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="bg-brand-red-light p-3 rounded-full flex-shrink-0">
                        <Award className="text-brand-red" size={24} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-dark mb-2">{story.name}</h3>
                      <p className="text-sm text-gray-medium mb-3">{story.university}</p>
                      {story.faculty && <p className="text-xs text-gray-500 mb-2">{story.faculty}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-brand-red font-bold text-lg">{story.score} bal</span>
                        <span className="text-sm text-gray-medium">{story.year}</span>
                      </div>
                      {story.department && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                          {story.department}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  )
}