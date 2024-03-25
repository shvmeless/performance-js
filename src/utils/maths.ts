// MODULE
export const maths = {

  // FUNCTION
  round (number: number, decimals = 0): number {
    if (decimals <= 0) return Math.round(number)
    const factor = Math.pow(10, decimals)
    return Math.round(number * factor) / factor
  },

  // FUNCTION
  trunc (number: number, decimals = 0): number {
    if (decimals <= 0) return Math.trunc(number)
    const factor = Math.pow(10, decimals)
    return Math.trunc(number * factor) / factor
  },

  // FUNCTION
  average (...values: Array<number>): number {
    if (values.length === 0) return 0
    let total = 0
    for (const result of values) {
      total += result
    }
    return total / values.length
  },

}
