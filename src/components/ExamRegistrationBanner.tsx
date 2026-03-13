'use client'

import Link from 'next/link'
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react'

export default function ExamRegistrationBanner() {
  return (
    <section className="bg-gradient-to-r from-brand-red to-brand-red-dark py-12 sm:py-16">
      <div className="container-custom px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Mətn hissəsi */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Sınaq İmtahanına Yazıl
            </h2>
            <p className="text-sm sm:text-lg text-white/90 mb-4 sm:mb-6 max-w-2xl">
              Öz biliklərini yoxla və imtahana hazır ol! Hər həftə sonu keçirilən 
              sınaq imtahanlarımıza qeydiyyatdan keç.
            </p>
            
            {/* Xüsusiyyətlər */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <Calendar size={20} className="flex-shrink-0" />
                <span className="text-sm sm:text-base">Hər həftə sonu</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock size={20} className="flex-shrink-0" />
                <span className="text-sm sm:text-base">3 saat müddət</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users size={20} className="flex-shrink-0" />
                <span className="text-sm sm:text-base">Kiçik qruplar</span>
              </div>
            </div>
          </div>

          {/* Düymə */}
          <Link 
            href="/sinaq-imtahanina-yazil"
            className="flex-shrink-0 bg-white text-brand-red hover:bg-gray-50 transition-colors px-8 py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 group whitespace-nowrap"
          >
            Qeydiyyatdan Keç
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}