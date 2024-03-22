import { useEffect } from "react";
import Geogebra, { Props as GGParams } from "react-geogebra";
import { Shot } from "../proto/protobuf/Shot";
import { ShotType } from "../proto/protobuf/ShotType";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		app: any;
	}
}

const ball_colors = {
	0: [0, 0, 0], // White -> black for visual presentation
	1: [234, 220, 93], // Yellow
	2: [56, 121, 171], // Blue
	3: [219, 72, 65], // Red
	4: [137, 133, 171], // Purple
	5: [230, 140, 72], // Orange
	6: [75, 133, 88], // Green
	7: [165, 67, 67], // Dark red
	8: [32, 30, 31] // Black
};

const params: GGParams = {
	id: "app",
	width: 1600,
	height: 1200,
	showMenuBar: true,
	showToolBar: false,
	showAlgebraInput: true,
	appletOnLoad: () => {}
};

window.app = {};
let showShotCounter: number = 0;
let shots: Shot[];

window.onkeyup = (e: KeyboardEvent) => {
	const app = window.app;
	app.newConstruction();
	drawTable(app);
	switch (e.key) {
		case "ArrowRight":
			// go next shot
			showShotCounter = (showShotCounter + 1) % shots.length;
			drawShot(shots[showShotCounter], app);
			break;
		case "ArrowLeft":
			// go previous shot
			showShotCounter = (showShotCounter - 1 + shots.length) % shots.length;
			drawShot(shots[showShotCounter], app);
			break;
	}
};

function App() {
	useEffect(() => {
		const newSocket = new WebSocket("ws://localhost:8080/ws");
		newSocket.onopen = () => console.log("connected");
		newSocket.onclose = () => console.log("disconnected");

		newSocket.onmessage = (e) => {
			const app = window.app;
			showShotCounter = 0;
			drawTable(app);
			shots = JSON.parse(e.data);
			drawShot(shots[showShotCounter], app);
		};
	}, []);

	return <Geogebra {...params} />;
}

function drawTable(app) {
	app.setCoordSystem(-0.2, 2.3, -0.2, 2.3);
	let line;
	line = app.evalCommandGetLabels(`Segment((0, 0), (1.116, 0))`);
	app.setLabelVisible(line, false);
	line = app.evalCommandGetLabels(`Segment((1.116, 2.236),(1.116, 0))`);
	app.setLabelVisible(line, false);
	line = app.evalCommandGetLabels(`Segment((0, 2.236),(1.116, 2.236))`);
	app.setLabelVisible(line, false);
	line = app.evalCommandGetLabels(`Segment((0, 0), (0, 2.236))`);
	app.setLabelVisible(line, false);
}

function drawShot(shot: Shot, app) {
	//draw ball
	const ball_center = app.evalCommandGetLabels(
		`(${shot.posB1?.x}, ${shot.posB1?.y})`
	);
	const ball_circle = app.evalCommandGetLabels(
		`Circle(${ball_center}, 0.028575)`
	);
	app.setColor(ball_center, 0, 0, 0);
	if (
		shot.type == ShotType.KISS_LEFT ||
		shot.type == ShotType.KISS_RIGHT ||
		shot.type == ShotType.BALL_BOTH
	) {
		const ball_col = ball_colors[shot.b2];
		app.setColor(ball_circle, ball_col[0], ball_col[1], ball_col[2]);
		app.setFilling(ball_circle, 0.5);
	} else if (shot.type == ShotType.CUE_STRIKE) {
		const ball_col = ball_colors[shot.b1];
		app.setColor(ball_circle, ball_col[0], ball_col[1], ball_col[2]);
		app.setFilling(ball_circle, 0.5);
	}
	app.setLabelVisible(ball_center, false);
	app.setLabelVisible(ball_circle, false);

	//draw ghostballs
	let point = app.evalCommandGetLabels(
		`(${shot.rightMost?.x}, ${shot.rightMost?.y})`
	);

	let circle = app.evalCommandGetLabels(`Circle(${point}, 0.028575)`);
	app.setColor(circle, 255, 0, 0);
	app.setColor(point, 0, 0, 0);
	app.setLabelVisible(point, false);
	app.setLabelVisible(circle, false);

	point = app.evalCommandGetLabels(
		`(${shot.leftMost?.x}, ${shot.leftMost?.y})`
	);
	circle = app.evalCommandGetLabels(`Circle(${point}, 0.028575)`);
	app.setColor(circle, 0, 0, 255);
	app.setColor(point, 0, 0, 0);
	app.setLabelVisible(point, false);
	app.setLabelVisible(circle, false);

	if (shot.next) {
		//draw lines
		let line;
		line = app.evalCommandGetLabels(
			`Segment((${shot.rightMost?.x}, ${shot.rightMost?.y}), (${shot.next.leftMost?.x}, ${shot.next.leftMost?.y}))`
		);
		app.setColor(line, 0, 0, 255);
		app.setLabelVisible(line, false);

		line = app.evalCommandGetLabels(
			`Segment((${shot.leftMost?.x}, ${shot.leftMost?.y}), (${shot.next.rightMost?.x}, ${shot.next.rightMost?.y}))`
		);
		app.setColor(line, 255, 0, 0);
		app.setLabelVisible(line, false);

		drawShot(shot.next, app);
	}
	if (shot.branch) {
		drawShot(shot.branch, app);
	}
}

export default App;
