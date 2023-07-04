import React, { useEffect } from 'react'

const Order = (props) => {
  useEffect(() => {
    console.log('@@@@Order', props)
  }, [props])

  return <div>Order</div>
}

export default Order