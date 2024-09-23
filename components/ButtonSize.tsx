'use client'

import React from 'react'

export default function ButtonSize() {
    const [size, setSize] = React.useState(5)

  return (
    <div>
        <button onClick={() => setSize(size + 1)}
            style={{ fontSize: size }}
            >Increase
        </button>
    </div>
  )
}
