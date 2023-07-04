const fetchData = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        data: 'Hello World',
      })
    }, 1000)
  )
}

export { fetchData }
