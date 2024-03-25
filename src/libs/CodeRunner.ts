// IMPORTS
import { NoProgressPrinter, type ProgressPrinter } from './ProgressPrinter'
import { type CodePerformance } from './interfaces'
import { Dictionary } from '@shvmerc/development'

// CLASS
export class CodeRunner {

  // PROPERTIES
  private readonly _performances: Dictionary<CodePerformance>

  // CONSTRUCTOR
  public constructor () {
    this._performances = new Dictionary({})
  }

  // METHOD
  public add (name: string, fn: () => unknown): void {
    const index = this._performances.size()
    const values: Array<number> = []
    this._performances.set(name, { index, name, fn, values })
  }

  // METHOD
  public run (repetitions: number, options: { printer?: ProgressPrinter } = {}): Record<string, CodePerformance> {

    this._performances.forEach((current) => {
      current.values = []
    })

    const printer = options.printer ?? new NoProgressPrinter()
    printer.start(repetitions)

    for (let i = 1; i <= repetitions; i++) {
      this._performances.forEach((current) => {
        const start = performance.now()
        current.fn()
        const end = performance.now()
        current.values.push(end - start)
      })
      printer.refresh(i, repetitions)
    }

    printer.done(repetitions)

    return this._performances.value()

  }

}
