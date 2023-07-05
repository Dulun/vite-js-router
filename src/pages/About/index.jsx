import React, { useEffect } from 'react'
import { useAppcontext } from '@/context'

const Component = () => {
  const context = useAppcontext()

  return (
    <div>
      <h2>About</h2>
      <h3>AppContextState:</h3>
      {JSON.stringify(context.state)}
    </div>
  )
}

Component.displayName = 'About'

export default Component
