'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, X } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onEmailSubmit: (email: string) => void
  isUploading?: boolean
  onClose?: () => void
}

export default function FileUpload({ onFileSelect, onEmailSubmit, isUploading = false, onClose }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [feedbackGoal, setFeedbackGoal] = useState<string>('')
  const [origin, setOrigin] = useState<string>('direct')
  const [linkedinReflection, setLinkedinReflection] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): string | null => {
    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed'
    }
    
    // Vérifier la taille (1Mo = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      return 'File size must be less than 1MB'
    }
    
    return null
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const error = validateFile(file)
      if (!error) {
        setSelectedFile(file)
        onFileSelect(file)
      } else {
        alert(error)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const error = validateFile(file)
      if (!error) {
        setSelectedFile(file)
        onFileSelect(file)
      } else {
        alert(error)
        // Réinitialiser l'input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && feedbackGoal) {
      try {
        // Créer FormData pour l'envoi
        const formData = new FormData()
        formData.append('Email', email)
        if (selectedFile) {
          formData.append('CV', selectedFile)
        }
        formData.append('submittedAt', new Date().toISOString())
        formData.append('formMode', 'test')
        formData.append('origin', origin)
        formData.append('feedback_goal', feedbackGoal)
        formData.append('linkedin_reflection', linkedinReflection.toString())

        // Envoyer au webhook
        const response = await fetch('https://bankingvault.app.n8n.cloud/webhook/4b60d52f-4035-425f-aad4-f851f68a063e', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          onEmailSubmit(email)
        } else {
          throw new Error('Failed to upload CV')
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Error uploading CV. Please try again.')
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
              <p className="text-sm text-gray-600 mb-2">Optionnel : Téléchargez votre profil LinkedIn (PDF)</p>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : selectedFile 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="text-green-700 font-medium text-sm">{selectedFile.name}</p>
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto text-sm"
                  >
                    <X className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                  <p className="text-gray-600 font-medium text-sm">Déposez votre profil LinkedIn ici</p>
                    <p className="text-gray-500 text-xs">ou cliquez pour parcourir (max 1MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Choisir un fichier
                  </button>
                </div>
              )}
              </div>
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
                  <option value="dirigeant">Dirigeant / Créateur d'entreprise</option>
                  <option value="salarie">Salarié / Manager</option>
                  <option value="demandeur">Demandeur d'emploi / Étudiant</option>
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
                  Je vais réfléchir à me faire un point de poignée sur LinkedIn
                </label>
              </div>

              <button
                type="submit"
                disabled={!email || !feedbackGoal || isUploading}
                className="w-full bg-[#2C2C2C] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#3C3C3C] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm border border-[#555555] shadow-sm"
              >
                {isUploading ? 'Analyse en cours...' : 'Obtenir mon analyse'}
              </button>
            </form>
      </motion.div>
    </div>
  )
}
