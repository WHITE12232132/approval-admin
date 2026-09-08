import { useState } from "react"

export default function useCounter(initicial: number=0) {
  const [count, setCount] = useState(initicial)
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(initicial)
  return { count, increment, decrement, reset }
}