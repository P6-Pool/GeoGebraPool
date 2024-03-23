/* eslint-disable @typescript-eslint/no-explicit-any */
import Geogebra, { Props as GGParams } from 'react-geogebra'
import { Shot } from '../proto/protobuf/Shot'
import { ShotType } from '../proto/protobuf/ShotType'

declare global {
  interface Window {
    app: any
  }
}

let showShotCounter: number = 0
let shots: Shot[] = []
let app: any

const params: GGParams = {
  id: 'app',
  width: window.innerWidth,
  height: window.innerHeight - 50,
  showMenuBar: true,
  showToolBar: false,
  showAlgebraInput: true,
  appletOnLoad: () => (app = window.app),
}

const newSocket = new WebSocket('ws://localhost:8080/ws')
newSocket.onopen = () => console.log('connected')
newSocket.onclose = () => console.log('disconnected')
newSocket.onmessage = handleReceiveShots

function App() {
  return (
    <>
      <button onClick={() => handleNextShot(true)}>Next</button>
      <button onClick={() => handleNextShot(false)}>Prev</button>
      <Geogebra {...params} />
    </>
  )
}

function handleReceiveShots(e: MessageEvent<any>) {
  showShotCounter = 0
  shots = JSON.parse(e.data)
  resetApp()
  drawTable()
  drawShot(shots[showShotCounter])
}

function handleNextShot(isNext: boolean) {
  if (shots.length === 0) return
  showShotCounter += isNext ? 1 : -1
  showShotCounter = (showShotCounter + shots.length) % shots.length
  resetApp()
  drawTable()
  drawShot(shots[showShotCounter])
}

const ballColors = {
  0: [0, 0, 0], // White -> black for visual presentation
  1: [234, 220, 93], // Yellow
  2: [56, 121, 171], // Blue
  3: [219, 72, 65], // Red
  4: [137, 133, 171], // Purple
  5: [230, 140, 72], // Orange
  6: [75, 133, 88], // Green
  7: [165, 67, 67], // Dark red
  8: [32, 30, 31], // Black
}

const TABLE_WIDTH = 1.116
const TABLE_HEIGHT = 2.236
const BALL_RADIUS = 0.028575

function resetApp() {
  app.newConstruction()
  app.setCoordSystem(-0.2, 2.3, -0.2, 2.3)
  app.setAxesVisible(false, false)
  app.setGridVisible(false)
}

function drawTable() {
  let line
  line = app.evalCommandGetLabels(`Segment((0, 0), (${TABLE_WIDTH}, 0))`)
  app.setLabelVisible(line, false)
  line = app.evalCommandGetLabels(`Segment((0, 0), (0, ${TABLE_HEIGHT}))`)
  app.setLabelVisible(line, false)
  line = app.evalCommandGetLabels(`Segment((${TABLE_WIDTH}, ${TABLE_HEIGHT}),(${TABLE_WIDTH}, 0))`)
  app.setLabelVisible(line, false)
  line = app.evalCommandGetLabels(`Segment((0, ${TABLE_HEIGHT}),(${TABLE_WIDTH}, ${TABLE_HEIGHT}))`)
  app.setLabelVisible(line, false)
}

function drawShot(shot: Shot) {
  //draw ball
  const ballPoint = app.evalCommandGetLabels(`(${shot.posB1?.x}, ${shot.posB1?.y})`)
  const ballCircle = app.evalCommandGetLabels(`Circle(${ballPoint}, ${BALL_RADIUS})`)
  const ballCol = shot.type == ShotType.CUE_STRIKE ? ballColors[0] : ballColors[shot.b2] ?? [0, 0, 0]
  app.setColor(ballPoint, 0, 0, 0)
  app.setColor(ballCircle, ballCol[0], ballCol[1], ballCol[2])
  app.setFilling(ballCircle, 0.5)
  app.setLabelVisible(ballPoint, false)
  app.setLabelVisible(ballCircle, false)

  //draw ghostballs
  const leftMostPoint = app.evalCommandGetLabels(`(${shot.rightMost?.x}, ${shot.rightMost?.y})`)
  const leftMostCircle = app.evalCommandGetLabels(`Circle(${leftMostPoint}, ${BALL_RADIUS})`)
  app.setColor(leftMostCircle, 255, 0, 0)
  app.setColor(leftMostPoint, 0, 0, 0)
  app.setLabelVisible(leftMostPoint, false)
  app.setLabelVisible(leftMostCircle, false)

  const rightMostPoint = app.evalCommandGetLabels(`(${shot.leftMost?.x}, ${shot.leftMost?.y})`)
  const rightMostCircle = app.evalCommandGetLabels(`Circle(${rightMostPoint}, ${BALL_RADIUS})`)
  app.setColor(rightMostCircle, 0, 0, 255)
  app.setColor(rightMostPoint, 0, 0, 0)
  app.setLabelVisible(rightMostPoint, false)
  app.setLabelVisible(rightMostCircle, false)

  if (shot.next) {
    //draw lines
    const rightMostline = app.evalCommandGetLabels(
      `Segment((${shot.rightMost?.x}, ${shot.rightMost?.y}), (${shot.next.leftMost?.x}, ${shot.next.leftMost?.y}))`
    )
    app.setColor(rightMostline, 0, 0, 255)
    app.setLabelVisible(rightMostline, false)

    const leftMostline = app.evalCommandGetLabels(
      `Segment((${shot.leftMost?.x}, ${shot.leftMost?.y}), (${shot.next.rightMost?.x}, ${shot.next.rightMost?.y}))`
    )
    app.setColor(leftMostline, 255, 0, 0)
    app.setLabelVisible(leftMostline, false)

    drawShot(shot.next)
  }
  if (shot.branch) {
    drawShot(shot.branch)
  }
}

export default App
