import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { Empty } from "../proto/google/protobuf/Empty";
import { ProtoGrpcType } from "../proto/api";
import { JPoolAPIHandlers } from "../proto/protobuf/JPoolAPI";
import { ShowShotsRequest } from "../proto/protobuf/ShowShotsRequest";

const PROTO_PATH = __dirname + "/../fastfiz-renderer-protobuffers/api.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});
const api_proto = grpc.loadPackageDefinition(
	packageDefinition
) as unknown as ProtoGrpcType;

class GrpcServer {
	app;
	server: grpc.Server;

	constructor(app: any) {
		this.app = app;

		this.server = new grpc.Server();
		const service: JPoolAPIHandlers = {
			ShowShots: this.ShowShots
		};

		this.server.addService(api_proto.protobuf.JPoolAPI.service, service);
	}

	ShowShots(
		call: grpc.ServerUnaryCall<ShowShotsRequest, Empty>,
		callback: grpc.sendUnaryData<Empty>
	) {
		for (const shot of call.request.shots) {
			this.app.evalCommand(
				`Circle((${shot.leftMost?.x}, ${shot.leftMost?.y}), ${0.028})`
			);
		}

		callback(null, {
			message: `Shots received`
		});
	}

	start(adress: string, port: number) {
		this.server.bindAsync(
			`${adress}:${port}`,
			grpc.ServerCredentials.createInsecure(),
			() => {
				this.server.start();
			}
		);
	}
}

export default GrpcServer;
