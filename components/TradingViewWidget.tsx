import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  containerId: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol, containerId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous scripts/content to prevent duplicates or empty states
    containerRef.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "ru", // Changed to Russian
      "enable_publishing": false,
      "backgroundColor": "rgba(0, 0, 0, 1)",
      "gridColor": "rgba(66, 66, 66, 0.06)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com"
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    
    const widgetChild = document.createElement('div');
    widgetChild.className = "tradingview-widget-container__widget";
    widgetChild.style.height = "100%";
    widgetChild.style.width = "100%";

    widgetContainer.appendChild(widgetChild);
    widgetContainer.appendChild(script);
    
    containerRef.current.appendChild(widgetContainer);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black relative" ref={containerRef} />
  );
};

export default TradingViewWidget;