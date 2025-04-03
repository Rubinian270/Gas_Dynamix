"use client"

import { useEffect, useRef } from "react"

interface Bubble {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

interface BubblesBackgroundProps {
  count?: number
  minSize?: number
  maxSize?: number
  minSpeed?: number
  maxSpeed?: number
  className?: string
}

export function BubblesBackground({
  count = 30,
  minSize = 5,
  maxSize = 50,
  minSpeed = 0.5,
  maxSpeed = 2,
  className = "",
}: BubblesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const animationRef = useRef<number>(0)

  // Initialize bubbles
  useEffect(() => {
    const bubbles: Bubble[] = []
    const colors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6"]

    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: minSize + Math.random() * (maxSize - minSize),
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        opacity: 0.1 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    bubblesRef.current = bubbles
  }, [count, minSize, maxSize, minSpeed, maxSpeed])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial resize
    resizeCanvas()

    // Resize on window change
    window.addEventListener("resize", resizeCanvas)

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw bubbles
      bubblesRef.current.forEach((bubble) => {
        // Move bubble upward
        bubble.y -= bubble.speed

        // Reset position if bubble goes off screen
        if (bubble.y < -bubble.size) {
          bubble.y = canvas.height + bubble.size
          bubble.x = Math.random() * canvas.width
        }

        // Add slight horizontal movement
        bubble.x += Math.sin(bubble.y * 0.01) * 0.5

        // Draw bubble
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.fillStyle = bubble.color
        ctx.globalAlpha = bubble.opacity
        ctx.fill()

        // Add highlight to bubble
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.size * 0.3,
          bubble.y - bubble.size * 0.3,
          bubble.size * 0.1,
          bubble.x,
          bubble.y,
          bubble.size,
        )
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = bubble.opacity * 0.8
        ctx.fill()
      })

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none z-0 ${className}`} aria-hidden="true" />
}

