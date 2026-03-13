'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import { GraduationCap, BookOpen, Zap, Globe, Users, Target } from 'lucide-react';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  slug: string;
  features: string[];
  duration: string;
  students: string;
  displayOrder: number;
  isActive: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen size={32} />,
  Target: <Target size={32} />,
  GraduationCap: <GraduationCap size={32} />,
  Zap: <Zap size={32} />,
  Globe: <Globe size={32} />,
  Users: <Users size={32} />,
};

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
    green: 'from-green-50 to-green-100 border-green-200 hover:border-green-300',
    red: 'from-red-50 to-red-100 border-red-200 hover:border-red-300',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300',
    pink: 'from-pink-50 to-pink-100 border-pink-200 hover:border-pink-300',
    purple: 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300',
    orange: 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-300',
    teal: 'from-teal-50 to-teal-100 border-teal-200 hover:border-teal-300',
    cyan: 'from-cyan-50 to-cyan-100 border-cyan-200 hover:border-cyan-300',
  };
  return colors[color] || colors.blue;
};

const getIconColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    teal: 'text-teal-600',
    cyan: 'text-cyan-600',
  };
  return colors[color] || colors.blue;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Kurslar alınmadı:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Kurslar" 
        description="Sizin üçün ən uyğun kursu seçin və uğura doğru ilk addımı atın"
      />
      
      <Section>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Kurslar tezliklə əlavə olunacaq</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course._id} href={`/kurs-detallari/${course.slug}`}>
                <Card 
                  className={`p-6 bg-gradient-to-br ${getColorClasses(course.color)} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm">
                    <div className={getIconColor(course.color)}>
                      {iconMap[course.icon] || <BookOpen size={32} />}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-dark mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-medium mb-4 text-sm">
                    {course.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${getIconColor(course.color).replace('text-', 'bg-')}`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{course.students}</span> tələbə
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-br from-brand-red/5 to-brand-red/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-dark mb-4">Doğru kursu seçə bilmirsiniz?</h3>
          <p className="text-gray-medium mb-6 max-w-2xl mx-auto">
            Mütəxəssislərimiz sizə doğru kursu seçməkdə kömək edəcək. 
            Bizimlə əlaqə saxlayın və pulsuz məsləhət alın.
          </p>
          <a href="/elaqe">
            <button className="bg-brand-red text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-red-dark transition-colors">
              Əlaqə saxlayın
            </button>
          </a>
        </div>
      </Section>
    </>
  );
}