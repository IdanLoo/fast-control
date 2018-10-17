export const arrayFrom = (head, tail, step = 1) => {
  const array = []

  for (let i = head; i <= tail; i += step) {
    array.push(i)
  }

  return array
}