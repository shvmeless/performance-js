// MODULE
export const maths = {

  // FUNCTION
  trunc (number: number, decimals = 0): number {
    if (decimals <= 0) return Math.trunc(number)
    const factor = Math.pow(10, decimals)
    return Math.trunc(number * factor) / factor
  },

}
