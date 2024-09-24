
import React from 'react';

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureBox({ icon, title, description }: FeatureBoxProps) {
  return (
    <div className='bg-zinc-900 rounded-lg border-2 border-zinc-700 w-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2'>
      <div className='flex gap-4 p-8 md:p-12'>
        {icon}
        <div>
          <h3 className='text-2xl md:text-3xl font-light text-white'>
            {title}
          </h3>
          <p className='mt-2 max-w-lg text-zinc-400'>{description}</p>
        </div>
      </div>
    </div>
  );
}
