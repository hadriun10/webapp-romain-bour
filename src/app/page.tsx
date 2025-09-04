'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import FileUpload from '@/components/FileUpload'
import CodeInput from '@/components/CodeInput'
import LoadingBar from '@/components/LoadingBar'
import { supabase } from '@/lib/supabase'
import FloatingNav from '@/components/FloatingNav'

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [codeError, setCodeError] = useState('')
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [activeInterface, setActiveInterface] = useState<'none' | 'upload' | 'code'>('none')
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    // File selected for upload
  }

  const handleEmailSubmit = async () => {
    setIsUploading(true)
    try {
      // Upload handled by FileUpload component
      setUploadMessage('Upload received. You will receive a code by email within 10 minutes to view your analysis.')
      setActiveInterface('none')
    } catch (error) {
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
    } catch (error) {
      // Code check error occurred
      setCodeError('Erreur lors de la vérification du code.')
    } finally {
      setIsCheckingCode(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background avec carreaux gris clairs dessinés à la main */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="handDrawnGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              {/* Carreaux avec des lignes légèrement irrégulières */}
              <path d="M 0 0 L 60 0" stroke="#f3f4f6" strokeWidth="1" fill="none" opacity="0.6"/>
              <path d="M 0 0 L 0 60" stroke="#f3f4f6" strokeWidth="1" fill="none" opacity="0.6"/>
              
              {/* Lignes horizontales avec légères variations */}
              <path d="M 0 20 L 60 20" stroke="#e5e7eb" strokeWidth="0.8" fill="none" opacity="0.4"/>
              <path d="M 0 40 L 60 40" stroke="#e5e7eb" strokeWidth="0.8" fill="none" opacity="0.4"/>
              
              {/* Lignes verticales avec légères variations */}
              <path d="M 20 0 L 20 60" stroke="#e5e7eb" strokeWidth="0.8" fill="none" opacity="0.4"/>
              <path d="M 40 0 L 40 60" stroke="#e5e7eb" strokeWidth="0.8" fill="none" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#handDrawnGrid)"/>
        </svg>
        </div>
      
      <FloatingNav />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 mt-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-center mb-12"
        >
          {/* Petite box grise avec bordure */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
            className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-gray-400"
          >
            Tool trained on +400 successful CV
          </motion.div>

          {/* Titre avec animation de soulignement */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="relative">
              Tailored feedbacks on your CV{' '}
              <span className="relative inline-block">
                within 5 minutes
                <motion.div
                  className="absolute bottom-0 left-0 h-1.5 bg-blue-500 rounded-full"
                  style={{ bottom: '-6px' }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 3.5, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 1
                  }}
                />
              </span>
            </span>
          </h1>
          
          {/* Espace plus grand */}
          <div className="mb-12"></div>

          {/* Liste avec icônes de vérification Instagram animées - Layout horizontal élargi */}
          <div className="flex justify-center items-start space-x-16 mt-8">
            <div className="flex flex-col items-center text-center">
              {/* Logo Instagram scintillant bleu avec animation montée/descente */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-10 h-10 mb-3 relative"
              >
                {/* Effet scintillant bleu */}
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                
                {/* Logo Instagram principal */}
                <div className="relative z-10 w-full h-full">
                  <img 
                    src="/logos/logo-instagram.png" 
                    alt="Instagram" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
              <span className="text-sm text-gray-700 font-medium max-w-40">Comprehensive score & explanations</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              {/* Logo Instagram scintillant bleu avec animation montée/descente */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="w-10 h-10 mb-3 relative"
              >
                {/* Effet scintillant bleu */}
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                
                {/* Logo Instagram principal */}
                <div className="relative z-10 w-full h-full">
                  <img 
                    src="/logos/logo-instagram.png" 
                    alt="Instagram" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
              <span className="text-sm text-gray-700 font-medium max-w-40">Section-by-section feedback</span>
            </div>

            <div className="flex flex-col items-center text-center">
              {/* Logo Instagram scintillant bleu avec animation montée/descente */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="w-10 h-10 mb-3 relative"
              >
                {/* Effet scintillant bleu */}
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                
                {/* Logo Instagram principal */}
                <div className="relative z-10 w-full h-full">
                  <img 
                    src="/logos/logo-instagram.png" 
                    alt="Instagram" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
              <span className="text-sm text-gray-700 font-medium max-w-40">Bullet point reframing tips</span>
            </div>
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
              {/* Boutons côte à côte */}
              <div className="flex gap-4 items-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveInterface('upload')}
                  className="w-48 bg-[#2C2C2C] text-white px-3 py-2 rounded-lg font-semibold hover:bg-[#3C3C3C] transition-colors text-sm border border-[#555555] shadow-sm"
                  style={{ 
                    boxShadow: 'inset 0 2px 0 0 #666666, inset 0 -2px 0 0 #666666, inset 2px 0 0 0 #666666, inset -2px 0 0 0 #666666, 0 1px 3px rgba(0, 0, 0, 0.1)' 
                  }}
              >
                Upload my CV
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveInterface('code')}
                  className="w-48 bg-[#2C2C2C] text-white px-3 py-2 rounded-lg font-semibold hover:bg-[#3C3C3C] transition-colors text-sm border border-[#555555] shadow-sm"
                  style={{ 
                    boxShadow: 'inset 0 2px 0 0 #666666, inset 0 -2px 0 0 #666666, inset 2px 0 0 0 #666666, inset -2px 0 0 0 #666666, 0 1px 3px rgba(0, 0, 0, 0.1)' 
                  }}
                >
                  I already have a code
                </motion.button>
              </div>
              
              {/* Texte "100% free" sous les boutons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-sm text-black font-medium -mt-1"
              >
                (100% free)
              </motion.div>
            </>
          )}
          
          {activeInterface === 'upload' && (
            <FileUpload
              onFileSelect={handleFileSelect}
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
        </motion.div>

        {/* Upload Message */}
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto -mt-8"
          >
            {uploadMessage}
          </motion.div>
        )}

      </main>

      {/* Logos d'écoles qui défilent - Section 3/4 de l'écran */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="w-3/4 mx-auto py-8"
      >
        <div className="relative overflow-hidden">
          {/* Premier groupe de logos */}
          <motion.div
            animate={{ x: [0, -1500] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex items-center space-x-24"
          >
            {/* HEC Paris */}
            <img 
              src="/logos/HEC_Paris.svg.png" 
              alt="HEC Paris" 
              className="h-16 w-auto object-contain"
            />

            {/* ESSEC */}
            <img 
              src="/logos/ESSEC_Logo.svg" 
              alt="ESSEC" 
              className="h-16 w-auto object-contain"
            />

            {/* ESCP */}
            <img 
              src="/logos/ESCP_LOGO_CMJN.png" 
              alt="ESCP" 
              className="h-16 w-auto object-contain"
            />

            {/* Bocconi */}
            <img 
              src="/logos/Bocconi_University_Logo.png" 
              alt="Bocconi" 
              className="h-16 w-auto object-contain"
            />

            {/* Harvard */}
            <img 
              src="/logos/Harvard_University_shield.png" 
              alt="Harvard" 
              className="h-16 w-auto object-contain"
            />

            {/* LSE */}
            <img 
              src="/logos/LSE_Logo.svg.png" 
              alt="LSE" 
              className="h-16 w-auto object-contain"
            />

            {/* MIT */}
            <img 
              src="/logos/MIT_logo.svg.png" 
              alt="MIT" 
              className="h-16 w-auto object-contain"
            />

            {/* London Business School */}
            <img 
              src="/logos/RS9327_LBS_Standard_Logo_RGB_AW-hpr.jpg" 
              alt="LBS" 
              className="h-16 w-auto object-contain"
            />

            {/* Duplicate pour effet continu */}
            {/* HEC Paris */}
            <img 
              src="/logos/HEC_Paris.svg.png" 
              alt="HEC Paris" 
              className="h-16 w-auto object-contain"
            />

            {/* ESSEC */}
            <img 
              src="/logos/ESSEC_Logo.svg" 
              alt="ESSEC" 
              className="h-16 w-auto object-contain"
            />

            {/* ESCP */}
            <img 
              src="/logos/ESCP_LOGO_CMJN.png" 
              alt="ESCP" 
              className="h-16 w-auto object-contain"
            />

            {/* Bocconi */}
            <img 
              src="/logos/Bocconi_University_Logo.png" 
              alt="Bocconi" 
              className="h-16 w-auto object-contain"
            />

            {/* Harvard */}
            <img 
              src="/logos/Harvard_University_shield.png" 
              alt="Harvard" 
              className="h-16 w-auto object-contain"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}