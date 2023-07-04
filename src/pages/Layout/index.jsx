import React from 'react'
import styles from './index.module.scss'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sider}>
        <Link to='/'>/</Link>
        <br />
        <Link to='/home'>home</Link>
        <br />
        <Link to='/order'>order</Link>
        <br />
        <Link to='/home/h1'>h1</Link>
      </div>
      <div className={styles.content}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Layout
