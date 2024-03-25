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
    target?: string
    sort?: 'default' | 'ascending' | 'descending'
    highlight?: Partial<Record<Color, string>>
  } = {}): void {

    const performances = dictionary(this._performances).map((current) => {
      const average = maths.average(...current.values)
      const difference = 0
      return { ...current, average, difference }
    })

    const array = dictionary(performances).array((current) => (current))

    const sort = options.sort ?? 'default'
    array.sort((a, b) => {
      if (sort === 'ascending') return (a.average - b.average)
      if (sort === 'descending') return (b.average - a.average)
      return (a.index - b.index)
    })

    if (array.length < 1) {
      stdout.write('No results to display!\n')
      return
    }

    const data = array.reduce((prev, current) => {
      prev.max = Math.max(prev.max, current.average)
      prev.min = Math.min(prev.min, current.average)
      return prev
    }, { min: Infinity, max: 0 })

    let target = data.min

    if (options.target !== undefined) {
      const item = performances[options.target]
      if (item !== undefined) target = item.average
    }

    const colors = dictionary(options.highlight ?? {}).remake((name, color) => {
      return [name, color as Color]
    })

    const output: Array<Array<string>> = []

    array.forEach((current) => {

      const progress = current.average * 100 / data.max
      const difference = maths.round((current.average * 100 / target) - 100)

      const highlight = colors[current.name] ?? 'reset'
      const bar = progressBar(progress, 50)
      const decorator = (difference > 0) ? '+' : (difference < 0) ? '-' : '•'
      const color = (difference > 0) ? 'red' : (difference < 0) ? 'green' : 'yellow'

      output.push([
        current.name,
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
