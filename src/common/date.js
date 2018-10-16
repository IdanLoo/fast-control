const greaterMonths = [1, 3, 5, 7, 8, 10, 12]

export const isLeap = year => {
  return !(year % 4) && !!(year % 100) || !(year % 400)
}

export const dateCount = (year, month) => {
  if (month === 2) {
    return isLeap(year) ? 29 : 28
  }

  return greaterMonths.indexOf(month) === -1 ? 30 : 31
}