import React from 'react'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray' | 'red'
}

export default function Section({ 
  children, 
  className = '', 
  background = 'white',
  ...props
}: SectionProps) {
  const bgColor = background === 'gray' ? 'bg-gray-light' : 
                  background === 'red' ? 'bg-gradient-to-br from-brand-red to-brand-red-dark text-white' : 
                  'bg-white'
  
  return (
    <section className={`section-padding ${bgColor} ${className}`} {...props}>
      <div className="container-custom">
        {children}
      </div>
    </section>
  )
}
