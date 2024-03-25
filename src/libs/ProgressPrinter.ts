// IMPORTS
import { formatters } from '../utils/formatters'
import { stdout } from 'process'

// INTERFACE
export interface ProgressPrinter {
  start: (total: number) => void
  refresh: (current: number, total: number) => void
  done: (total: number) => void
}

// CLASS
export class NoProgressPrinter implements ProgressPrinter {

  // METHODS
  public start (): void {}
  public refresh (): void {}
  public done (): void {}

}

// CLASS
export class ConsoleProgressPrinter implements ProgressPrinter {

  // PROPERTIES
  private _start: number = 0
  private _checkpoint: number = 0

  // METHOD
  public start (total: number): void {

    this._start = performance.now()
    this._checkpoint = this._start

    stdout.write(`\nCompleted 0% of ${total} repetitions\n`)
    stdout.write('Calculating remaining time ...\n')

  }

  // METHOD
  public refresh (current: number, total: number): void {

    const now = performance.now()
    const diff = now - this._checkpoint

    if (diff < 50) return
    this._checkpoint = now

    const elapsed = now - this._start
    const remaining = elapsed / current * (total - current)

    const progress = current * 100 / total

    stdout.write('\x1B[3A\x1B[0J')
    stdout.write(`\nCompleted ${progress.toFixed(0)}% of ${total} repetitions\n`)
    stdout.write(`Remaining time ${formatters.time(remaining)}\n`)

  }

  // METHOD
  public done (total: number): void {

    const now = performance.now()
    const elapsed = now - this._start

    stdout.write('\x1B[3A\x1B[0J')
    stdout.write(`\nCompleted ${total} repetitions in ${formatters.time(elapsed)}\n\n`)

  }

}
