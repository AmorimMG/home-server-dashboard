import { ArrowPathIcon, ArrowsPointingOutIcon, PowerIcon } from "@heroicons/react/20/solid";
import { Connection, createConnection, createLongLivedTokenAuth, entitiesColl, subscribeEntities } from "home-assistant-js-websocket";
import { memo, useEffect, useState } from "react";
import Button from "./Button";
import Lights from "./Lights";

const hassUrl = process.env.NEXT_PUBLIC_HASS_URL || "";
const hassToken = process.env.NEXT_PUBLIC_HASS_TOKEN || "";

let connection: Connection;

async function createHassConnection() {
  const auth = createLongLivedTokenAuth(hassUrl, hassToken);
  try {
    connection = await createConnection({ auth });
    subscribeEntities(connection, (ent) => {});
    return true;
  } catch (error) {
    console.error("Connection Error:", error);
    return false;
  }
}

const Buttons = () => {
  const [bedroomSwitchState, setBedroomSwitchState] = useState(false);
  const [corridorSwitchState, setCorridorSwitchState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const initializeConnection = async () => {
      setConnectionError(false);
      const connectionSuccess = await createHassConnection();

      if (connectionSuccess) {
        setTimeout(() => {
          try {
            const coll: any = entitiesColl(connection);
            if (coll) {
              setBedroomSwitchState(coll.state['switch.lampada_porta_gabriel_switch_1']?.state === "on");
            } else {
              console.warn("Bedroom switch not found!");
            }

            if (coll) {
              setCorridorSwitchState(coll.state['switch.quarto_gabriel_switch_1']?.state === "on");
            } else {
              console.warn("Corridor switch not found!");
            }
          } catch (error) {
            console.error("Error fetching switch state:", error);
            setConnectionError(true);
          }
        }, 2000);
      } else {
        setConnectionError(true);
      }
      setLoading(false);
    };

    initializeConnection();

    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, []);

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
        domain: "switch",
        service: "toggle",
        target: {
          entity_id: entity,
        },
      });

      if (entity === "switch.quarto_gabriel_switch_1") {
        setBedroomSwitchState((prev) => !prev);
      }
      if (entity === "switch.lampada_porta_gabriel_switch_1") {
        setCorridorSwitchState((prev) => !prev);
      }
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-2 w-[10rem]">
      {loading ? (
        <div>Loading...</div>
      ) : connectionError ? (
        <div>Error connecting to Home Assistant</div>
      ) : (
        <>
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
              onClick={fullScreenHandler}
            >
              <ArrowsPointingOutIcon className="w-6" />
            </Button>
          </div>

          <Lights
            label="Bedroom"
            entity="switch.quarto_gabriel_switch_1"
            initialValue={bedroomSwitchState}
            toggleLights={() => fireHassEvent("switch.quarto_gabriel_switch_1")}
          />
          <Lights
            label="Corridor"
            entity="switch.lampada_porta_gabriel_switch_1"
            initialValue={corridorSwitchState}
            toggleLights={() => fireHassEvent("switch.lampada_porta_gabriel_switch_1")}
          />
          <Button id="btn-power-1" className="h-[5rem]" onClick={() => fireHassEvent("switch.some_switch_1")}>
            <PowerIcon className="w-12" />
          </Button>
          <Button id="btn-power-2" className="h-[5rem]" onClick={() => fireHassEvent("switch.some_switch_2")}>
            <PowerIcon className="w-12" />
          </Button>
        </>
      )}
    </div>
  );
};

export default memo(Buttons);
