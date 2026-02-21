import Link from 'next/link'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

export default function Footer() {
  const quickLinks = [
    { href: '/haqqimizda', label: 'Haqqımızda' },
    { href: '/nesrlerimiz', label: 'Nəşrlərimiz' },
    { href: '/foto-qalereya', label: 'Foto Qalereya' },
    { href: '/video-qalereya', label: 'Video Qalereya' },
  ]

  return (
    <footer className="bg-gray-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-6">Azəri Hazırlıq Kursları</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Universitet qəbul imtahanlarına hazırlıq, attestat və sınaq imtahanları, 
              təkmilləşdirmə kursları və xaricdə təhsil üzrə məsləhətlərimiz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Keçidlər</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-brand-red transition-colors text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Əlaqə</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Sumqayıt şəhəri, 13-cü mkr., Niyazi küç.
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-brand-red flex-shrink-0" />
                <span className="text-gray-300">+994 12 345 67 89</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-brand-red flex-shrink-0" />
                <span className="text-gray-300">info@azerikurslari.edu.az</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Globe size={18} className="text-brand-red flex-shrink-0" />
                <span className="text-gray-300">www.azerikurslari.edu.az</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-bold mb-6">İş saatları</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex justify-between">
                <span>Bazar ertəsi - Cümə</span>
                <span className="font-semibold text-white ml-4">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Şənbə</span>
                <span className="font-semibold text-white ml-4">10:00 - 15:00</span>
              </li>
              <li className="text-gray-400">Bazar günü istirahət</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Azəri Hazırlıq Kursları. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  )
}
