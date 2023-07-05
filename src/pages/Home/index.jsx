import React, { useEffect } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { useAppcontext } from '@/context'

const Home = (props) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const data = useLoaderData()

  const { state, setState } = useAppcontext()

  useEffect(() => {
    console.log('@@@@ state', state)
  }, [state])

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className='close-button' onClick={close}>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
      <button
        onClick={() => {
          setState({
            count: state.count + 1,
            oldCount: state.count,
          })
        }}
      >
        {state.count}
      </button>
      <p>data:</p>
      {data.data}
    </div>
  )
}

export default Home
