

const getDogAPIBaseURL = (env) => {
  switch (env) {
    case 'development':
      return import.meta.env.VITE_DOG_API_BASE_URL_SANDBOX
    case 'production':
      return import.meta.env.VITE_DOG_API_BASE_URL_SANDBOX
    default:
      throw new Error('Unknown environment')
  }
}

export { getDogAPIBaseURL }