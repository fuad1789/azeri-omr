import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { Target, Users, Award, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: <Target size={32} />,
      title: 'Missiyamız',
      description: 'Tələbələrə keyfiyyətli təhsil verərək onların universitet qəbul imtahanlarında uğur qazanmalarına kömək etmək'
    },
    {
      icon: <Users size={32} />,
      title: 'Komandamız',
      description: 'Təcrübəli və peşəkar müəllim heyəti ilə hər bir tələbəyə fərdi yanaşma'
    },
    {
      icon: <Award size={32} />,
      title: 'Keyfiyyət',
      description: 'Müasir təhsil metodları və yüksək standartlar əsasında təlim prosesi'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Nəticələr',
      description: 'Hər il yüzlərlə tələbəmizin arzuladıqları universitetlərə qəbul olması'
    }
  ]

  return (
    <>
      <PageHeader 
        title="Haqqımızda" 
        description="Azəri Hazırlıq Kursları - Təhsildə keyfiyyət və uğur"
      />
      
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-dark mb-6">
              Azəri Hazırlıq Kursları haqqında
            </h2>
            
            <p className="text-gray-medium leading-relaxed mb-6">
              Azəri Hazırlıq Kursları 15 ildən artıqdır ki, tələbələrə universitet qəbul imtahanlarına 
              hazırlıq sahəsində xidmət göstərir. Biz təhsildə keyfiyyəti və nəticəni ön planda tutan, 
              müasir təhsil metodlarından istifadə edən bir mərkəzik.
            </p>
            
            <p className="text-gray-medium leading-relaxed mb-6">
              Mərkəzimizdə riyaziyyat, fizika, kimya, biologiya, Azərbaycan dili, ingilis dili, tarix 
              və coğrafiya fənləri üzrə peşəkar müəllimlər tərəfindən dərslər keçirilir. Hər bir tələbəyə 
              fərdi yanaşma və onun biliyini maksimum səviyyəyə çatdırmaq bizim əsas məqsədimizdir.
            </p>
            
            <p className="text-gray-medium leading-relaxed mb-8">
              Müasir avadanlıqla təchiz olunmuş sinif otaqlarımız, geniş kitabxanamız və rahat təhsil 
              mühitimiz tələbələrimizin effektiv şəkildə öyrənməsinə şərait yaradır.
            </p>
          </div>
        </div>
      </Section>

      <Section background="gray">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-dark mb-4">
            Üstünlüklərimiz
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Bizi seçməli olan əsas səbəblər
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red-light rounded-full mb-4">
                <div className="text-brand-red">{value.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">{value.title}</h3>
              <p className="text-gray-medium">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-dark mb-8 text-center">
            Niyə bizi seçməlisiniz?
          </h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-dark mb-3">
                Təcrübəli müəllim heyəti
              </h3>
              <p className="text-gray-medium">
                Bütün müəllimlərimiz öz sahələrində yüksək təhsilli və təcrübəli mütəxəssislərdir. 
                Onlar tələbələrə bilik verməklə yanaşı, motivasiya və dəstək də göstərirlər.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-dark mb-3">
                Müasir təhsil metodları
              </h3>
              <p className="text-gray-medium">
                İnteraktiv dərslər, qrup işləri, test həlli texnikaları və müntəzəm qiymətləndirmə 
                sistemi ilə tələbələrimizin inkişafını izləyirik.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-dark mb-3">
                Fərdi yanaşma
              </h3>
              <p className="text-gray-medium">
                Hər bir tələbənin fərdi xüsusiyyətlərini nəzərə alaraq onlara uyğun təhsil planı 
                tərtib edirik və zəif olduqları mövzularda əlavə dəstək veririk.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-dark mb-3">
                Yüksək uğur nisbəti
              </h3>
              <p className="text-gray-medium">
                Məzunlarımızın 98%-dən çoxu arzuladıqları universitetlərə qəbul olur. Bu, bizim 
                keyfiyyətli təhsil sistemimizin nəticəsidir.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  )
}
