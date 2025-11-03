'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import PreviewScoresSimple from '@/components/PreviewScoresSimple'
import { useNotification } from '@/hooks/useNotification'

export default function Home() {
  const [profileLink, setProfileLink] = useState('')
  const [email, setEmail] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { notifications, success, error, removeNotification } = useNotification()

  // Scores fictifs pour la démo
  const demoSections = [
    {
      name: 'Photo de profil',
      score: 12,
      maxScore: 15,
      shouldBlur: false
    },
    {
      name: 'Bannière',
      score: 17,
      maxScore: 20,
      shouldBlur: false
    },
    {
      name: 'Titre du profil',
      score: 14,
      maxScore: 20,
      shouldBlur: false
    },
    {
      name: 'Section À propos',
      score: 11,
      maxScore: 15,
      shouldBlur: false
    },
    {
      name: 'Espace Sélection',
      score: 8,
      maxScore: 15,
      shouldBlur: true
    },
    {
      name: 'Contenu',
      score: 7,
      maxScore: 10,
      shouldBlur: true
    },
    {
      name: 'Expériences professionnelles',
      score: 7,
      maxScore: 10,
      shouldBlur: true
    },
    {
      name: 'Crédibilité et preuves sociales',
      score: 6,
      maxScore: 10,
      shouldBlur: true
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Envoyer au webhook N8n
      const response = await fetch('https://n8n.hadrien-grosbois.ovh/webhook/ad7525b9-8a18-47ea-8e89-74a26b00add9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileLink,
          email,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        success('✅ Parfait ! Vérifie ta boîte mail, ton analyse arrive dans quelques minutes.')
        // Réinitialiser le formulaire
        setProfileLink('')
        setEmail('')
        setIsChecked(false)
      } else {
        throw new Error('Erreur lors de l\'envoi')
      }
    } catch (err) {
      error('❌ Une erreur est survenue. Réessaie dans quelques instants.')
      console.error('Erreur:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSectionScoresComplete = () => {
    // Animation terminée
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] relative overflow-hidden">
      {/* Background avec image de fond style Romain Bour */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" 
             style={{ backgroundImage: 'url(/romainbour-bg.png)' }}>
        </div>
      </div>

      {/* Main Content - Layout 2 colonnes */}
      <main className="max-w-7xl mx-auto px-2.5 lg:pl-2.5 lg:pr-2.5 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-20 items-end">
          
          {/* COLONNE GAUCHE - Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-2 lg:order-1 w-full lg:max-w-md"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className="inline-block bg-white px-4 py-1.5 rounded-full mb-6 border-2 border-[#074482]"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '20px',
                color: '#074482'
              }}
            >
              Outil développé à partir d&apos;une base de 200 top profils LinkedIn
            </motion.div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl mb-4" style={{
              fontFamily: 'var(--font-poppins)',
              fontWeight: 600,
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: '#191919'
            }}>
              Optimise ton profil <span style={{ color: '#074482' }}>LinkedIn</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg mb-10" style={{
              fontFamily: 'var(--font-poppins)',
              fontWeight: 400,
              lineHeight: '1.6',
              letterSpacing: '-0.01em',
              color: '#191919'
            }}>
              Le premier outil qui analyse ton profil LinkedIn en 5 minutes et te donne les axes d&apos;amélioration pour transformer tes 10 likes en 3 clients.
            </p>

            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
              style={{ marginTop: '50px' }}
              className="bg-white rounded-2xl shadow-lg p-5 border-2 border-[#074482]/30"
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Champ lien LinkedIn */}
                <div>
                  <label htmlFor="profileLink" className="block mb-1.5" style={{
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151'
                  }}>
                    Lien de ton profil LinkedIn
                  </label>
                  <input
                    type="url"
                    id="profileLink"
                    value={profileLink}
                    onChange={(e) => setProfileLink(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border-2 border-[#074482]/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-[#074482] text-sm"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                    placeholder="https://linkedin.com/in/ton-profil"
                  />
                </div>

                {/* Champ email */}
                <div>
                  <label htmlFor="email" className="block mb-1.5" style={{
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151'
                  }}>
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border-2 border-[#074482]/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-[#074482] text-sm"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                    placeholder="ton.email@example.com"
                  />
                </div>

                {/* Case à cocher */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 border-2 border-[#074482]/30 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
                    J&apos;accepte de recevoir mon analyse LinkedIn par email
                  </label>
                </div>

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={!profileLink || !email || !isChecked || isSubmitting}
                  className="w-full bg-[#074482] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#053a6b] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  style={{ 
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '15px',
                    lineHeight: '22px',
                    fontWeight: 600
                  }}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Évaluer mon profil'}
                  {!isSubmitting && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>

          {/* COLONNE DROITE - Preview des scores */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <PreviewScoresSimple
              sections={demoSections}
              onComplete={handleSectionScoresComplete}
            />
          </motion.div>

        </div>
      </main>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`px-6 py-4 rounded-lg shadow-lg max-w-md ${
              notification.type === 'success'
                ? 'bg-blue-500 text-white'
                : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-white'
            }`}
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
