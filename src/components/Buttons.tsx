import { ArrowPathIcon, ArrowsPointingOutIcon, PowerIcon } from "@heroicons/react/20/solid";
import { Connection, createConnection, createLongLivedTokenAuth } from "home-assistant-js-websocket";
import { memo } from "react";
import Button from "./Button";
import Lights from "./Lights";

/*
 * I'm building another WS connection here, same as the server side, because on client side
 * the events will be fired to a local network IP address, so if you're not on the same network
 * as the HomeAssistant server this won't work, and nobody outside my local network are gonna mess
 * with my devices xD, while they will get the devices infos cause it'll come from the server side.
 */
const hassUrl = process.env.NEXT_PUBLIC_HASS_URL || "";
const hassToken = process.env.NEXT_PUBLIC_HASS_TOKEN || "";
console.log(hassToken);
console.log(hassUrl);

let connection: Connection;

async function createHassConnection() {
  try {
    const auth = createLongLivedTokenAuth(hassUrl, hassToken);
    connection = await createConnection({ auth });
  } catch (error) {
    console.log(error);
  }
}
createHassConnection();

const Buttons = () => {
  const fullScreenHandler = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const fireHassEvent = async (entity: string) => {
    if (connection) {
      await connection.sendMessage({
        type: "call_service",
        domain: "light",
        service: "toggle",
        target: {
          entity_id: entity,
        },
      });
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-2 w-[10rem]">
      <div className="flex flex-row w-full gap-2">
        <Button
          id="btn-reload"
          className="w-full py-2"
          onClick={() => {
            window.location.reload();
          }}
        >
          <ArrowPathIcon className="w-6" />
        </Button>
        <Button
          id="btn-fullscreen"
          className="w-full py-2"
          onClick={() => {
            fullScreenHandler();
          }}
        >
          <ArrowsPointingOutIcon className="w-6" />
        </Button>
      </div>

      <Lights label="Bedroom" entity="light.luz_quarto" initialValue={false} toggleLights={fireHassEvent} />
      <Lights label="Corridor" entity="light.luz_corredor" initialValue={false} toggleLights={fireHassEvent} />
      <Button id="btn-1" className="h-[5rem]">
        <PowerIcon className="w-12" />
      </Button>
      <Button id="btn-1" className="h-[5rem]">
        <PowerIcon className="w-12" />
      </Button>
    </div>
  );
};
export default memo(Buttons);
