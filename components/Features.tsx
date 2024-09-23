import React from 'react'
import FeatureBox from './FeatureBox'
import { features } from '../data/features_data'

export default function Features() {
  return (
    <div className='pt-64 grid w-full max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center'>
      {
        features.map((feature, index) => (
          <FeatureBox
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))
      }
    </div>
  )
}
