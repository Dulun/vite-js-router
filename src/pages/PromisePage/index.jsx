import React from 'react'
import { DatePicker } from 'antd'

const noop = () => {}

const microFlow =
  (middleWares) =>
  (context, next = noop) =>
    Promise.resolve().then(
      middleWares.reduceRight(
        (acc, curFn) => () =>
          Promise.resolve(curFn(context, acc)),
        next
      )
    )

const middleWare1 = (context, next) => {
  console.log('context1', context)

  if (context.a) {
    context.a += 1
  } else {
    context.a = 1
  }

  next()
}

const middleWare2 = (context, next) => {
  console.log('context2', context)

  setTimeout(() => {
    context.m2 = '123'
    next()
  }, 1000)
}

const middleWare3 = (context, next) => {
  context.m2 += '456'
  console.log('context3', context)

  next()
}

const PromisePage = () => {
  const handleClick = () => {
    const context = {
      b: 'b',
    }

    microFlow([
      middleWare1,
      middleWare1,
      middleWare2,
      middleWare3,
    ])(context).then((k) => {
      console.log('@@@@k', k)
      console.log('@@@@k', context)
    })
  }

  const handleClick1 = () => {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('123')
      }, 10)
    })

    p.then((res) => {
      console.log('then1', res)
      return '456'
    })
      .finally((res) => {
        console.log('finally', res)
        return 'finaly'
      })
      .then((res) => {
        console.log('then2', res)
        throw new Error({ code: res })
      })
      .catch((e) => {
        console.log('eeee', e)
        return 'catched'
      })
      .then((res) => {
        console.log('then3', res)
        return res + 'then3'
      })

      .then((res) => {
        console.log('then4', res)
        return 'then4'
      })
  }

  const handleClick2 = () => {
    let p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('123')
      }, 8)
      setTimeout(() => {
        reject('123')
      }, 9)
    })

    p.then((res) => {
      console.log('then1', res)
    })
    p.then((res) => {
      console.log('then2', res)
    })
    p.then((res) => {
      console.log('then3', res)
    })

    p.catch((res) => {
      console.log('catch1', res)
    })
    p.catch((res) => {
      console.log('catch2', res)
    })
    p.catch((res) => {
      console.log('catch3', res)
    })
  }

  const handleClick3 = () => {
    // const p = new Promise((res, rej) => {
    //   let num = Math.random()
    //   if (num > 0.5) {
    //     res(num)
    //   }
    //   rej(num)
    // })
    // p.catch((res) => {
    //   console.log('catch1', res)
    // }).then((e) => {
    //   console.log('then1', e)
    // })

    const p1 = new Promise((res, rej) => {
      let num = Math.random()
      if (num > 0.5) {
        res(num)
      }
      rej(num)
    })
    p1.then((e) => {
      console.log('then1', e)
      return new Promise((res) => {
        setTimeout(() => {
          console.log('KKK')
          res(e)
        }, 1000)
      })
    })
      .then((e) => {
        console.log('then2', e)
      })
      .catch((e) => {
        console.log('catch1', e)
      })
      .finally(() => {
        console.log('finally')
      })
  }

  return (
    <>
      <DatePicker></DatePicker>
      <div
        onClick={() => {
          handleClick()
        }}
      >
        Promise
      </div>
      <div onClick={handleClick1}>then chatch finally</div>
      <div onClick={handleClick2}>pub sub</div>
      <div onClick={handleClick3}>then catch</div>
    </>
  )
}

export default PromisePage
