'use client'

import { Facebook, Instagram, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="hidden sm:block bg-[#F8FAFC] border-b border-black/5" style={{ height: '44px' }}>
      <div className="container-custom h-full">
        <div className="flex items-center justify-end h-full">
          {/* Right: Branch link + social icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/elaqe"
              className="flex items-center gap-2 bg-white text-[#475569] px-3 py-1.5 rounded-md text-sm border border-black/10 hover:border-brand-red hover:text-brand-red transition-all cursor-pointer"
            >
              <MapPin size={16} className="text-brand-red" />
              Filiallar
            </Link>
            
            <div className="flex items-center gap-3 ml-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#475569] hover:text-brand-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#475569] hover:text-brand-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

