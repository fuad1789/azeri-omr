import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-brand-red text-white py-12 md:py-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
