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

const PromisePage = () => {
  const handleClick = () => {
    microFlow([middleWare1, middleWare1])({
      a: 100,
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
