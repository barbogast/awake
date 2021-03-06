import { h, Fragment } from 'preact'

import World from './sim/world'
import { Object1 } from './types'

type x = {
  objectList: Object1[]
  name: string
}

const SimpleObjectList = ({ objectList, name }: x) => {
  return (
    <div>
      {name}: <span>{objectList.map((obj) => obj.debugInfo()).join(', ')}</span>
    </div>
  )
}

const ObjectList = ({ objectList, name }: x) => {
  return (
    <div>
      {name}
      <ul>
        {objectList.map((obj) => (
          <li>{JSON.stringify(obj.debugInfo())}</li>
        ))}
      </ul>
    </div>
  )
}

const Dashboard = ({ world }: { world: World }) => {
  return (
    <>
      Number of objects: {world.objects.length}
      <br />
      Timers: {JSON.stringify(world.timers)}
      <br />
      <br />
      {Object.entries(world.getObjectsByType()).map(([type, objList]) =>
        ['Apple', 'Pear'].includes(type) ? (
          <SimpleObjectList name={type} objectList={objList} />
        ) : (
          <ObjectList name={type} objectList={objList} />
        ),
      )}
    </>
  )
}

export default Dashboard
