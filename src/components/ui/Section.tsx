import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray'
}

export default function Section({ children, className = '', background = 'white' }: SectionProps) {
  const bgColor = background === 'gray' ? 'bg-gray-light' : 'bg-white'
  
  return (
    <section className={`section-padding ${bgColor} ${className}`}>
      <div className="container-custom">
        {children}
      </div>
    </section>
  )
}
