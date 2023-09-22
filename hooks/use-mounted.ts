import { useEffect, useState } from "react"

const useMounted = () => {
  const [isMounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return isMounted
}

export default useMounted
