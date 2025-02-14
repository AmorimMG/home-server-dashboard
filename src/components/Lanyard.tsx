"use client";
import { USER_ID } from "@/utils/constants";
import axios from "axios";
import { Heart, PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
import Image from "next/image";
import { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Snowflake, useLanyardWS } from "use-lanyard";

let startedTimestamp = 0;
let endTimestamp = 0;

const defaultSong = {
  track: {
    album: {
      images: [
        {
          height: 640,
          url: "https://i.scdn.co/image/ab67616d0000b27398f622b722bb7dea65ca0acf",
          width: 640,
        },
      ],
      name: "hypochondriac",
    },
    artists: [
      {
        name: "brakence",
      },
    ],
    duration_ms: 195882,
    external_urls: {
      spotify: "https://open.spotify.com/track/159CffclwSTvynlA0BUlQG",
    },
    name: "venus fly trap",
  },
  played_at: "2023-02-06T14:16:32.895Z",
};

function getMinuteAndSeconds(date: Date) {
  return date.toLocaleTimeString(navigator.language, {
    minute: "2-digit",
    second: "2-digit",
  });
}

export function Lanyard({ ...props }: ComponentProps<"div">) {
  const [elapsed, setElapsed] = useState<Date | undefined>();
  const [lastPlayed, setLastPlayed] = useState<any>();
  const user = useLanyardWS(USER_ID as Snowflake);

  const duration = user?.spotify?.timestamps
    ? new Date(user.spotify.timestamps.end - user.spotify.timestamps.start)
    : undefined;

  const progress = 100 - (100 * (endTimestamp - Date.now())) / (endTimestamp - startedTimestamp);

  const SPOTIFY_API_URL = "http://api.amorim.pro/spotify";

  // Function to send commands to Spotify API
  const sendCommand = async (command: string) => {
    try {
      const endpoint = `${SPOTIFY_API_URL}/${command}`;
      await axios({
        method: "POST",
        url: endpoint,
      });
    } catch (error) {
      console.error(`Error sending ${command} command:`, error);
    }
  };

  // Playback control functions
  const pauseMusic = () => sendCommand("pause");
  const playMusic = () => sendCommand("play");
  const skipNext = () => sendCommand("next");
  const skipBack = () => sendCommand("previous");

  useEffect(() => {
    if (user?.spotify) {
      if (user.spotify.timestamps.end !== endTimestamp) {
        startedTimestamp = user.spotify.timestamps.start;
        endTimestamp = user.spotify.timestamps.end;
        const interval = setInterval(() => {
          if (Date.now() >= endTimestamp || startedTimestamp !== user?.spotify?.timestamps.start || !user?.spotify)
            clearInterval(interval);
          else setElapsed(new Date(Date.now() - startedTimestamp));
        }, 1000);
        return () => {
          clearInterval(interval);
          startedTimestamp = 0;
          endTimestamp = 0;
        };
      }
    } else {
      setLastPlayed(defaultSong);
    }
  }, [user]);

  return (
    <div
      className={twMerge(
        "group h-auto select-none p-4 hue-rotate-15 backdrop-blur md:h-56 w-2/4 self-center bg-black/50 rounded-md",
        props.className
      )}
    >
      {user ? (
        <div className="lights flex w-full flex-col">
          <div className="flex flex-row gap-4">
            <Image
              quality={50}
              src={user?.spotify?.album_art_url || lastPlayed?.track?.album?.images?.[0]?.url || ""}
              height={94}
              width={94}
              className="h-32 w-32 select-none justify-self-start rounded-lg"
              alt="album cover"
            />
            <div className="flex flex-col justify-center w-full">
              <h2 className="truncate text-3xl font-semibold leading-tight text-pink-100">
                {user?.spotify?.song || lastPlayed?.track?.name}
              </h2>
              <h4 className="truncate text-lg leading-tight text-pink-100 opacity-80">
                by {user?.spotify?.artist || lastPlayed?.track?.artists?.[0]?.name}
              </h4>
              <h4 className="truncate text-lg leading-tight text-pink-100 opacity-80">
                on {user?.spotify?.album || lastPlayed?.track?.album?.name}
              </h4>
              <div className="flex flex-row gap-4 pt-4 w-full items-center justify-center -translate-x-8">
                <SkipBackIcon size={40} className="cursor-pointer" onClick={skipBack} />
                {user?.spotify ? (
                  <PauseIcon size={40} className="cursor-pointer" onClick={pauseMusic} />
                ) : (
                  <PlayIcon size={40} className="cursor-pointer" onClick={playMusic} />
                )}
                <SkipForwardIcon size={40} className="cursor-pointer" onClick={skipNext}/>
                <Heart size={40} className="cursor-pointer" />
              </div>
            </div>
          </div>

          {user?.spotify ? (
            <div className="mt-4 w-full">
              <div className="relative h-2 w-full rounded-md bg-pink-200/20">
                <span
                  className="absolute h-2 rounded-md bg-pink-200/70"
                  style={{ width: `${user?.spotify ? progress : 100}%` }}
                />
              </div>

              <div className="mt-1 flex items-center justify-between px-0.5 text-lg text-pink-100">
                {elapsed ? <span>{getMinuteAndSeconds(elapsed)}</span> : <span>00:00</span>}
                {duration ? <span>{getMinuteAndSeconds(duration)}</span> : <span>00:00</span>}
              </div>
            </div>
          ) : (
            <h2 className="mt-2 w-full select-none text-center text-base font-bold tracking-tighter text-pink-200 sm:text-lg">
              {/* {`last played ${moment(lastPlayed?.played_at || "").fromNow()}`} */}
              {`last song played`}
            </h2>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
