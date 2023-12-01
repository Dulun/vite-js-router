import React, { useEffect, useState } from 'react'
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
import Memo from './pages/Home/Memo'
import Layout from './pages/Layout'
import ErrorPage from '@/pages/ErrorPage'
import About from '@/pages/About'
import { fetchData } from '@/api'
import { AppContext } from '@/context'
import { request } from '@/api'
import HeightWidth from './pages/HeightWidth'
import ProductDetail from './pages/Product/ProductDetail'
import './App.css'
import Product from './pages/Product'
import PromisePage from './pages/PromisePage'

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

    //lazy load
    // let browserRouter = createBrowserRouter([
    //   {
    //     path: '/',
    //     Component: Layout,
    //     // errorElement: <ErrorPage />,
    //     children: [
    //       {
    //         index: true,
    //         element: (
    //           <React.Suspense fallback={<p>fallback</p>}>
    //             <LazyHome></LazyHome>
    //           </React.Suspense>
    //         ),
    //       },
    //       {
    //         path: 'home',
    //         // lazy: () => import('./pages/Home'), //不对, 得用 module.default
    //         loader: Loader,
    //         // action: actionS1,

    //         element: <Home></Home>,
    //         // lazy: async () => {
    //         //   let module = await import('./pages/Home')
    //         //   let Component = module.default
    //         //   return { Component }
    //         // },
    //         children: [
    //           {
    //             path: ':id',
    //             element: <Home></Home>,
    //           },
    //         ],
    //       },
    //       {
    //         path: 'order',
    //         lazy: async () => {
    //           let C = await import('./pages/Order')
    //           return { Component: C.default }
    //         },
    //       },

    //       {
    //         path: 'home/h1',
    //         lazy: async () => {
    //           let C = await import('./pages/Home/H1')
    //           return { Component: C.default }
    //         },
    //       },
    //       {
    //         path: 'home/memo',
    //         element: <Memo></Memo>,
    //       },
    //       {
    //         path: 'about',
    //         element: <About></About>,
    //       },
    //       {
    //         path: '*',
    //         element: (
    //           <ErrorPage
    //             error={{
    //               statusText: '404',
    //               message: 'Not Found',
    //             }}
    //           />
    //         ),
    //       },
    //     ],
    //   },
    // ])

    // The Outlet component will always render the next matching route, so it’s a good idea to put it at the end of your route list.
    // let browserRouter = createBrowserRouter([
    //   {
    //     path: '/',
    //     element: <Layout></Layout>,
    //     children: [
    //       {
    //         index: true,
    //         element: <Order></Order>,
    //       },
    //       {
    //         path: 'home',
    //         loader: Loader,
    //         element: <Home></Home>,
    //         children: [
    //           // {
    //           //   index: true,
    //           //   element: <Home></Home>,
    //           // },
    //           {
    //             path: ':id',
    //             element: <Home></Home>,
    //           },
    //           {
    //             path: 'h1',
    //             element: <HHome1></HHome1>,
    //           },
    //           {
    //             path: 'memo',
    //             element: <Memo></Memo>,
    //           },
    //         ],
    //       },
    //       {
    //         path: 'order',
    //         element: <Order></Order>,
    //       },
    //       {
    //         path: 'about',
    //         element: <About></About>,
    //       },
    //       {
    //         path: '*',
    //         element: (
    //           <ErrorPage
    //             error={{
    //               statusText: '404',
    //               message: 'Not Found',
    //             }}
    //           />
    //         ),
    //       },
    //     ],
    //   },
    //   {
    //     path: '/admin',
    //     element: (
    //       <ErrorPage
    //         error={{
    //           statusText: '404',
    //           message: 'Not Found',
    //         }}
    //       />
    //     ),
    //   }
    // ])

    let browserRouter = createBrowserRouter([
      {
        path: '/',
        element: <Layout></Layout>,
        children: [
          {
            index: true,
            element: <Order></Order>,
          },
          {
            path: 'home',
            element: <Home></Home>,
          },
          {
            path: 'product',
            element: <Product></Product>,
          },
          {
            path: 'product/:id',
            element: <ProductDetail></ProductDetail>,
          },
          {
            path: 'product/:id/productdetail',
            element: <ProductDetail></ProductDetail>,
            children: [
              {
                index: true,
                element: <ProductDetail></ProductDetail>,
              },
            ],
          },
          {
            path: 'product/:id/productdetail/:detailid',
            element: <ProductDetail></ProductDetail>,
          },
          {
            path: 'home',
            loader: Loader,
            element: <Home></Home>,
            children: [
              {
                path: ':id',
                element: <Home></Home>,
              },
              {
                path: 'h1',
                element: <HHome1></HHome1>,
              },
              {
                path: 'memo',
                element: <Memo></Memo>,
              },
            ],
          },
          {
            path: 'order',
            element: <Order></Order>,
          },
          {
            path: 'about',
            element: <About></About>,
          },
          {
            path: 'promise',
            element: <PromisePage></PromisePage>,
          },
          {
            path: 'height-width',
            element: <HeightWidth />,
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
