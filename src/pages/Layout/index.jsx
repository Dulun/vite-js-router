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
        {[
          {
            to: '/',
          },
          {
            to: '/home',
          },
          {
            to: '/order',
          },
          {
            to: '/home/h1',
          },
          {
            to: '/home/memo',
          },
          {
            to: '/about',
          },
          {
            to: '/product',
          },
          {
            to: '/promise',
          },
          {
            to: '/height-width',
          },
        ].map((item, index) => {
          return (
            <div key={index}>
              <Link to={item.to}>
                {item.to.replace('/', '') || '/'}
              </Link>
              <br />
            </div>
          )
        })}
        <div style={{ height: '20px' }}></div>
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
