import { useEffect } from 'react'
import Geogebra, { Props as GGParams } from 'react-geogebra'
import { Shot } from '../proto/protobuf/Shot'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app: any
  }
}

const params: GGParams = {
  id: 'app',
  width: 800,
  height: 600,
  showMenuBar: true,
  showToolBar: false,
  showAlgebraInput: true,
  appletOnLoad: () => {},
}

window.app = {}

window.onkeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const app = window.app
    const input = app.getAlgebraInput()
    app.evalCommand(input)
  }
}

function App() {
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080/ws')
    newSocket.onopen = () => console.log('connected')
    newSocket.onclose = () => console.log('disconnected')

    newSocket.onmessage = (e) => {
      const shots: Shot[] = JSON.parse(e.data)
      drawShot(shots[0])
    }
  }, [])

  return <Geogebra {...params} />
}

function drawShot(shot: Shot) {
  const app = window.app
  app.evalCommand(`A = (${shot.rightMost?.x}, ${shot.rightMost?.y})`)
}

export default App
