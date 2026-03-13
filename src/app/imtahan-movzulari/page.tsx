'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { Book, ChevronRight, Clock, Users } from 'lucide-react'

interface ExamTopic {
  _id: string
  category: string
  title: string
  description: string
  lessons: number
  duration: string
  students: number
  slug: string
  icon: string
  color: string
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen: Book,
  Target: ChevronRight,
  GraduationCap: Book,
  Zap: ChevronRight,
  Globe: Book,
  Users: Users,
  Award: Book,
  Book: Book,
  PenTool: Book,
  Lightbulb: ChevronRight,
  Rocket: ChevronRight,
  Star: Book,
  CheckCircle: ChevronRight,
  TrendingUp: ChevronRight,
  Shield: Book,
  Brain: Book,
  Layers: Book,
  FileText: Book,
  Calculator: Book,
  Microscope: Book,
  History: Book,
  Music: Book,
  Palette: Book,
  Dumbbell: Book,
  Code: Book,
  Atom: Book,
  Languages: Book,
}

export default function ExamTopicsPage() {
  const [topics, setTopics] = useState<ExamTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Hamısı')
  const [categories, setCategories] = useState<string[]>(['Hamısı'])

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/exam-topics')
      const data = await res.json()
      if (data.success) {
        setTopics(data.data)
        // Unikal kateqoriyaları çıxar
        const uniqueCategories = ['Hamısı', ...Array.from(new Set(data.data.map((t: ExamTopic) => t.category))) as string[]]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Mövzular alınmadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTopics = selectedCategory === 'Hamısı' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory)

  return (
    <>
      <PageHeader 
        title="İmtahan Mövzuları" 
        description="Qəbul imtahanları üçün tədris mövzuları və tapşırıqlar"
      />
      
      <Section>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Kateqoriya filterləri */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-red text-white'
                      : 'bg-gray-100 text-gray-dark hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mövzular siyahısı */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredTopics.map((topic) => {
                const IconComponent = iconMap[topic.icon] || Book;
                const bgClass = colorClasses[topic.color] || 'bg-red-500';
                
                return (
                  <Link href={`/imtahan-movzulari/${topic.slug}`} key={topic._id}>
                    <Card hover className="h-full">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center`}>
                              <IconComponent className="text-white" size={16} />
                            </div>
                            <span className="text-sm font-medium text-brand-red">{topic.category}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-dark mb-3">{topic.title}</h3>
                        <p className="text-gray-medium mb-4 line-clamp-2">{topic.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-medium mb-4">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{topic.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{topic.students} tələbə</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-dark">
                            {topic.lessons} dərs
                          </span>
                          <span className="text-brand-red font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            Ətraflı
                            <ChevronRight size={18} />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-medium">Bu kateqoriyada mövzu tapılmadı.</p>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  )
}
