import { Object1 } from '../types.js'
import { getCurrentTimestamp } from './utils.js'

class Log {
  #entries: {
    objectType: string
    id: string
    time: number
    message: string
  }[]

  constructor() {
    this.#entries = []
  }

  addEntry(message: string, obj: Object1) {
    this.#entries.push({
      time: getCurrentTimestamp(),
      message,
      id: obj.id,
      objectType: obj.type,
    })
  }

  getEntries() {
    return this.#entries
  }
}

export default Log
