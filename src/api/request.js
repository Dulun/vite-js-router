import Axios from 'axios'
import { version } from '../../package.json'
import { REQUEST_CODE } from '@/const'
import { v4 as uuidv4 } from 'uuid'
import qs from 'query-string'

//TODO: add request queue
const requestQueue = []

const request = Axios.create({
  headers: {
    'x-fe-version': version,
  },
  timeout: 10000,
  timeoutErrorMessage: 'Request Timeout',
})

const abortControllerMap = new Map()

const genUniqueId = () => {
  let id = uuidv4()
  if (abortControllerMap.has(id)) {
    return genUniqueId()
  }
  return id
}

/*
 * Map AbortController to cancel Request
 */
const getAbortControllerAddedToMap = (uuid, url = '') => {
  const controler = new AbortController()
  abortControllerMap.set(uuid, {
    controler,
    url,
  })
  return controler
}

const deleteAbortController = (uuid) => {
  abortControllerMap.delete(uuid)
}

/*
 * Cancel all request
 */
const cancelAllRequests = () => {
  for (const [key, value] of abortControllerMap) {
    value.controler.abort()
    deleteAbortController(key)
  }
}

/*
 * Cancel all url request
 */
const cancelUrlRequests = (url) => {
  for (const [key, value] of abortControllerMap) {
    if (value.url === url) {
      value.controler.abort()
      abortControllerMap.delete(key)
    }
  }
}

/*
 * Cancel certain request by uuid
 */
const cancelRequestByUuid = (uuid) => {
  if (abortControllerMap.has(uuid)) {
    abortControllerMap.get(uuid).controler.abort()
    abortControllerMap.delete(uuid)
  }
}

request.interceptors.response.use((response) => {
  const statusCode = response.status

  if (statusCode === 200) {
    return response.data
  }

  throw response
})

const injectHeaders = (headers) => {
  request.interceptors.request.use((config) => {
    Object.entries(headers).forEach(([key, value]) => {
      config.headers[key] = value
    })
    return config
  })
}

const createHeadersInterceptor = () => {
  return injectHeaders
}

const fetchData = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        data: 'Hello World',
      })
    }, 1000)
  )
}

const get = (url, data, reportUuid) => {
  const config = {}

  const uuid = genUniqueId()

  const _url = `${url}?${qs.stringify(data)}`

  config.signal = getAbortControllerAddedToMap(
    uuid,
    url
  ).signal

  typeof reportUuid === 'function' && reportUuid?.(uuid)

  return request.get(_url, config).then((res) => {
    deleteAbortController(uuid)
    return Promise.resolve(res)
  })
}

export default {
  get,
}

export {
  fetchData,
  request,
  injectHeaders,
  createHeadersInterceptor,
  cancelAllRequests,
  cancelUrlRequests,
  cancelRequestByUuid,
}
