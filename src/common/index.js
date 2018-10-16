export const arrayFrom = (head, tail) => {
  const length = tail - head + 1

  if (length < 0) {
    return []
  }

  return Array(length).fill(0).map((_, index) => index + head)
}