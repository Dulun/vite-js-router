import Axios from 'axios'
import { version } from '../../package.json'
import { REQUEST_CODE } from '@/const'
import { v4 as uuidv4 } from 'uuid'

const request = Axios.create({
  headers: {
    'x-fe-version': version,
  },
  timeout: 5000,
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
request.interceptors.request.use((config) => {
  const controler = new AbortController()
  abortControllerMap.set(genUniqueId(), {
    controler,
    url: config.url,
  })

  Object.entries(abortControllerMap).forEach(
    ([key, value]) => {
      console.log('@@????', key, value)
    }
  )

  config.signal = controler.signal
  return config
})

/*
 * Cancel all request
 */
const cancelAllRequests = () => {
  for (const [key, value] of abortControllerMap) {
    console.log('@@aborting', key, value.url)
    value.controler.abort()
    abortControllerMap.delete(key)
  }
}

/*
 * Cancel all url request
 */
const cancelUrlRequests = (url) => {
  for (const [
    uuid,
    value,
  ] of abortControllerMap.entries()) {
    if (value.url === url) {
      value.controller.abort()
      abortControllerMap.delete(uuid)
    }
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

export {
  fetchData,
  request,
  injectHeaders,
  createHeadersInterceptor,
  cancelAllRequests,
  cancelUrlRequests,
}
