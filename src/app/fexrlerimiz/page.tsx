import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { Award } from 'lucide-react'

const successStories = [
  {
    name: 'Nigar Əliyeva',
    university: 'Azərbaycan Dövlət Neft və Sənaye Universiteti',
    score: 680,
    year: 2024
  },
  {
    name: 'Rəşad Məmmədov',
    university: 'Bakı Dövlət Universiteti',
    score: 695,
    year: 2024
  },
  {
    name: 'Aysel Həsənova',
    university: 'Azərbaycan Tibb Universiteti',
    score: 710,
    year: 2024
  },
  {
    name: 'Elvin Quliyev',
    university: 'Azərbaycan Dövlət İqtisad Universiteti',
    score: 665,
    year: 2024
  },
  {
    name: 'Səbinə Əhmədova',
    university: 'Azərbaycan Dillər Universiteti',
    score: 670,
    year: 2024
  },
  {
    name: 'Tural Vəliyev',
    university: 'Azərbaycan Texniki Universiteti',
    score: 685,
    year: 2024
  },
  {
    name: 'Günay Məhərrəmova',
    university: 'Bakı Slavyan Universiteti',
    score: 655,
    year: 2023
  },
  {
    name: 'Orxan Hüseynov',
    university: 'Azərbaycan Memarlıq və İnşaat Universiteti',
    score: 660,
    year: 2023
  },
  {
    name: 'Leyla Cəfərova',
    university: 'Azərbaycan Dövlət Pedaqoji Universiteti',
    score: 675,
    year: 2023
  }
]

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHeader 
        title="Fəxrlərimiz" 
        description="Uğurlu məzunlarımız və onların nailiyyətləri"
      />
      
      <Section>
        <div className="text-center mb-12">
          <p className="text-lg text-gray-medium max-w-3xl mx-auto">
            Mərkəzimizdə təhsil alan tələbələrimizin əldə etdikləri uğurlar bizim ən böyük fəxrimizdir. 
            Hər il yüzlərlə tələbəmiz arzuladıqları universitetlərə qəbul olur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} hover className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand-red-light p-3 rounded-full">
                  <Award className="text-brand-red" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-dark mb-2">{story.name}</h3>
                  <p className="text-sm text-gray-medium mb-3">{story.university}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-red font-bold text-lg">{story.score} bal</span>
                    <span className="text-sm text-gray-medium">{story.year}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
