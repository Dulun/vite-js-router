import React, { useEffect, useState, useRef } from 'react'
import {
  getRandomDogPic,
  request,
  cancelAllRequests,
  cancelRequestByUuid,
  cancelUrlRequests,
} from '@/api'
import { getDogAPIBaseURL } from '@/utils'
import { useDidMountEffect } from '@/hooks'
import Loading from '@/components/Loading'

import styles from './index.module.scss'

// env: import.meta.env.MODE
const Order = (props) => {
  let isFetching = false

  const [dogPicSrc, setDogPicSrc] = useState('')
  const [queryStatus, setQueryStatus] = useState('idle')

  const queue = useRef([])

  const cancle = () => {
    queue.current.forEach((q) => {
      cancelRequestByUuid(q)
    })
    queue.current = []
  }

  const fetch = () => {
    isFetching = true
    setQueryStatus('loading')

    getRandomDogPic(
      {
        name: 'test',
        age: '190',
      },
      (id) => {
        queue.current.push(id)
        console.log('@@ queue', queue.current)
      }
    )
      .then((res) => {
        console.log('@@#res', res)
        setDogPicSrc(res.message)
      })
      .catch(console.error)
      .finally(() => {
        setQueryStatus('idle')
      })
  }

  useDidMountEffect(fetch, [])

  const cancleUrlReq = () => {
    cancelUrlRequests('api/breeds/image/random')
  }

  return (
    <div>
      Order
      {queryStatus === 'loading' ? (
        <Loading />
      ) : (
        <img src={dogPicSrc} alt='' width={200} />
      )}
      <div className={styles.buttons}>
        <button onClick={fetch}>Refresh</button>
        <button onClick={cancle}>cancelqueueRequest</button>
        <button onClick={cancleUrlReq}>cancel url</button>
      </div>
    </div>
  )
}

export default Order
