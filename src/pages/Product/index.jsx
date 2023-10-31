import React, { useEffect, useState, useRef } from 'react'
import {
  getRandomDogPic,
  request,
  cancelAllRequests,
  cancelRequestByUuid,
  cancelRequestsByUrl,
} from '@/api'
import { useNavigate } from 'react-router-dom'
import { getDogAPIBaseURL } from '@/utils'
import { useDidMountEffect } from '@/hooks'
import Loading from '@/components/Loading'

import styles from './index.module.scss'

// env: import.meta.env.MODE
const Product = (props) => {
  const [product, setProduct] = useState([])

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setProduct(
        Array(10)
          .fill(1)
          .map((item, index) => ({
            id: index,
            name: index,
            price: index,
          }))
      )
    }, 1000)
  }

  const handleProductClick = (item) => (e) => {
    console.log('@@@', item)
    navigate(`/product/${item.id}`)
  }

  return (
    <>
      <button onClick={fetch}> load </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        product.map((item, index) => {
          return (
            <div
              key={index}
              className={'flex'}
              onClick={handleProductClick(item)}
            >
              <div>ID: {item.name}</div>
              <div>Name: {item.name}</div>
              <div>Price: {item.price}</div>
            </div>
          )
        })
      )}
    </>
  )
}

export default Product
