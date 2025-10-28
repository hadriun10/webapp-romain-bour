'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { LINKEDIN_CRITERIA, CRITERIA_EXPECTATIONS } from '@/lib/linkedin-criteria'

interface FileUploadProps {
  onProfileLinkSubmit: (profileLink: string) => void
  onEmailSubmit: (email: string) => void
  isUploading?: boolean
  onClose?: () => void
}

export default function FileUpload({ onProfileLinkSubmit, onEmailSubmit, isUploading = false, onClose }: FileUploadProps) {
  const [profileLink, setProfileLink] = useState('')
  const [email, setEmail] = useState('')
  const [feedbackGoal, setFeedbackGoal] = useState<string>('')
  const [origin, setOrigin] = useState<string>('direct')
  const [linkedinReflection, setLinkedinReflection] = useState<boolean>(false)
  const [acceptInfo, setAcceptInfo] = useState<boolean>(false)

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

  const validateLinkedInUrl = (url: string): string | null => {
    if (!url.trim()) {
      return 'Veuillez entrer un lien LinkedIn'
    }
    
    // Vérifier que c'est un lien LinkedIn valide
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/
    if (!linkedinPattern.test(url)) {
      return 'Veuillez entrer un lien LinkedIn valide (ex: https://linkedin.com/in/votre-nom)'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Valider le lien LinkedIn
    const linkError = validateLinkedInUrl(profileLink)
    if (linkError) {
      alert(linkError)
      return
    }
    
    if (email && feedbackGoal && profileLink && acceptInfo) {
      try {
        // Créer FormData pour l'envoi
        const formData = new FormData()
        formData.append('Email', email)
        formData.append('LinkedInProfile', profileLink)
        formData.append('submittedAt', new Date().toISOString())
        formData.append('formMode', 'test')
        formData.append('origin', origin)
        formData.append('feedback_goal', feedbackGoal)
        formData.append('linkedin_reflection', linkedinReflection.toString())
        formData.append('accept_info', acceptInfo.toString())
        
        // Ajouter les critères LinkedIn en dur
        formData.append('linkedin_criteria', JSON.stringify(LINKEDIN_CRITERIA))
        formData.append('criteria_expectations', JSON.stringify(CRITERIA_EXPECTATIONS))

        // Envoyer au webhook n8n
        const response = await fetch('https://n8n.hadrien-grosbois.ovh/webhook/ad7525b9-8a18-47ea-8e89-74a26b00add9', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          onProfileLinkSubmit(profileLink)
          onEmailSubmit(email)
        } else {
          throw new Error('Failed to submit profile')
        }
      } catch (error) {
        console.error('Submit error:', error)
        alert('Erreur lors de l&apos;envoi. Veuillez réessayer.')
      }
    }
  }


  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-lg p-4 relative"
      >
        {/* Bouton de fermeture */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
            <div className="mb-4">
              <label htmlFor="profileLink" className="block text-sm font-medium text-gray-700 mb-2">
                Lien de votre profil LinkedIn
              </label>
              <input
                type="url"
                id="profileLink"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="https://linkedin.com/in/votre-nom"
              />
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="feedback_goal" className="block text-xs font-medium text-gray-700 mb-1">
                  Optimisez mon profil LinkedIn pour :
                </label>
                <select
                  id="feedback_goal"
                  value={feedbackGoal}
                  onChange={(e) => setFeedbackGoal(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="" disabled>Sélectionnez votre objectif</option>
                  <option value="independant">Indépendant / Freelance / Coach</option>
                  <option value="dirigeant">Dirigeant / Créateur d&apos;entreprise</option>
                  <option value="salarie">Salarié / Manager</option>
                  <option value="demandeur">Demandeur d&apos;emploi / Étudiant</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="linkedinReflection"
                  checked={linkedinReflection}
                  onChange={(e) => setLinkedinReflection(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="linkedinReflection" className="text-xs text-gray-700">
                  Je réfléchis à me faire accompagner sur LinkedIn
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptInfo"
                  checked={acceptInfo}
                  onChange={(e) => setAcceptInfo(e.target.checked)}
                  required
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="acceptInfo" className="text-xs text-gray-700">
                  J&apos;accepte de recevoir des informations et conseils par email
                </label>
              </div>

              <button
                type="submit"
                disabled={!email || !feedbackGoal || !profileLink || !acceptInfo || isUploading}
                className="w-full bg-[#2C2C2C] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#3C3C3C] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm border border-[#555555] shadow-sm"
              >
                {isUploading ? 'Analyse en cours...' : 'Obtenir mon analyse'}
              </button>
            </form>
      </motion.div>
    </div>
  )
}
