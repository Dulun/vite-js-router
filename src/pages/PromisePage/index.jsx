import React from 'react'

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

  return (
    <div
      onClick={() => {
        handleClick()
      }}
    >
      Promise
    </div>
  )
}

export default PromisePage
