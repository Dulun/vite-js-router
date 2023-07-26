import React, {
  useEffect,
  useDeferredValue,
  useState,
  useTransition,
} from 'react'
import { useAppcontext } from '@/context'
import { usePrevious } from '@/hooks'

import styles from './index.module.scss'

const createDummyProducts = (count = 10000) => {
  let products = []
  for (let i = 0; i < count; i++) {
    products.push(`Product-${i}`)
  }
  return products
}

const ProductList = (props) => {
  const { products } = props
  // useDeferredValue will return a defered value when in concurrent mode
  // 如果控制不了state的更新，可以使用useDeferredValue
  // 可以达到65行一样的效果 
  const deferedProducts = useDeferredValue(products)

  return (
    <ul className={styles.productList}>
      {deferedProducts.map((product, index) => (
        <li key={index}>{product}</li>
      ))}
    </ul>
  )
}

const Component = () => {
  const context = useAppcontext()
  const [string, setString] = useState('')
  const [count, setCount] = React.useState(0)
  const prevContext = usePrevious(context.state)
  const deferedString = useDeferredValue(string)
  const prevCount = usePrevious(count)

  const [isPending, startTransition] = useTransition()

  const dummyProducts = createDummyProducts()

  const [productList, setProductList] =
    useState(dummyProducts)

  const filterProducts = (target) => {
    if (!target) return dummyProducts

    return dummyProducts.filter((product) =>
      product.includes(target)
    )
  }

  const products = filterProducts(string)

  const renderDeferedValue = () => {
    const onChange = (e) => {
      startTransition(() => {
        console.log('@@@is pending', isPending)
        // low proirity, only render when idle
        // setProductList(filterProducts(e.target.value))
      })
      setProductList(filterProducts(e.target.value))

      setString(e.target.value)
    }

    return (
      <>
        <input type='text' onChange={onChange} />
        {/* <div>deferedValue:{deferedString}</div> */}
      </>
    )
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <h2>About</h2>
      <h3>AppContextState:</h3>
      <h3>{isPending ? 'loading' : isPending}</h3>

      {JSON.stringify(context.state)}
      {JSON.stringify(prevContext)}
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        {count}:{prevCount}
      </button>
      {renderDeferedValue()}
      <ProductList products={productList} />
    </div>
  )
}

Component.displayName = 'About'

export default Component
