'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, LinkedInData } from '@/lib/supabase'
import { LINKEDIN_CRITERIA, SECTION_MAPPING, getCriteriaExpectation, getCriteriaTitle } from '@/lib/linkedin-criteria'
import GlobalScore from '@/components/GlobalScore'
import SectionScores from '@/components/SectionScores'
import DetailSection from '@/components/DetailSection'

export default function ResultsPage() {
  const params = useParams()
  const code = params.code as string
  
  const [linkedinData, setLinkedinData] = useState<LinkedInData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [animationPhase, setAnimationPhase] = useState(0)
  const [showSpacer, setShowSpacer] = useState(true)

  useEffect(() => {
    const fetchLinkedInData = async () => {
      try {
        const { data, error } = await supabase
          .from('database-analyse-profile')
          .select('*')
          .eq('id', code)
          .single()

        if (error) {
          setError('Analyse LinkedIn non trouvée')
          return
        }

        setLinkedinData(data)
      } catch {
        setError('Erreur lors du chargement de l\'analyse LinkedIn')
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchLinkedInData()
    }
  }, [code])

  const handleGlobalScoreComplete = () => {
    setAnimationPhase(1)
    // Retirer l'espaceur rapidement après l'animation
    setTimeout(() => {
      setShowSpacer(false)
    }, 200)
  }

  const handleSectionScoresComplete = () => {
    setAnimationPhase(2)
  }

  // Faire apparaître la section bleue immédiatement après le début des section scores
  useEffect(() => {
    if (animationPhase >= 1) {
      setAnimationPhase(2)
    }
  }, [animationPhase])

  if (loading) {
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
        
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre analyse LinkedIn...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !linkedinData) {
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
        
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analyse non trouvée</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/" 
              className="bg-[#2C2C2C] text-white px-6 py-3 rounded-lg hover:bg-[#3C3C3C] transition-colors text-sm border border-[#555555] shadow-sm"
              style={{ 
                boxShadow: 'inset 0 2px 0 0 #666666, inset 0 -2px 0 0 #666666, inset 2px 0 0 0 #666666, inset -2px 0 0 0 #666666, 0 1px 3px rgba(0, 0, 0, 0.1)' 
              }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Préparer les données pour les sections LinkedIn
  const sections = [
    {
      name: 'Photo de profil',
      score: linkedinData.photo_total_points,
      maxScore: linkedinData.photo_total_maximum
    },
    {
      name: 'Bannière',
      score: linkedinData.banner_total_points,
      maxScore: linkedinData.banner_total_maximum
    },
    {
      name: 'Titre du profil',
      score: linkedinData.headline_total_points,
      maxScore: linkedinData.headline_total_maximum
    },
    {
      name: 'Section À propos',
      score: linkedinData.about_total_points,
      maxScore: linkedinData.about_total_maximum
    },
    {
      name: 'Contenu',
      score: linkedinData.contenu_total_points,
      maxScore: linkedinData.contenu_total_maximum
    },
    {
      name: 'Expériences professionnelles',
      score: linkedinData.experiences_total_points,
      maxScore: linkedinData.experiences_total_maximum
    },
    {
      name: 'Crédibilité et preuves sociales',
      score: linkedinData.cred_total_points,
      maxScore: linkedinData.cred_total_maximum
    }
  ]

  // Fonction pour créer les critères d'une catégorie avec les nouveaux critères
  const createCriteria = (category: string, count: number) => {
    const criteria = []
    const mappedSection = SECTION_MAPPING[category as keyof typeof SECTION_MAPPING] || category
    const sectionCriteria = LINKEDIN_CRITERIA[mappedSection as keyof typeof LINKEDIN_CRITERIA] || []
    
    for (let i = 1; i <= count; i++) {
      const criteriaTitle = sectionCriteria[i - 1] || linkedinData[`${category}_critere_${i}_titre` as keyof LinkedInData] as string
      const score = linkedinData[`${category}_critere_${i}_points_obtenus` as keyof LinkedInData] as number
      const maxScore = linkedinData[`${category}_critere_${i}_points_maximum` as keyof LinkedInData] as number
      const feedback = linkedinData[`${category}_critere_${i}_explication` as keyof LinkedInData] as string
      
      criteria.push({
        name: getCriteriaTitle(criteriaTitle),
        description: criteriaTitle,
        score: score,
        maxScore: maxScore,
        feedback: feedback,
        expectation: getCriteriaExpectation(category, criteriaTitle),
        isMaxScore: score === maxScore
      })
    }
    return criteria
  }

  // Préparer les critères détaillés pour chaque catégorie
  const bannerCriteria = createCriteria('banner', linkedinData.banner_total_categories)
  const photoCriteria = createCriteria('photo', linkedinData.photo_total_categories)
  const headlineCriteria = createCriteria('headline', linkedinData.headline_total_categories)
  const aboutCriteria = createCriteria('about', linkedinData.about_total_categories)
  const contenuCriteria = createCriteria('contenu', linkedinData.contenu_total_categories)
  const experiencesCriteria = createCriteria('experiences', linkedinData.experiences_total_categories)
  const credCriteria = createCriteria('cred', linkedinData.cred_total_categories)

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

      {/* Header avec texte Romain Bour */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white shadow-sm py-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative overflow-visible">
          <div className="text-center">
            <h1 style={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '2rem',
              fontWeight: 600,
              color: '#191919',
              letterSpacing: '-0.02em'
            }}>
              Romain Bour
            </h1>
            <p style={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '1rem',
              fontWeight: 400,
              color: '#191919',
              marginTop: '0.5rem'
            }}>
              J&apos;aide les indépendants à trouver des clients grâce à LinkedIn
            </p>
          </div>
          {/* Image retirée sur demande */}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Espaceur invisible pour centrer la barre de chargement */}
        {showSpacer && (
          <motion.div
            initial={{ height: '15vh' }}
            animate={{ height: showSpacer ? '15vh' : 0 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full"
          />
        )}

        {/* Global Score */}
        <GlobalScore
          score={linkedinData.global_total_points}
          maxScore={linkedinData.global_total_maximum}
          onComplete={handleGlobalScoreComplete}
        />

        {/* Section Scores */}
        {animationPhase >= 1 && (
          <SectionScores
            sections={sections}
            onComplete={handleSectionScoresComplete}
          />
        )}

        {/* Detail Sections */}
        {animationPhase >= 2 && (
          <div>
            <DetailSection
              title="Photo de profil"
              criteria={photoCriteria}
              totalScore={linkedinData.photo_total_points}
              maxScore={linkedinData.photo_total_maximum}
              delay={0.6}
            />
            
            <div className="mt-10">
              <div className="bg-[#074482] text-white border-2 border-[#074482] rounded-3xl shadow-lg px-6 sm:px-10 py-6 sm:py-8 text-center">
                <h3
                  className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4"
                  style={{ fontFamily: 'var(--font-poppins)', letterSpacing: '-0.01em' }}
                >
                  C&apos;est sûrement l&apos;heure d&apos;aller plus loin
                </h3>
                <p
                  className="text-base sm:text-lg leading-relaxed mb-4"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Salut, moi c&apos;est Romain Bour. J&apos;organise un bootcamp intensif pour t&apos;aider à booster ton profil LinkedIn et décrocher plus de clients. Je te laisse le lien juste en dessous pour réserver ta place et profiter d&apos;un accompagnement sur-mesure.
                </p>
                <p
                  className="text-sm sm:text-base font-medium uppercase tracking-wide text-white/80"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Prochain bootcamp : du 18 au 22 novembre 2025
                </p>
                <div className="mt-5 flex justify-center">
                  <Link
                    href="https://romainbour.fr/bootcamp"
                    className="inline-flex items-center gap-2 bg-white text-[#074482] font-semibold px-6 sm:px-8 py-3 rounded-2xl border-2 border-white shadow-md transition-transform duration-200 hover:-translate-y-0.5"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    Découvrez les bootcamps
                  </Link>
                </div>
              </div>
            </div>

            <DetailSection
              title="Bannière"
              criteria={bannerCriteria}
              totalScore={linkedinData.banner_total_points}
              maxScore={linkedinData.banner_total_maximum}
              delay={0.75}
            />
            
            <DetailSection
              title="Titre du profil"
              criteria={headlineCriteria}
              totalScore={linkedinData.headline_total_points}
              maxScore={linkedinData.headline_total_maximum}
              delay={0.9}
            />
            
            <DetailSection
              title="Section À propos"
              criteria={aboutCriteria}
              totalScore={linkedinData.about_total_points}
              maxScore={linkedinData.about_total_maximum}
              delay={1.05}
            />
            
            <DetailSection
              title="Contenu"
              criteria={contenuCriteria}
              totalScore={linkedinData.contenu_total_points}
              maxScore={linkedinData.contenu_total_maximum}
              delay={1.2}
            />
            
            <DetailSection
              title="Expériences professionnelles"
              criteria={experiencesCriteria}
              totalScore={linkedinData.experiences_total_points}
              maxScore={linkedinData.experiences_total_maximum}
              delay={1.35}
            />
            
            <DetailSection
              title="Crédibilité et preuves sociales"
              criteria={credCriteria}
              totalScore={linkedinData.cred_total_points}
              maxScore={linkedinData.cred_total_maximum}
              delay={1.5}
            />
          </div>
        )}
      </main>
    </div>
  )
}
