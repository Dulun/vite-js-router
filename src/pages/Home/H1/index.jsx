import React, { useEffect } from 'react'

const HHome1 = (props) => {
  useEffect(() => {
    console.log('@@@H1', [props])
  }, [props])

  return <div>H1</div>
}

export default HHome1
