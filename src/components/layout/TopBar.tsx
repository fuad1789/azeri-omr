'use client'

import { useState } from 'react'
import { Facebook, Instagram, Play } from 'lucide-react'

export default function TopBar() {
  const [selectedBranch, setSelectedBranch] = useState('sumqayit')

  const branches = [
    { value: 'sumqayit', label: 'Sumqayıt filialı' },
    { value: 'baku', label: 'Bakı filialı' },
  ]

  return (
    <div className="bg-[#F8FAFC] border-b border-black/5" style={{ height: '44px' }}>
      <div className="container-custom h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Online link with play icon */}
          <a 
            href="#" 
            className="flex items-center gap-2 text-[#6B7280] hover:text-brand-red transition-all duration-200 text-sm font-medium group"
          >
            <div className="relative flex items-center justify-center">
              {/* Ping effect behind icon */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-20 animate-ping"></span>
              {/* Play icon */}
              <Play 
                size={16} 
                className="relative fill-current transition-transform duration-200 group-hover:scale-110" 
              />
            </div>
            <span>Dərsləri online izlə</span>
          </a>
          
          {/* Center: Empty flex space */}
          <div className="flex-1"></div>
          
          {/* Right: Branch dropdown + social icons */}
          <div className="flex items-center gap-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-white text-[#475569] px-3 py-1.5 rounded-md text-sm border border-black/10 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/30 transition-all"
            >
              {branches.map((branch) => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
            </select>
            
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
