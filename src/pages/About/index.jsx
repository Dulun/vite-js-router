import React, { useEffect } from 'react'
import { useAppcontext } from '@/context'
import { usePrevious } from '@/utils/hooks'

const Component = () => {
  const context = useAppcontext()

  const prevContext = usePrevious(context.state)

  const [count, setCount] = React.useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <h2>About</h2>
      <h3>AppContextState:</h3>
      {JSON.stringify(context.state)}
      {JSON.stringify(prevContext)}
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        {count}:{prevCount}
      </button>
    </div>
  )
}

Component.displayName = 'About'

export default Component
