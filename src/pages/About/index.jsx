import React, {
  useEffect,
  useDeferredValue,
  useState,
} from 'react'
import { useAppcontext } from '@/context'
import { usePrevious } from '@/hooks'

const Component = () => {
  const context = useAppcontext()

  const prevContext = usePrevious(context.state)

  const [count, setCount] = React.useState(0)
  const prevCount = usePrevious(count)
  const [string, setString] = useState('')
  const deferedString = useDeferredValue(string)

  const renderDeferedValue = () => {
    const onChange = (e) => {
      console.log('@#@@@inputing', e.target.value)
      setString(e.target.value)
    }

    return (
      <React.Suspense>
        <input
          type='text'
          onChange={onChange}
          value={string}
        />
        <div>deferedValue:{deferedString}</div>
      </React.Suspense>
    )
  }

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
      {renderDeferedValue()}
    </div>
  )
}

Component.displayName = 'About'

export default Component
