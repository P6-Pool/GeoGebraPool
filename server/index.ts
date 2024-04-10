import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { Empty } from '../proto/google/protobuf/Empty'
import { ProtoGrpcType } from '../proto/api'
import { JPoolAPIHandlers } from '../proto/protobuf/JPoolAPI'
import { ShowShotsRequest } from '../proto/protobuf/ShowShotsRequest'
import { WebSocketServer } from 'ws'

const PROTO_PATH = __dirname + '/../fastfiz-renderer-protobuffers/api.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const api_proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType

function ShowShots(call: grpc.ServerUnaryCall<ShowShotsRequest, Empty>, callback: grpc.sendUnaryData<Empty>) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(call.request))
  })

  callback(null, {
    message: `Shots received`,
  })
}

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(data) {
    console.log('received: %s', data)
  })
})

const grpcServer = new grpc.Server()
const service: JPoolAPIHandlers = { ShowShots: ShowShots }

grpcServer.addService(api_proto.protobuf.CueCanvasAPI.service, service)
grpcServer.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {})
