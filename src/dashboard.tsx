import { h, Fragment } from 'preact'

import World from './world'
import { Object1 } from './types'

type x = {
  objectList: Object1[]
  name: string
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
      {Object.entries(world.getObjectsByType()).map(([type, objList]) => (
        <ObjectList name={type} objectList={objList} />
      ))}
    </>
  )
}

export default Dashboard
