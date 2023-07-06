import request from './request'
export * from './request'

const url = {
  randomDogPic: 'api/breeds/image/random',
}
class Api {
  constructor() {
    this.request = request
    Object.entries(url).forEach(([key, value]) => {
      this[key] = value
    })
  }

  getRandomDogPic(getter) {
    getter()
    return this.request.get('api/breeds/image/random')
  }
}

const APIInstance = new Api()

export const getRandomDogPic = (data, reportUuid) => {
  // api/breeds/image/random
  return request.get(
    'api/breeds/image/random',
    data,
    reportUuid
  )
}

export default APIInstance
