import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'

const Home = (props) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className='close-button' onClick={close}>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
    </div>
  )
}

export default Home
