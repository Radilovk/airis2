import type { IrisAnalysis } from '@/types'

interface IrisVisualizationProps {
  analysis: IrisAnalysis
}

export default function IrisVisualization({ analysis }: IrisVisualizationProps) {
  const radius = 150
  const centerX = 200
  const centerY = 200

  const getColorForStatus = (status: 'normal' | 'attention' | 'concern') => {
    const colors = {
      normal: 'rgba(34, 197, 94, 0.2)',
      attention: 'rgba(234, 179, 8, 0.3)',
      concern: 'rgba(239, 68, 68, 0.3)'
    }
    return colors[status]
  }

  const getStrokeForStatus = (status: 'normal' | 'attention' | 'concern') => {
    const colors = {
      normal: 'rgba(34, 197, 94, 0.6)',
      attention: 'rgba(234, 179, 8, 0.8)',
      concern: 'rgba(239, 68, 68, 0.8)'
    }
    return colors[status]
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    }
  }

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    
    return [
      'M', x, y,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ')
  }

  return (
    <div className="w-full flex justify-center">
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full">
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="rgba(100, 116, 139, 0.05)"
          stroke="rgba(100, 116, 139, 0.2)"
          strokeWidth="2"
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.4}
          fill="none"
          stroke="rgba(100, 116, 139, 0.15)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.7}
          fill="none"
          stroke="rgba(100, 116, 139, 0.15)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        {analysis.zones.map((zone) => (
          <g key={zone.id}>
            <path
              d={describeArc(centerX, centerY, radius, zone.angle[0], zone.angle[1])}
              fill={getColorForStatus(zone.status)}
              stroke={getStrokeForStatus(zone.status)}
              strokeWidth={zone.status === 'normal' ? 1 : 2}
              opacity={zone.status === 'normal' ? 0.3 : 0.8}
            />
            {zone.status !== 'normal' && (
              <text
                x={polarToCartesian(centerX, centerY, radius * 0.85, (zone.angle[0] + zone.angle[1]) / 2).x}
                y={polarToCartesian(centerX, centerY, radius * 0.85, (zone.angle[0] + zone.angle[1]) / 2).y}
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontWeight="600"
                className="pointer-events-none"
              >
                {zone.id}
              </text>
            )}
          </g>
        ))}

        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.25}
          fill="rgba(100, 116, 139, 0.1)"
          stroke="rgba(100, 116, 139, 0.3)"
          strokeWidth="1"
        />

        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          fontSize="32"
          fontWeight="700"
          className="font-mono"
        >
          {analysis.overallHealth}
        </text>

        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const outer = polarToCartesian(centerX, centerY, radius, angle)
          const inner = polarToCartesian(centerX, centerY, radius - 10, angle)
          return (
            <line
              key={angle}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="1"
            />
          )
        })}
      </svg>
    </div>
  )
}
