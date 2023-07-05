import React from 'react'

const AppContext = React.createContext()
AppContext.displayName = 'AppContext'

const useAppcontext = () => {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error(
      `useAppcontext must be used within a AppContext`
    )
  }
  return context
}

export { AppContext, useAppcontext }
