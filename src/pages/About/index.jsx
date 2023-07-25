import React, {
  useEffect,
  useDeferredValue,
  useState,
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

  return (
    <ul className={styles.productList}>
      {products.map((product, index) => (
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

  const dummyProducts = createDummyProducts()

  const filterProducts = (target) => {
    if (!target) return dummyProducts

    return dummyProducts.filter((product) =>
      product.includes(target)
    )
  }

  const products = filterProducts(string)

  const renderDeferedValue = () => {
    const onChange = (e) => {
      setString(e.target.value)
    }

    return (
      <>
        <input
          type='text'
          onChange={onChange}
          value={string}
        />
        <div>deferedValue:{deferedString}</div>
      </>
    )
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <h2>About</h2>
      <h3>AppContextState:</h3>
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
      <ProductList products={products} />
    </div>
  )
}

Component.displayName = 'About'

export default Component
