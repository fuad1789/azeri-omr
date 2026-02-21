import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { Image } from 'lucide-react'

const photoCategories = [
  'Sinif otaqları',
  'Tədris prosesi',
  'Məzuniyyət mərasimi',
  'Seminar və təlimlər',
  'Tələbə fəaliyyətləri',
  'Müəllim heyəti',
  'Laboratoriya',
  'Kitabxana',
  'İdman tədbirləri',
  'Mükafatlandırma',
  'Ekskursiyalar',
  'Bayram tədbirləri'
]

export default function PhotoGalleryPage() {
  return (
    <>
      <PageHeader 
        title="Foto Qalereya" 
        description="Mərkəzimizdən foto görüntülər"
      />
      
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoCategories.map((category, index) => (
            <Card key={index} hover className="overflow-hidden cursor-pointer">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Image className="text-gray-400 mx-auto mb-2" size={48} />
                  <p className="text-gray-500 text-sm">Şəkil yüklənir...</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-dark text-center">
                  {category}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
