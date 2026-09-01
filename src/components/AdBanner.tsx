import React from 'react';

interface LeaderboardAdProps {
  className?: string;
}

export const AdLeaderboard728x90: React.FC<LeaderboardAdProps> = ({ className = '' }) => {
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '170cddb5eae5c46386571953bf621ecc',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/170cddb5eae5c46386571953bf621ecc/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`w-full py-4 flex flex-col items-center justify-center ${className}`}>
      <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1.5 flex items-center gap-1">
        <span>Sponsored</span>
      </div>
      <div className="w-full max-w-[760px] overflow-x-auto flex justify-center items-center py-2 px-2 rounded-xl bg-[#080d20]/80 border border-slate-800/80 shadow-lg shadow-black/40">
        <iframe
          title="Sponsored Advertisement 728x90"
          srcDoc={iframeSrcDoc}
          width={728}
          height={90}
          style={{ border: 'none', overflow: 'hidden' }}
          className="max-w-full shrink-0"
          scrolling="no"
        />
      </div>
    </div>
  );
};

export const AdBanner320x50: React.FC<LeaderboardAdProps> = ({ className = '' }) => {
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '66a1d7657a95b3d8f1168cfc9bd2c002',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/66a1d7657a95b3d8f1168cfc9bd2c002/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`w-full py-4 flex flex-col items-center justify-center ${className}`}>
      <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1.5 flex items-center gap-1">
        <span>Advertisement</span>
      </div>
      <div className="w-full max-w-[360px] flex justify-center items-center py-2 px-2 rounded-xl bg-[#080d20]/80 border border-slate-800/80 shadow-lg shadow-black/40">
        <iframe
          title="Sponsored Advertisement 320x50"
          srcDoc={iframeSrcDoc}
          width={320}
          height={50}
          style={{ border: 'none', overflow: 'hidden' }}
          className="max-w-full shrink-0"
          scrolling="no"
        />
      </div>
    </div>
  );
};
