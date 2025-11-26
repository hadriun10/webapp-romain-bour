'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SectionScores from '@/components/SectionScores'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { useNotification } from '@/hooks/useNotification'
import { captureEvent, identifyUser } from '@/lib/posthog'

export default function Home() {
  const [profileLink, setProfileLink] = useState('')
  const [email, setEmail] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [profileLinkError, setProfileLinkError] = useState('')
  const { notifications, success, error, removeNotification } = useNotification()

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

  const validateProfileLink = (value: string) => {
    if (!value) {
      return ''
    }

    if (!value.startsWith('https://www.linkedin.com/in')) {
      return '⚠️ Le lien doit commencer par "https://www.linkedin.com/in".'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const currentLinkError = validateProfileLink(profileLink)
    if (currentLinkError) {
      setProfileLinkError(currentLinkError)
      setIsSubmitting(false)
      return
    }

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
        success('✅ Parfait ! Vérifie ta boîte mail (et tes spams), ton analyse arrive dans quelques minutes.')
        // Réinitialiser le formulaire
        setProfileLink('')
        setEmail('')
        setIsChecked(false)
        setProfileLinkError('')
        } else {
        throw new Error('Erreur lors de l\'envoi')
      }
    } catch (err) {
      // Track form submission error
      captureEvent('form_submission_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      })
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

      {/* Navbar */}
      <div className="relative z-20 mb-8">
        <Navbar />
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
                {/* Champ lien LinkedIn */}
                <div>
                  <label htmlFor="profileLink" className="block mb-2" style={{
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151'
                  }}>
                    Lien de ton profil LinkedIn
                    <span className="lg:hidden relative inline-block ml-1">
                      <span 
                        className="text-[#074482] cursor-pointer"
                        onClick={() => setShowTooltip(!showTooltip)}
                      >
                        (Où le trouver)
                      </span>
                      {showTooltip && (
                        <span className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50" style={{ fontFamily: 'var(--font-poppins)' }}>
                          <ul className="list-none space-y-1">
                            <li>– Ouvre l&apos;application LinkedIn</li>
                            <li>– Va sur ton profil</li>
                            <li>– Appuie sur les trois petits points</li>
                            <li>– Appuie sur partager via</li>
                            <li>– Appuie sur &quot;copier le lien&quot;</li>
                          </ul>
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </span>
                      )}
                    </span>
                  </label>
                  <input
                    type="url"
                    id="profileLink"
                    value={profileLink}
                    onChange={(e) => {
                      const value = e.target.value
                      setProfileLink(value)
                      setProfileLinkError(validateProfileLink(value))
                    }}
                    required
                    aria-invalid={profileLinkError ? 'true' : 'false'}
                    className="w-full px-4 py-3 border-2 border-[#074482]/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-[#074482] text-sm"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                    placeholder="https://linkedin.com/in/ton-profil"
                  />
                  {profileLinkError && (
                    <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {profileLinkError}
                    </p>
                  )}
                </div>

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
                  disabled={!profileLink || !email || !isChecked || isSubmitting || !!profileLinkError}
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

            {/* Notifications en dessous du formulaire */}
            <div className="space-y-2">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`px-6 py-4 rounded-xl shadow-lg ${
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
      <Footer />
    </div>
  )
}
