import { memo, useEffect, useState } from "react";

const TimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

const Clock = () => {
  const [time, setTime] = useState(() => new Date());
  const timeFormatted = TimeFormatter.format(time).split(":");
  const hours = timeFormatted[0];
  const minutes = timeFormatted[1];

  useEffect(() => {
    const interval = setInterval(async () => {
      setTime(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col rounded-xl w-full items-center justify-around gap-1">
      <div className="text-[11rem] leading-[9rem]">
        {hours}
        <span className="animate-pulse">:</span>
        {minutes}
      </div>
      <div className="text-[3rem]">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
        }).format(time)}
      </div>
    </div>
  );
};
export default memo(Clock);
