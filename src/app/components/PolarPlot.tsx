interface PolarPlotProps {
  sourceType: string;
  winterDecrease: number;
  stormDecrease: number;
  cruiseShipDecrease: number;
  listenerIcon: string;
}

export default function PolarPlot({ 
  sourceType, 
  winterDecrease, 
  stormDecrease, 
  cruiseShipDecrease, 
  listenerIcon 
}: PolarPlotProps) {
  const maxRadius = 70;
  const winterRadius = (winterDecrease / 100) * maxRadius;
  const stormRadius = (stormDecrease / 100) * maxRadius;
  const cruiseShipRadius = (cruiseShipDecrease / 100) * maxRadius;
  
  const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  const conditions = [
    { name: 'Winter', radius: winterRadius, percent: winterDecrease, angle: angles[0] },
    { name: 'Storm', radius: stormRadius, percent: stormDecrease, angle: angles[1] },
    { name: 'Cruise Ship', radius: cruiseShipRadius, percent: cruiseShipDecrease, angle: angles[2] },
  ];
  
  const centerX = maxRadius;
  const centerY = maxRadius;
  
  const points = conditions.map(cond => ({
    x: centerX + Math.cos(cond.angle) * cond.radius,
    y: centerY + Math.sin(cond.angle) * cond.radius
  }));
  
  const pathParts = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length; i++) {
    pathParts.push(`L ${points[i].x} ${points[i].y}`);
  }
  pathParts.push('Z');
  const fullPath = pathParts.join(' ');
  
  const getLineColor = (name: string) => {
    if (name === 'Winter') return 'rgba(234, 179, 8, 0.6)';
    if (name === 'Storm') return 'rgba(220, 38, 38, 0.6)';
    return 'rgba(127, 29, 29, 0.6)';
  };
  
  const getDotColor = (name: string) => {
    if (name === 'Winter') return 'rgba(234, 179, 8, 0.8)';
    if (name === 'Storm') return 'rgba(220, 38, 38, 0.8)';
    return 'rgba(127, 29, 29, 0.8)';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-white/90 text-[10px] uppercase tracking-wider mb-2 font-semibold text-center">
        {sourceType}
      </div>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-full" 
          style={{ width: `${maxRadius * 2}px`, height: `${maxRadius * 2}px` }}
        />
        
        <svg 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
          width={maxRadius * 2} 
          height={maxRadius * 2} 
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`gradient-${sourceType}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="rgb(220, 38, 38)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(127, 29, 29)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path 
            d={fullPath} 
            fill={`url(#gradient-${sourceType})`} 
            stroke="rgba(255, 255, 255, 0.5)" 
            strokeWidth="2" 
            strokeLinejoin="round" 
          />
        </svg>
        
        {conditions.map((cond) => {
          const endX = Math.cos(cond.angle) * cond.radius;
          const endY = Math.sin(cond.angle) * cond.radius;
          
          return (
            <div key={cond.name}>
              <div 
                className="absolute top-1/2 left-1/2 origin-left"
                style={{ 
                  width: `${cond.radius}px`, 
                  height: '3px', 
                  transform: `rotate(${cond.angle}rad)`, 
                  transformOrigin: 'left center',
                  backgroundColor: getLineColor(cond.name)
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 rounded-full"
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  transform: `translate(${endX - 7}px, ${endY - 7}px)`,
                  backgroundColor: getDotColor(cond.name)
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 text-white text-[8px] font-semibold whitespace-nowrap text-center"
                style={{ 
                  transform: `translate(${endX + Math.cos(cond.angle) * 18}px, ${endY + Math.sin(cond.angle) * 18}px) translate(-50%, -50%)` 
                }}
              >
                <div>{cond.name}</div>
                <div className="text-orange-300">{cond.percent.toFixed(0)}%</div>
              </div>
            </div>
          );
        })}
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white/30 rounded-full p-2">
            <img src={listenerIcon} alt="" className="w-7 h-7 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
