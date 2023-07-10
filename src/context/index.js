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

const withAppContext = (Component) => {
  const name =
    Component.displayName || Component.name || 'Component'

  const componentWrapper = React.forwardRef(
    (props, ref) => {
      const context = useAppcontext()
      return (
        <Component
          {...props}
          _ref={ref}
          context={context}
        />
      )
    }
  )
  componentWrapper.displayName = name

  return componentWrapper
}

export { AppContext, useAppcontext, withAppContext }
