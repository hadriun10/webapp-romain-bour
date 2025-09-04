'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnimatedCounter from './AnimatedCounter'

interface GlobalScoreProps {
  score: number
  maxScore: number
  onComplete?: () => void
}

export default function GlobalScore({ score, maxScore, onComplete }: GlobalScoreProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [shouldStartCounter, setShouldStartCounter] = useState(false)

  // Animation de la barre avec vitesse constante
  const progress = (score / maxScore) * 100
  const motionValue = useMotionValue(0)
  
  const width = useTransform(motionValue, (latest) => `${latest}%`)
  
  // Interpolation des couleurs selon le pourcentage
  const backgroundColor = useTransform(motionValue, (latest) => {
    const percentage = latest
    if (percentage <= 30) {
      return '#F04438' // Rouge
    } else if (percentage <= 75) {
      // Interpolation entre rouge et jaune
      const ratio = (percentage - 30) / 45
      return `hsl(${60 * ratio}, 91%, 50%)` // Transition rouge -> jaune
    } else {
      // Interpolation entre jaune et vert
      const ratio = (percentage - 75) / 25
      return `hsl(${60 + 60 * ratio}, 91%, 50%)` // Transition jaune -> vert
    }
  })

  const handleCounterComplete = () => {
    // Counter completed
  }

  // Démarrer l'animation de la barre immédiatement
  useEffect(() => {
    // Démarrer le compteur en même temps que la barre
    setShouldStartCounter(true)
    
    // Animation progressive de 0 à la valeur finale sur 6 secondes
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(elapsed / 6000, 1) // 6 secondes
      const currentWidth = progress * progressRatio
      
      motionValue.set(currentWidth)
      
      if (progressRatio < 1) {
        requestAnimationFrame(animate)
      } else {
        handleComplete()
      }
    }
    
    requestAnimationFrame(animate)
  }, [motionValue, progress]) // Déclencher seulement une fois au montage

  const handleComplete = () => {
    setAnimationComplete(true)
  }

  useEffect(() => {
    if (animationComplete && onComplete) {
      onComplete()
    }
  }, [animationComplete, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full mb-6"
    >
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 relative inline-block">
          Your CV Score
          <motion.div
            className="absolute bottom-0 left-0 h-1.5 bg-blue-500 rounded-full"
            style={{ bottom: '-6px' }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3
            }}
          />
        </h2>
      </div>
      
      {/* Container avec marge et ombres */}
      <div className="p-3 sm:p-4 bg-white rounded-3xl shadow-lg border border-gray-100 mx-2 sm:mx-0">
        {/* Barre de progression */}
        <div className="relative w-full h-16 sm:h-20 bg-gray-200 rounded-2xl overflow-hidden mb-4">
          {/* Barre de progression - prend toute la largeur */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              width,
              backgroundColor
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.15, delay: 0.2 }}
          />
        </div>
        
        {/* Case isolée pour le score */}
        <div className="flex justify-center">
          <motion.div
            className="bg-white border-2 border-gray-200 rounded-xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800">
                <AnimatedCounter 
                  value={score} 
                  duration={6000}
                  shouldStart={shouldStartCounter}
                  onComplete={handleCounterComplete}
                />
                <span className="text-xl sm:text-2xl text-gray-600">/{maxScore}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
