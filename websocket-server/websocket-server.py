import asyncio
import json
import logging
import websockets

logging.basicConfig()

USERS = set()

def getPlayerID():
    return "player" + str(len(USERS));

async def counter(websocket, path):
    try:
        print("connect")
        playerID = getPlayerID()
        USERS.add(websocket)
        await websocket.send(json.dumps({ "playerID": "server", "objectID": "playerManager", "eventType": "setPlayerID", "data": playerID }))
        websockets.broadcast(USERS, json.dumps({ "playerID": "server", "objectID": "playerManager", "eventType": "onPlayerConnect", "data": playerID }))
        async for message in websocket:
            print(message)
            websockets.broadcast(USERS, message)
    finally:
        USERS.remove(websocket)
        websockets.broadcast(USERS, json.dumps({ "playerID": "server", "objectID": "playerManager", "eventType": "onPlayerDisconnect", "data": playerID }))


async def main():
    async with websockets.serve(counter, "localhost", 9876):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())