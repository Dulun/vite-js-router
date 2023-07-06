import React, { useEffect, useRef } from 'react'

/**
 * use like componentDidMount, run only once in react18.
 *
 * @param func: callBack Function
 * @param deps: effect dependencies
 */
const useDidMountEffect = (func, deps = []) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) func()
    else didMount.current = true
  }, deps)
}

export { useDidMountEffect }
export default useDidMountEffect
