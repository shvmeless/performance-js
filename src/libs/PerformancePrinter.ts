// IMPORTS
import { type CodePerformance } from './interfaces'
import { dictionary } from '@shvmerc/development'
import { maths } from '../utils/maths'
import { stdout } from 'process'

// FUNCTION
function progressBar (percent: number, width = 50): string {

  if (percent > 100) percent = 100
  if (percent < 0) percent = 0

  const progress = Math.ceil(width * percent / 100)

  const output: Array<string> = []

  for (let i = 1; i <= width; i++) {
    if (i < progress) output.push('▧')
    else if (i === progress) output.push('▧')
  }

  return output.join('')

}

// CLASS
export class PerformancePrinter {

  // PROPERTIES
  private readonly _performances: Record<string, CodePerformance>

  // CONSTRUCTOR
  public constructor (performances: Record<string, CodePerformance>) {
    this._performances = performances
  }

  // METHOD
  public print (): void {

    const performances = dictionary(this._performances).map((current) => {
      const average = maths.average(...current.values)
      return { ...current, average }
    })

    const array = dictionary(performances).array((current) => (current))
    array.sort((a, b) => (a.index - b.index))

    if (array.length < 1) {
      stdout.write('No results to display!\n')
      return
    }

    const utils = array.reduce((prev, current) => {
      prev.maxAverage = Math.max(prev.maxAverage, current.average)
      prev.maxNameSize = Math.max(prev.maxNameSize, current.name.length)
      return prev
    }, { maxAverage: 0, maxNameSize: 0 })

    array.forEach((current) => {

      const progress = current.average * 100 / utils.maxAverage

      const output: Array<string> = []
      output.push(current.name.padStart(utils.maxNameSize, ' '))
      output.push(progressBar(progress, 50))
      output.push(`${maths.round(current.average, 4)}ms`)

      stdout.write(`${output.join(' ')}\n`)

    })

    stdout.write('\n')

  }

}
