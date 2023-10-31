import React, { useEffect, useState, useRef } from 'react'
import {
  getRandomDogPic,
  request,
  cancelAllRequests,
  cancelRequestByUuid,
  cancelRequestsByUrl,
} from '@/api'
import {
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom'
import { getDogAPIBaseURL } from '@/utils'
import { useDidMountEffect } from '@/hooks'
import Loading from '@/components/Loading'

import styles from './index.module.scss'

// env: import.meta.env.MODE
const ProductDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('@@@@@@@@', params)
  })

  const handleClick = () => {
    navigate(`productdetail/${params.id}`)
  }

  return <div onClick={handleClick}>{params.id}</div>
}

export default ProductDetail
