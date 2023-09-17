export const getVariables = (prompt: string): string[] => {
  const regex = /\{\{(.+?)\}\}/g
  const unique = new Set(
    Array.from(prompt.matchAll(regex)).map((match) => match[1].trim())
  )
  return Array.from(unique)
}

/** // https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream */
export const iteratorToStream = (iterator: any) => {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
