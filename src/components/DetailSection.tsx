'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ScoreBadge from './ScoreBadge'

interface Criterion {
  name: string
  description: string
  score: number
  maxScore: number
  feedback?: string
}

interface DetailSectionProps {
  title: string
  criteria: Criterion[]
  totalScore: number
  maxScore: number
  delay?: number
}

export default function DetailSection({ 
  title, 
  criteria, 
  totalScore, 
  maxScore, 
  delay = 0 
}: DetailSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const percentage = (totalScore / maxScore) * 100
  
  // Trier les critères par performance (du meilleur au pire score)
  const sortedCriteria = [...criteria].sort((a, b) => {
    const scoreA = (a.score / a.maxScore) * 100
    const scoreB = (b.score / b.maxScore) * 100
    return scoreB - scoreA // Du plus haut au plus bas
  })
  
  const getTotalBadgeStyle = () => {
    if (percentage < 30) {
      return 'bg-red-50 text-red-700 border-red-200'
    } else if (percentage < 75) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    } else {
      return 'bg-green-50 text-green-700 border-green-200'
    }
  }

  return (
    <div ref={ref} className="w-full mt-16 first:mt-0">
      {/* Titre avec animation de soulignement bleu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mb-6"
      >
        <h3 className="text-3xl font-bold text-gray-900 relative inline-block">
          {title}
          <motion.div
            className="absolute bottom-0 left-0 h-1.5 bg-blue-500 rounded-full"
            style={{ bottom: '-6px' }}
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ 
              duration: 2, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3
            }}
          />
        </h3>
      </motion.div>
      
      {/* Carte du tableau avec fade-up */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* En-tête du tableau avec style de la page de garde */}
        <div className="grid grid-cols-12 gap-4 bg-[#2C2C2C] text-white font-bold py-3 px-4 border border-[#555555]"
             style={{ 
               boxShadow: 'inset 0 2px 0 0 #666666, inset 0 -2px 0 0 #666666, inset 2px 0 0 0 #666666, inset -2px 0 0 0 #666666, 0 1px 3px rgba(0, 0, 0, 0.1)' 
             }}>
          <div className="col-span-10 sm:col-span-9">Criterion</div>
          <div className="col-span-2 sm:col-span-3 text-center">Score</div>
        </div>
        
        {/* Lignes du tableau - plus compactes */}
        <div className="border border-gray-200 border-t-0">
          {sortedCriteria.map((criterion, index) => (
            <motion.div
              key={criterion.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.3, 
                ease: 'easeOut',
                delay: 0.2 + (index * 0.05)
              }}
              className={`grid grid-cols-12 gap-4 py-3 px-4 border-b border-gray-100 last:border-b-0 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {/* Colonne 1: Criterion */}
              <div className={`col-span-10 sm:col-span-9 flex ${
                !criterion.feedback || criterion.score >= criterion.maxScore 
                  ? 'items-center' 
                  : 'flex-col'
              }`}>
                <span className="font-bold text-gray-800">
                  {criterion.name}
                </span>
                {criterion.feedback && criterion.score < criterion.maxScore && (
                  <div className="mt-1 text-sm text-gray-600 text-justify">
                    <span className="font-bold">→ Feedback :</span> {criterion.feedback}
                  </div>
                )}
              </div>
              
              {/* Colonne 2: Score - centré */}
              <div className="col-span-2 sm:col-span-3 flex items-center justify-center">
                <ScoreBadge score={criterion.score} maxScore={criterion.maxScore} />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Score détaché dans un encadré noir avec bulle colorée */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
          className="mt-3 mb-4 flex justify-center"
        >
          <div className="bg-[#2C2C2C] text-white font-bold py-3 px-16 border border-[#555555] rounded-xl flex items-center gap-6"
               style={{ 
                 boxShadow: 'inset 0 2px 0 0 #666666, inset 0 -2px 0 0 #666666, inset 2px 0 0 0 #666666, inset -2px 0 0 0 #666666, 0 1px 3px rgba(0, 0, 0, 0.1)' 
               }}>
            <span className="text-lg">Score</span>
            <div className={`px-6 py-2 rounded-lg ${getTotalBadgeStyle()}`}>
              <span className="font-bold text-lg">{totalScore}/{maxScore}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
