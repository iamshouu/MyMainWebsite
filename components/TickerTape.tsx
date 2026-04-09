
import React, { useEffect, useRef } from 'react';

const TickerTape: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
        { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" },
        { "proName": "BITSTAMP:ETHUSD", "title": "ETH/USD" },
        { "proName": "BINANCE:SOLUSDT", "title": "SOL/USDT" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "ru"
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="w-full h-8 md:h-10 fixed top-0 left-0 z-[110] overflow-hidden border-none bg-black/40 backdrop-blur-sm">
      <div ref={containerRef} className="tradingview-widget-container border-none bg-transparent h-full">
        <div className="tradingview-widget-container__widget border-none bg-transparent h-full"></div>
      </div>
    </div>
  );
};

export default TickerTape;
