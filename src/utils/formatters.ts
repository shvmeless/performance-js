// IMPORTS
import { maths } from './maths'

// MODULE
export const formatters = {

  // FUNCTION
  time (milliseconds: number): string {

    let seconds = maths.trunc(milliseconds / 1000)
    milliseconds = maths.trunc(milliseconds % 1000)
    const minutes = maths.trunc(seconds / 60)
    seconds = maths.trunc(seconds % 60)

    const output: Array<string> = []

    if (minutes >= 1) output.push(`${minutes} m`)
    if (seconds >= 1) output.push(`${seconds} s`)
    if (milliseconds >= 1) output.push(`${milliseconds} ms`)

    return output.join(' ')

  },

}
