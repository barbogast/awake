import { h, Fragment } from 'preact'

import World from './sim/world'

const LogTrail = ({ world }: { world: World }) => {
  if (!world) {
    return null
  }

  return (
    <ul>
      {world.log.getEntries().map((entry) => {
        return (
          <li>
            {entry.objectType} {entry.id}: {entry.message}
          </li>
        )
      })}
    </ul>
  )
}

export default LogTrail
