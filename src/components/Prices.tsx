/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { memo, useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const cryptoPairs = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

type CryptoPrice = {
  [key: string]: {
    price: number;
  };
};

const CryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrice>({
    BTCUSDT: { price: 0 },
    ETHUSDT: { price: 0 },
    BNBUSDT: { price: 0 },
    SOLUSDT: { price: 0 },
    USDBRL: { price: 0 },
  });

  const updatePrices = async () => {
    let pricesUpdated = prices;
    try {
      cryptoPairs.map(async value => {
        const resp = await axios.get("https://fapi.binance.com/fapi/v1/ticker/price", {
          params: {
            symbol: value,
          },
        });
        pricesUpdated[value] = { price: parseFloat(resp?.data?.price) };
      });

      const brl = await axios.get("https://economia.awesomeapi.com.br/last/USD-BRL");
      pricesUpdated["USDBRL"] = { price: parseFloat(brl?.data?.USDBRL?.ask) };

      setPrices(Object.assign({}, pricesUpdated));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updatePrices();
    const interval = setInterval(async () => {
      updatePrices();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-[15rem] text-3xl justify-center items-center text-center [&>div]:bg-[#ab0aee]/60 ">
      <div className="flex flex-col h-full w-full rounded-xl p-1 backdrop-blur">
        <span className="font-mono">BTC/USDT</span>
        <span className="text-zinc-300 text-glow-blue-500">{formatter.format(prices["BTCUSDT"]?.price || 0)}</span>
      </div>
      <div className="flex flex-col h-full w-full rounded-xl p-1 backdrop-blur">
        <span className="font-mono">ETH/USDT</span>
        <span className="text-zinc-300 text-glow-blue-500">{formatter.format(prices["ETHUSDT"]?.price || 0)}</span>
      </div>
      <div className="flex flex-col h-full w-full rounded-xl p-1 backdrop-blur">
        <span className="font-mono">BNB/USDT</span>
        <span className="text-zinc-300 text-glow-blue-500">{formatter.format(prices["BNBUSDT"]?.price || 0)}</span>
      </div>
      <div className="flex flex-col h-full w-full rounded-xl p-1backdrop-blur">
        <span className="font-mono">SOL/USDT</span>
        <span className="text-zinc-300 text-glow-blue-500">{formatter.format(prices["SOLUSDT"]?.price || 0)}</span>
      </div>
      <div className="flex flex-col h-full w-full rounded-xl p-1 backdrop-blur">
        <span className="font-mono">USD/BRL</span>
        <span className="text-zinc-300 text-glow-blue-500">R{formatter.format(prices["USDBRL"]?.price || 0)}</span>
      </div>
    </div>
  );
};
export default memo(CryptoPrices);
