//  IMPORTS
import { type CodePerformance } from './interfaces'
import { getBorderCharacters, table } from 'table'
import { dictionary } from '@shvmerc/development'
import { maths } from '../utils/maths'
import { stdout } from 'process'
import chalk from 'chalk'

// TYPES
const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'] as const
export type Color = typeof colors[number]

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
  public print (options: {
    target?: string | number
    highlight?: Partial<Record<Color, string>>
  } = {}): void {

    const performances = dictionary(this._performances).map((current) => {
      const average = maths.average(...current.values)
      const difference = 0
      return { ...current, average, difference }
    })

    let target = (typeof options.target === 'number') ? options.target : 0
    if (typeof options.target === 'string') {
      if (performances[options.target] !== undefined) target = performances[options.target].average
    }

    const array = dictionary(performances).array((current) => (current))
    array.sort((a, b) => (a.index - b.index))

    if (array.length < 1) {
      stdout.write('No results to display!\n')
      return
    }

    const utils = array.reduce((prev, current) => {
      prev.maxAverage = Math.max(prev.maxAverage, current.average)
      prev.minAverage = Math.min(prev.minAverage, current.average)
      prev.maxNameSize = Math.max(prev.maxNameSize, current.name.length)
      return prev
    }, { minAverage: Infinity, maxAverage: 0, maxNameSize: 0 })

    if (options.target === undefined) target = utils.minAverage

    const colors = dictionary(options.highlight ?? {}).remake((name, color) => {
      return [name, color as Color]
    })

    const output: Array<Array<string>> = []

    array.forEach((current) => {

      const progress = current.average * 100 / utils.maxAverage
      const difference = maths.round((current.average * 100 / target) - 100)

      const highlight = colors[current.name] ?? 'reset'
      const bar = progressBar(progress, 50)
      const decorator = (difference > 0) ? '+' : (difference < 0) ? '-' : '•'
      const color = (difference > 0) ? 'red' : (difference < 0) ? 'green' : 'yellow'

      output.push([
        current.name.padStart(utils.maxNameSize, ' '),
        chalk.bold[color](decorator),
        (difference === 0) ? '-' : Math.abs(difference) + '%',
        `${chalk.bold[highlight](bar)} ${maths.round(current.average, 4)}ms`,
      ])

    })

    stdout.write(table(output, {
      border: getBorderCharacters('void'),
      columns: {
        2: { alignment: 'right' },
      },
      columnDefault: {
        paddingLeft: 0,
        paddingRight: 1,
      },
      drawHorizontalLine: () => false,
    }) + '\n')

  }

}
