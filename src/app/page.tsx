'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import CodeInput from '@/components/CodeInput'
import { supabase } from '@/lib/supabase'

// Composant pour animer le texte mot par mot (effet blur -> focus)
function AnimatedText({ 
  text, 
  className = '', 
  style 
}: { 
  text: string
  className?: string
  style?: React.CSSProperties
}) {
  const words = text.split(' ')
  
  return (
    <p className={className} style={style}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          initial={{ opacity: 0, filter: 'blur(4px)', y: 6 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.05, // Délai de 50ms entre chaque mot
            ease: 'easeOut'
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [codeError, setCodeError] = useState('')
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [activeInterface, setActiveInterface] = useState<'none' | 'upload' | 'code' | 'no-cv'>('none')
  const [noCvEmail, setNoCvEmail] = useState('')
  const [isSendingNoCvEmail, setIsSendingNoCvEmail] = useState(false)
  const [noCvMessage, setNoCvMessage] = useState('')
  const [origin, setOrigin] = useState<string>('direct')
  const router = useRouter()

  // Récupérer le paramètre 'origin' depuis l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const originParam = urlParams.get('origin')
      if (originParam) {
        setOrigin(originParam)
      }
    }
  }, [])

  // Faire disparaître le message uploadMessage après 10 secondes
  useEffect(() => {
    if (uploadMessage) {
      const timer = setTimeout(() => {
        setUploadMessage('')
      }, 10000) // 10 secondes

      return () => clearTimeout(timer)
    }
  }, [uploadMessage])

  // Faire disparaître le message noCvMessage après 10 secondes
  useEffect(() => {
    if (noCvMessage) {
      const timer = setTimeout(() => {
        setNoCvMessage('')
      }, 10000) // 10 secondes

      return () => clearTimeout(timer)
    }
  }, [noCvMessage])

  const handleProfileLinkSubmit = (profileLink: string) => {
    // Profile link submitted
    console.log('Profile link submitted:', profileLink)
  }

  const handleEmailSubmit = async () => {
    setIsUploading(true)
    try {
      // Upload handled by FileUpload component
      setUploadMessage('Profil reçu. Tu recevras un lien par email dans les 5 minutes pour consulter ton analyse. Pense à vérifier tes spams.')
      setActiveInterface('none')
    } catch {
      // Handle upload error
    } finally {
      setIsUploading(false)
    }
  }

  const handleCodeSubmit = async (code: string) => {
    setIsCheckingCode(true)
    setCodeError('')
    
    try {
      // Checking code validity
      
      // Vérifier si le code existe dans Supabase
      const { data, error } = await supabase
        .from('cv_result')
        .select('cv_id')
        .eq('cv_id', code)
        .single()

      // Supabase response received

      if (error) {
        // Supabase error occurred
        setCodeError(`Erreur Supabase: ${error.message}`)
        return
      }

      if (!data) {
        setCodeError('Code introuvable dans la base de données.')
        return
      }

      // Rediriger vers la page de résultats
      router.push(`/resultats/${code}`)
    } catch {
      // Code check error occurred
      setCodeError('Erreur lors de la vérification du code.')
    } finally {
      setIsCheckingCode(false)
    }
  }

  const handleNoCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (noCvEmail) {
      setIsSendingNoCvEmail(true)
      try {
        const response = await fetch('https://bankingvault.app.n8n.cloud/webhook/dont-have-cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: noCvEmail,
            origin
          })
        })

        if (response.ok) {
          setNoCvMessage('Parfait ! Nous t&apos;enverrons le lien pour faire évaluer ton profil plus tard.')
          setActiveInterface('none')
        } else {
          throw new Error('Failed to send email')
        }
      } catch (error) {
        console.error('No CV email error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error details:', errorMessage)
        alert(`Error sending email: ${errorMessage}. Please try again.`)
      } finally {
        setIsSendingNoCvEmail(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] relative overflow-hidden">
      {/* Background avec image de fond style Romain Bour */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" 
             style={{ backgroundImage: 'url(/romainbour-bg.png)' }}>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 mt-8 md:mt-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-center mb-6 md:mb-12"
        >
          {/* Badge style Romain Bour */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
            className="inline-block bg-white px-5 py-2 rounded-full mb-6 md:mb-6 border-2 border-[#074482] mt-2"
            style={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: '24px',
              color: '#074482'
            }}
          >
            Outil développé à partir d&apos;une base de 200 top profils LinkedIn
          </motion.div>

          {/* Titre style Romain Bour */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <h1 className="text-4xl md:text-6xl max-w-6xl mx-auto px-4" style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
                color: '#191919'
              }}>
                Attire plus d&apos;opportunités grâce à un profil <span style={{ color: '#074482' }}>LinkedIn</span> optimisé
              </h1>
            </div>
            <AnimatedText
              text="Le premier outil qui analyse ton profil LinkedIn en 5 minutes et te donne les axes d'amélioration pour transformer tes 10 likes en 3 clients."
              className="text-base md:text-lg mx-auto"
              style={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 400,
                lineHeight: '1.6',
                letterSpacing: '-0.01em',
                color: '#191919',
                maxWidth: '800px',
                textAlign: 'center'
              }}
            />
          </div>

          {/* Badges style Romain Bour */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-8 px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2.5 max-w-md w-full md:w-auto"
            >
              <div className="bg-[#074482] rounded-full p-2 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
                Ton profil scoré sur 100
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2.5 max-w-md w-full md:w-auto"
            >
              <div className="bg-[#074482] rounded-full p-2 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
                Conseils actionables pour l&apos;améliorer
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2.5 max-w-md w-full md:w-auto"
            >
              <div className="bg-[#074482] rounded-full p-2 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
                Astuces pour te démarquer
              </span>
            </motion.div>
          </div>
        </motion.div>



        {/* Action Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col gap-4 justify-center items-center mb-12 max-w-sm mx-auto relative"
        >
          {activeInterface === 'none' && (
            <>
              {/* Boutons empilés sur mobile, côte à côte sur desktop */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveInterface('upload')}
                  className="w-80 bg-[#074482] text-white px-6 py-3.5 rounded-full font-semibold hover:bg-[#053a6b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  style={{ 
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 600
                  }}
              >
                <span>Évaluer mon profil</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveInterface('no-cv')}
                  className="w-80 bg-white text-[#074482] px-6 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-[#074482] flex items-center justify-center gap-2"
                  style={{ 
                    fontFamily: 'var(--font-poppins)',
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 600
                  }}
                >
                Évaluer mon profil plus tard
                </motion.button>
              </div>
              
              {/* Texte "100% free" sous les boutons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-sm text-black font-medium -mt-1"
                style={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 400,
                  lineHeight: '1.6',
                  letterSpacing: '-0.01em'
                }}
              >
(100% gratuit - Résultats par mail en 5 minutes)
              </motion.div>
            </>
          )}
          
          {activeInterface === 'upload' && (
            <FileUpload
              onProfileLinkSubmit={handleProfileLinkSubmit}
              onEmailSubmit={handleEmailSubmit}
              isUploading={isUploading}
              onClose={() => setActiveInterface('none')}
            />
          )}
          
          {activeInterface === 'code' && (
            <CodeInput
              onCodeSubmit={handleCodeSubmit}
              isLoading={isCheckingCode}
              error={codeError}
              onClose={() => setActiveInterface('none')}
            />
          )}

          {activeInterface === 'no-cv' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-lg p-6 relative border-2 border-[#074482]/30"
              >
                {/* Bouton de fermeture */}
                <button
                  onClick={() => setActiveInterface('none')}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Zone de message */}
                <div className="text-center mb-4">
                  <p className="text-gray-900 font-semibold text-base" style={{ fontFamily: 'var(--font-poppins)', fontSize: '16px', fontWeight: 600 }}>Laisse ton email et nous t&apos;enverrons un rappel pour faire évaluer ton profil plus tard.</p>
                </div>

                <form onSubmit={handleNoCvSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="noCvEmail" className="block mb-2" style={{
                      fontFamily: 'var(--font-poppins)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151'
                    }}>
                      Adresse email.
                    </label>
                    <input
                      type="email"
                      id="noCvEmail"
                      value={noCvEmail}
                      onChange={(e) => setNoCvEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border-2 border-[#074482]/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-[#074482] text-sm"
                      style={{
                        fontFamily: 'var(--font-poppins)',
                        fontSize: '14px'
                      }}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!noCvEmail || isSendingNoCvEmail}
                    className="w-full bg-[#074482] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#053a6b] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    style={{
                      fontFamily: 'var(--font-poppins)',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 600
                    }}
                  >
                    {isSendingNoCvEmail ? 'Envoi en cours...' : 'Envoie-moi le rappel'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Upload Message */}
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto -mt-8 border-2 border-[#074482]/30"
            style={{
              fontFamily: 'var(--font-poppins)'
            }}
          >
            <p className="text-center text-gray-800 text-base font-medium">
              {uploadMessage}
            </p>
          </motion.div>
        )}

        {/* No CV Message */}
        {noCvMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto -mt-8 border-2 border-[#074482]/30"
            style={{
              fontFamily: 'var(--font-poppins)'
            }}
          >
            <p className="text-center text-gray-800 text-base font-medium">
              {noCvMessage}
            </p>
          </motion.div>
        )}

      </main>
    </div>
  )
}