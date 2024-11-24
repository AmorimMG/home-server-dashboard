import clsx from "clsx";
import Image from "next/image";
import { memo } from "react";
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
  return (
    <Button
      id="btn-1"
      className="relative h-[5rem] flex flex-col"
      onClick={async () => {
        const success = await toggleLights(entity);
        if (success) {
          // Optionally, add any side effects if needed
        }
      }}
    >
      <Image
        fill
        sizes="100"
        quality={10}
        src={"/light.svg"}
        className={clsx(
          initialValue ? "opacity-90 glow-yellow-200" : "rotate-6 opacity-40 glow-yellow-100",
          "z-10 w-full select-none rounded-md object-fill pt-2 pb-6"
        )}
        style={!initialValue ? { filter: "grayscale(0.7)" } : {}}
        alt="light svg"
      />
      <span className="absolute text-sm font-mono bottom-0">{label.toUpperCase()}</span>
    </Button>
  );
};

export default memo(Lights);
