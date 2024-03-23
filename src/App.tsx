/* eslint-disable @typescript-eslint/no-explicit-any */
import Geogebra, { Props as GGParams } from 'react-geogebra'
import { Shot } from '../proto/protobuf/Shot'
import { ShotType } from '../proto/protobuf/ShotType'
import { ShowShotsRequest } from '../proto/protobuf/ShowShotsRequest'
import { TableState } from '../proto/protobuf/TableState'

declare global {
  interface Window {
    app: any
  }
}

let showShotCounter: number = 0
let shots: Shot[] = []
let tableState: TableState = { balls: [] }
let app: any

const newSocket = new WebSocket('ws://localhost:8080/ws')
newSocket.onopen = () => console.log('connected')
newSocket.onclose = () => console.log('disconnected')
newSocket.onmessage = handleReceiveShots

//https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters
const params: GGParams = {
  id: 'app',
  width: window.innerWidth,
  height: window.innerHeight,
  showMenuBar: true,
  showToolBar: false,
  showAlgebraInput: true,
  borderColor: '#fff',
  appletOnLoad: () => (app = window.app),
}

window.onresize = () => {
  app.setWidth(window.innerWidth)
  app.setHeight(window.innerHeight)
}

function App() {
  return <Geogebra {...params} />
}

function handleReceiveShots(e: MessageEvent<any>) {
  showShotCounter = 0
  const showShotsRequest: ShowShotsRequest = JSON.parse(e.data)
  shots = showShotsRequest.shots ?? []
  tableState = showShotsRequest.tableState ?? { balls: [] }
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

function addBtns() {
  const btnBar = document.querySelectorAll('div.toolBPanel.overflow')[0]
  const btn = btnBar.querySelector('div > div > ul > li:nth-child(2)')?.cloneNode(true) as HTMLElement

  const oldBtnBars = btnBar?.parentNode?.querySelectorAll('#newBtnBar')
  oldBtnBars?.forEach((oldBtnBar) => oldBtnBar.remove())

  const newBtnBar = btnBar?.cloneNode(true) as HTMLElement
  newBtnBar.id = 'newBtnBar'

  const ul = newBtnBar.getElementsByClassName('toolbar_mainItem')[0]
  const prevBtn = btn?.cloneNode(true) as HTMLElement
  const nextBtn = btn?.cloneNode(true) as HTMLElement

  prevBtn?.addEventListener('click', () => handleNextShot(false))
  nextBtn?.addEventListener('click', () => handleNextShot(true))

  prevBtn.style.paddingLeft = '5px'
  prevBtn.style.borderLeft = '1px solid #ccc'

  const prevBtnDiv = prevBtn.firstChild as HTMLElement
  const nextBtnDiv = nextBtn.firstChild as HTMLElement
  prevBtnDiv.innerText = 'Prev'
  nextBtnDiv.innerText = 'Next'
  prevBtnDiv.style.display = 'flex'
  nextBtnDiv.style.display = 'flex'
  prevBtnDiv.style.alignItems = 'center'
  nextBtnDiv.style.alignItems = 'center'

  ul.replaceChildren()
  ul.appendChild(prevBtn)
  ul.appendChild(nextBtn)

  const index = document.createElement('li')
  index.textContent = `${showShotCounter + 1}/${shots.length}`
  index.style.display = 'initial'

  ul?.appendChild(index)

  btnBar?.insertAdjacentElement('afterend', newBtnBar)
}

/////////////////////////////////////////////////
//https://wiki.geogebra.org/en/Reference:JavaScript

const ballColors = [
  [0, 0, 0], // White -> black for visual presentation
  [234, 220, 93], // Yellow
  [56, 121, 171], // Blue
  [219, 72, 65], // Red
  [137, 133, 171], // Purple
  [230, 140, 72], // Orange
  [75, 133, 88], // Green
  [165, 67, 67], // Dark red
  [32, 30, 31], // Black
]

const TABLE_WIDTH = 1.116
const TABLE_LENGTH = 2.236
const BALL_RADIUS = 0.028575
const CORNER_POCKET_WIDTH = 0.11
const SIDE_POCKET_WIDTH = 0.12

function resetApp() {
  app.newConstruction()

  const canvas: HTMLCanvasElement | null = document.querySelectorAll('canvas')[1]

  const width = parseFloat(canvas!.style.width)
  const height = parseFloat(canvas!.style.height)
  const ratio = width / height
  const xStartPoint = -0.6
  const yStartPoint = -0.2
  const yRange = 2.5

  app.setCoordSystem(xStartPoint, xStartPoint + yRange * ratio, yStartPoint, yStartPoint + yRange)
  app.setAxesVisible(false, false)
  app.setGridVisible(false)
  addBtns()
}

function drawTable() {
  // Draw outline
  let line
  line = app.evalCommandGetLabels(`Segment((0, 0), (${TABLE_WIDTH}, 0))`)
  app.setLabelVisible(line, false)
  line = app.evalCommandGetLabels(`Segment((0, 0), (0, ${TABLE_LENGTH}))`)
  app.setLabelVisible(line, false)
  line = app.evalCommandGetLabels(`Segment((${TABLE_WIDTH}, ${TABLE_LENGTH}),(${TABLE_WIDTH}, 0))`)
  app.setLabelVisible(line, false)
  line = app.evalCommandGetLabels(`Segment((0, ${TABLE_LENGTH}),(${TABLE_WIDTH}, ${TABLE_LENGTH}))`)
  app.setLabelVisible(line, false)

  //Draw balls
  for (const ball of tableState.balls ?? []) {
    const ballPoint = app.evalCommandGetLabels(`(${ball.pos?.x}, ${ball.pos?.y})`)
    const ballCircle = app.evalCommandGetLabels(`Circle(${ballPoint}, ${BALL_RADIUS})`)
    const ballNumber: number = ball.number ?? 0
    const ballCol = ballColors[ballNumber]
    app.setColor(ballPoint, 0, 0, 0)
    app.setColor(ballCircle, ballCol[0], ballCol[1], ballCol[2])
    app.setFilling(ballCircle, 0.5)
    app.setLabelVisible(ballPoint, false)
    app.setLabelVisible(ballCircle, false)
  }

  //Draw pockets
  const diagonalWidth = CORNER_POCKET_WIDTH / Math.sqrt(2)
  const straightWidth = SIDE_POCKET_WIDTH / 2.0

  const pocketPoints = [
    [TABLE_WIDTH - diagonalWidth, TABLE_LENGTH],
    [TABLE_WIDTH, TABLE_LENGTH - diagonalWidth],
    [TABLE_WIDTH, TABLE_LENGTH / 2.0 + straightWidth],
    [TABLE_WIDTH, TABLE_LENGTH / 2.0 - straightWidth],
    [TABLE_WIDTH, diagonalWidth],
    [TABLE_WIDTH - diagonalWidth, 0.0],
    [diagonalWidth, 0.0],
    [0.0, diagonalWidth],
    [0.0, TABLE_LENGTH / 2.0 - straightWidth],
    [0.0, TABLE_LENGTH / 2.0 + straightWidth],
    [0.0, TABLE_LENGTH - diagonalWidth],
    [diagonalWidth, TABLE_LENGTH],
  ]

  for (const pocketPoint of pocketPoints) {
    const point = app.evalCommandGetLabels(`(${pocketPoint[0]}, ${pocketPoint[1]})`)
    app.setColor(point, 0, 0, 0)
    app.setLabelVisible(point, false)
  }
}

function drawShot(shot: Shot) {
  //draw ball
  const ballPoint = app.evalCommandGetLabels(`(${shot.posB1?.x}, ${shot.posB1?.y})`)
  const ballCircle = app.evalCommandGetLabels(`Circle(${ballPoint}, ${BALL_RADIUS})`)
  const ballNumber: number = shot.b2 ?? 0
  const ballCol = shot.type == ShotType.CUE_STRIKE ? ballColors[0] : ballColors[ballNumber] ?? [0, 0, 0]
  app.setColor(ballPoint, 0, 0, 0)
  app.setColor(ballCircle, ballCol[0], ballCol[1], ballCol[2])
  app.setFilling(ballCircle, 0.5)
  app.setLabelVisible(ballPoint, false)
  app.setLabelVisible(ballCircle, false)

  //draw ghostballs
  const leftMostPoint = app.evalCommandGetLabels(`(${shot.leftMost?.x}, ${shot.leftMost?.y})`)
  const leftMostCircle = app.evalCommandGetLabels(`Circle(${leftMostPoint}, ${BALL_RADIUS})`)
  app.setColor(leftMostCircle, 255, 0, 0)
  app.setColor(leftMostPoint, 0, 0, 0)
  app.setLabelVisible(leftMostPoint, false)
  app.setLabelVisible(leftMostCircle, false)

  const rightMostPoint = app.evalCommandGetLabels(`(${shot.rightMost?.x}, ${shot.rightMost?.y})`)
  const rightMostCircle = app.evalCommandGetLabels(`Circle(${rightMostPoint}, ${BALL_RADIUS})`)
  app.setColor(rightMostCircle, 0, 0, 255)
  app.setColor(rightMostPoint, 0, 0, 0)
  app.setLabelVisible(rightMostPoint, false)
  app.setLabelVisible(rightMostCircle, false)

  if (shot.next) {
    //draw lines
    const leftMostline = app.evalCommandGetLabels(
      `Segment(${rightMostPoint}, (${shot.next.leftMost?.x}, ${shot.next.leftMost?.y}))`
    )
    app.setColor(leftMostline, 255, 0, 0)
    app.setLabelVisible(leftMostline, false)

    const rightMostline = app.evalCommandGetLabels(
      `Segment(${leftMostPoint}, (${shot.next.rightMost?.x}, ${shot.next.rightMost?.y}))`
    )
    app.setColor(rightMostline, 0, 0, 255)
    app.setCaption(rightMostline, shot.next.id)
    app.setLabelStyle(rightMostline, 3)

    drawShot(shot.next)
  }
  if (shot.branch) {
    const leftMostline = app.evalCommandGetLabels(
      `Segment(${rightMostPoint}, (${shot.branch.leftMost?.x}, ${shot.branch.leftMost?.y}))`
    )
    app.setColor(leftMostline, 255, 0, 0)
    app.setLabelVisible(leftMostline, false)

    const rightMostline = app.evalCommandGetLabels(
      `Segment(${leftMostPoint}, (${shot.branch.rightMost?.x}, ${shot.branch.rightMost?.y}))`
    )
    app.setColor(rightMostline, 0, 0, 255)
    app.setCaption(rightMostline, shot.branch.id)
    app.setLabelStyle(rightMostline, 3)

    drawShot(shot.branch)
  }
}

export default App
