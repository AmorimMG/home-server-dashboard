import clsx from "clsx";
import Image from "next/image";
import { memo, useState } from "react";
import Button from "./Button";

const Lights = ({
  label,
  entity,
  initialValue,
  toggleLights,
}: {
  label: string;
  entity: string;
  initialValue: boolean;
  toggleLights: (entity: string) => Promise<boolean>;
}) => {
  const [lights, setLights] = useState(initialValue);
  return (
    <Button
      id="btn-1"
      className="relative h-[5rem] flex flex-col"
      onClick={async () => {
        const success = await toggleLights(entity);
        if (success) setLights(!lights);
      }}
    >
      <Image
        fill
        sizes="100"
        quality={10}
        src={"/light.svg"}
        className={clsx(
          lights ? "opacity-90 glow-yellow-200" : "rotate-6 opacity-40 glow-yellow-100",
          "z-10 w-full select-none rounded-md object-fill pt-2 pb-6"
        )}
        style={!lights ? { filter: "grayscale(0.7)" } : {}}
        alt="ligh svg"
      />
      <span className="absolute text-sm font-mono bottom-0">{label.toUpperCase()}</span>
    </Button>
  );
};
export default memo(Lights);
