import React, { useState, useEffect, useMemo } from 'react'
import styles from './index.module.scss'

const MemoDumy = () => {
  const [darkMode, setDarkMode] = useState(false)
  const handleDarkModeChange = (e) => {
    setDarkMode(e.target.checked)
  }

  return (
    <div className={styles.container}>
      <label>
        {/* <span className={styles.iconHolder}></span> */}
        <input
          type='checkbox'
          checked={darkMode}
          onChange={handleDarkModeChange}
        />
        <span className={styles.string}>Dark</span>
      </label>
    </div>
  )
}

export default MemoDumy
