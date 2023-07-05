import React from 'react'
import styles from './index.module.scss'
import {
  Link,
  Outlet,
  useNavigation,
} from 'react-router-dom'
import Loading from '@/components/Loading'

const Layout = () => {
  const navigation = useNavigation()

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
        <br />
        <Link to='/about'>About</Link>
        <div>{navigation.state}</div>
      </div>
      <div className={styles.content}>
        {navigation.state === 'loading' ? (
          <Loading></Loading>
        ) : (
          <Outlet></Outlet>
        )}
      </div>
    </div>
  )
}

export default Layout
