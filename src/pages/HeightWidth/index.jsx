import React, { useRef, useEffect } from 'react'
import styles from './index.module.scss'

const HeightWidth = () => {
  const ref = useRef(null)

  const log = () => {
    const { scrollHeight, scrollTop, clientHeight } =
      ref.current

    console.log(scrollHeight, scrollTop, clientHeight)

    if (scrollHeight - scrollTop === clientHeight) {
      console.log('到底了')
    }
  }

  useEffect(log, [ref])

  return (
    <div className={styles.contaier}>
      <div
        className={styles.scrollContainer}
        ref={ref}
        onScroll={log}
      >
        {Array(100)
          .fill(1)
          .map((item, index) => {
            return (
              <div style={{ color: 'blue' }} key={index}>
                {index}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default HeightWidth
