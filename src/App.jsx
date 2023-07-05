import React, { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Home from '@/pages/Home'
import HHome1 from './pages/Home/H1'
import Order from './pages/Order'
import Layout from './pages/Layout'
import ErrorPage from '@/pages/ErrorPage'
import About from '@/pages/About'
import { fetchData } from '@/api'
import { AppContext } from '@/context'

import './App.css'

export function sleep(n = 1000) {
  return new Promise((r) => setTimeout(r, n))
}

export async function Loader() {
  return await fetchData()
  await sleep(1000)
  return null
  // return {
  //   date: new Date().toISOString(),
  // }
}

const actionS1 = async () => {
  return await fetchData()
}

function App() {
  const [count, setCount] = useState(0)
  const [state, setState] = useState({
    count: 0,
  })

  const setAppContextState = (newState) => {
    setState((state) => {
      return {
        ...state,
        ...newState,
      }
    })
  }

  const oldway = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Layout></Layout>}
            errorElement={<ErrorPage></ErrorPage>}
          ></Route>
        </Routes>
      </BrowserRouter>
    )
  }

  const newway = () => {
    const LazyHome = React.lazy(() =>
      import('./pages/Order')
    )

    let browserRouter = createBrowserRouter([
      {
        path: '/',
        Component: Layout,
        // errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<p>fallback</p>}>
                <LazyHome></LazyHome>
              </React.Suspense>
            ),
          },
          {
            path: 'home',
            // lazy: () => import('./pages/Home'), //不对, 得用 module.default
            loader: Loader,
            // action: actionS1,

            element: <Home></Home>,
            // lazy: async () => {
            //   let module = await import('./pages/Home')
            //   let Component = module.default
            //   return { Component }
            // },
            children: [
              {
                path: ':id',
                element: <Home></Home>,
              },
            ],
          },
          {
            path: 'order',
            lazy: async () => {
              let C = await import('./pages/Order')
              return { Component: C.default }
            },
          },

          {
            path: 'home/h1',
            lazy: async () => {
              let C = await import('./pages/Home/H1')
              return { Component: C.default }
            },
          },
          {
            path: 'about',
            element: <About></About>
          },
          {
            path: '*',
            element: (
              <ErrorPage
                error={{
                  statusText: '404',
                  message: 'Not Found',
                }}
              />
            ),
          },
        ],
      },
    ])

    return (
      <AppContext.Provider
        value={{ state, setState: setAppContextState }}
      >
        <RouterProvider
          router={browserRouter}
          fallbackElement={<div>FallBack Element</div>}
        />
      </AppContext.Provider>
    )
  }

  return <>{newway()}</>
}

export default App
