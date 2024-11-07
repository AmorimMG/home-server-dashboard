import Image from "next/image";
import Home from "../components/Home";

export default function Page() {

  const randomNumber = Math.floor(Math.random() * 12) + 1;

  console.log(randomNumber);
  return (
    <main className="p-2 h-screen text-pink-300/90 text-glow-violet-400/90 opacity-50 select-none">
      <Image
        fill
        quality={90}
        priority={true}
        placeholder="empty"
        src={`/wallpapers/${randomNumber}.png`}
        className="-z-50"
        style={{
          objectFit: "cover",
          opacity: 0.8,
          backgroundColor: "#080808",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
        alt="background"
        sizes="(max-width: 768px) 768px, (max-width: 1200px) 1200px, 1980px"
      />
      <Home />
    </main>
  );
}
