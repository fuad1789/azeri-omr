import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { Play } from 'lucide-react'

const videos = [
  {
    title: 'Mərkəzimizin tanıtımı',
    duration: '3:45',
    views: '1.2K'
  },
  {
    title: 'Tələbə rəyləri',
    duration: '5:20',
    views: '850'
  },
  {
    title: 'Müəllim heyətimiz',
    duration: '4:15',
    views: '920'
  },
  {
    title: 'Məzuniyyət mərasimi 2024',
    duration: '12:30',
    views: '2.1K'
  },
  {
    title: 'Sinif otaqlarımız',
    duration: '2:50',
    views: '680'
  },
  {
    title: 'Uğur hekayələri',
    duration: '8:40',
    views: '1.5K'
  },
  {
    title: 'Açıq dərs - Riyaziyyat',
    duration: '15:20',
    views: '3.2K'
  },
  {
    title: 'Seminar - Universitet seçimi',
    duration: '25:10',
    views: '1.8K'
  },
  {
    title: 'Tələbə fəaliyyətləri',
    duration: '6:30',
    views: '950'
  }
]

export default function VideoGalleryPage() {
  return (
    <>
      <PageHeader 
        title="Video Qalereya" 
        description="Mərkəzimizdən video görüntülər"
      />
      
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Card key={index} hover className="overflow-hidden cursor-pointer group">
              <div className="relative h-48 bg-gray-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-brand-red-dark/20"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/90 rounded-full mb-2 group-hover:scale-110 transition-transform">
                    <Play className="text-brand-red ml-1" size={28} />
                  </div>
                  <p className="text-white text-sm font-medium">{video.duration}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-dark mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-medium">
                  {video.views} baxış
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
