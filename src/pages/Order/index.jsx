import React, { useEffect, useState } from 'react'
import {
  getRandomDogPic,
  request,
  cancelAllRequests,
} from '@/api'
import { getDogAPIBaseURL } from '@/utils'
import { useDidMountEffect } from '@/hooks'
import Loading from '@/components/Loading'

// env: import.meta.env.MODE
const Order = (props) => {
  let isFetching = false

  const [dogPicSrc, setDogPicSrc] = useState('')
  const [queryStatus, setQueryStatus] = useState('idle')

  const fetch = () => {
    if (queryStatus === 'loading') return
    isFetching = true
    setQueryStatus('loading')

    getRandomDogPic()
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

  return (
    <div>
      Order
      {isFetching ? (
        <Loading />
      ) : (
        <img src={dogPicSrc} alt='' width={200} />
      )}
      <button onClick={fetch}>Refresh</button>
      <button onClick={cancelAllRequests}>
        cancelAllRequest
      </button>
    </div>
  )
}

export default Order
