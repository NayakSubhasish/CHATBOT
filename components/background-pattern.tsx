"use client"

export function GeometricPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage: `
          radial-gradient(circle at 1px 1px, hsl(0, 0%, 80%) 2px, transparent 0)
        `,
        backgroundSize: '48px 48px',
        opacity: 0.25,
      }}
    />
  )
}

export function DotGridPattern() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0, 0%, 40%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0, 0%, 40%) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

