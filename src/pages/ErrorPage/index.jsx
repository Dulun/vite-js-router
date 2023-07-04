import React from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorPage = ({ error }) => {
  const e = error || useRouteError()
  console.error(e)
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{e?.statusText + '  ' + e?.message}</p>
    </div>
  )
}

export default ErrorPage
