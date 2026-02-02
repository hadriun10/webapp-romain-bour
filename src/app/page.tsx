'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SectionScores from '@/components/SectionScores'
import VideoModal from '@/components/VideoModal'
import LinkedInSearch from '@/components/LinkedInSearch'
import { captureEvent, identifyUser } from '@/lib/posthog'

export default function Home() {
  const [profileLink, setProfileLink] = useState('')
  const [email, setEmail] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Track page view
  useEffect(() => {
    captureEvent('page_viewed', { page: 'home' })
  }, [])

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
      shouldBlur: true
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
      const webhookData = {
        profileLink,
        email,
        timestamp: new Date().toISOString()
      }
      
      console.log('📤 Envoi des données au webhook N8n...', webhookData)
      
      const response = await fetch('https://n8n.hadrien-grosbois.ovh/webhook/optin-romain-bour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      console.log('📥 Réponse webhook reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      if (response.ok) {
        console.log('✅ Webhook N8n: Envoi réussi')
        
        // Identify user in PostHog with their email
        if (email) {
          identifyUser(email, {
            email: email,
            has_profile_link: !!profileLink
          })
        }
        
        // Track successful form submission
        captureEvent('form_submitted', {
          email: email,
          has_profile_link: !!profileLink,
          timestamp: new Date().toISOString()
        })
        
        // Ouvrir la modal vidéo au lieu de la notification
        setShowVideoModal(true)
        setErrorMessage(null)
        
        // Réinitialiser le formulaire
        setProfileLink('')
        setEmail('')
        setIsChecked(false)
      } else {
        const errorText = await response.text()
        console.error('❌ Erreur webhook:', response.status, errorText)
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      console.error('❌ Erreur complète lors de l\'envoi au webhook:', err)
      
      // Track form submission error
      captureEvent('form_submission_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      })
      setErrorMessage('❌ Une erreur est survenue. Réessaie dans quelques instants.')
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
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          
          {/* COLONNE GAUCHE - Badge, Titre, Description, Formulaire */}
          <div className="order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                className="inline-block bg-white px-5 py-2 rounded-full mb-6 border-2 border-[#074482]"
                style={{
                  fontFamily: 'var(--font-poppins)',
                  fontSize: '15px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  color: '#074482'
                }}
              >
                Un outil conçu à partir de l&apos;analyse de plus de 200 profils LinkedIn
              </motion.div>

              {/* Titre */}
              <h1 className="text-4xl md:text-5xl mb-6" style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                color: '#191919'
              }}>
                Optimise ton profil <span style={{ color: '#074482' }}>LinkedIn</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg mb-8" style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 400,
                lineHeight: '1.6',
                letterSpacing: '-0.01em',
                color: '#191919'
              }}>
                Le premier outil qui analyse ton profil LinkedIn en 5 minutes et t&apos;indique ce qu&apos;il faut améliorer pour qu&apos;on comprenne enfin pourquoi on devrait te choisir.
              </p>
            </motion.div>

            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#074482]/30"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                {/* Recherche profil LinkedIn */}
                <LinkedInSearch
                  onProfileSelect={setProfileLink}
                  value={profileLink}
                />

                {/* Champ email */}
                  <div>
                  <label htmlFor="email" className="block mb-2" style={{
                      fontFamily: 'var(--font-poppins)',
                      fontSize: '14px',
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
                    className="w-full px-4 py-3 border-2 border-[#074482]/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-[#074482] text-sm"
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
                    J&apos;accepte de recevoir par mail mon analyse et d&apos;autres communications pour me développer sur la plateforme.
                  </label>
                </div>

                {/* Bouton */}
                  <button
                    type="submit"
                  disabled={!profileLink || !email || !isChecked || isSubmitting}
                  className="w-full bg-[#074482] text-white px-6 py-3.5 rounded-full font-semibold hover:bg-[#053a6b] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    style={{
                      fontFamily: 'var(--font-poppins)',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 600
                    }}
                  >
                  {isSubmitting ? 'Envoi en cours...' : 'Évaluer mon profil'}
                  {!isSubmitting && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Message d'erreur */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="mt-4 px-6 py-4 rounded-xl shadow-lg bg-red-500 text-white"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{errorMessage}</p>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* COLONNE DROITE - Preview des scores */}
          <div className="order-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <SectionScores
                sections={demoSections}
                onComplete={handleSectionScoresComplete}
                noBottomMargin={true}
              />
            </motion.div>
          </div>

        </div>
      </main>

      {/* Modal vidéo de confirmation */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoSrc="/Romain Bour.mp4"
        autoPlay={true}
      />
    </div>
  )
}
