import { ConciergeBell } from 'lucide-react';
import React from 'react';

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureBox({ icon, title, description }: FeatureBoxProps) {
  return (
    <div className='bg-zinc-800 rounded-md'>
      <div className='flex gap-4 p-4'>
        {icon}
        <div>
          <span className='text-3xl pb-10 font-extralight'>
            {title}
          </span>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}