import "./App.css";
import Geogebra, { Props as GGParams } from "react-geogebra";
import GrpcServer from "./GrpcServer";

const params: GGParams = {
	id: "app",
	width: 800,
	height: 600,
	showMenuBar: true,
	showToolBar: false,
	showAlgebraInput: true,
	appletOnLoad: () => {}
};

const server = new GrpcServer(window.app);
server.start("0.0.0.0", 50052);

function App() {
	return <Geogebra {...params} />;
}

export default App;
