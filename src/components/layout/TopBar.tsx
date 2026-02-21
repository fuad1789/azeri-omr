'use client'

import { useState } from 'react'
import { Facebook, Instagram } from 'lucide-react'

export default function TopBar() {
  const [selectedBranch, setSelectedBranch] = useState('sumqayit')

  const branches = [
    { value: 'sumqayit', label: 'Sumqayıt filialı' },
    { value: 'baku', label: 'Bakı filialı' },
  ]

  return (
    <div className="hidden sm:block bg-[#F8FAFC] border-b border-black/5" style={{ height: '44px' }}>
      <div className="container-custom h-full">
        <div className="flex items-center justify-end h-full">
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

