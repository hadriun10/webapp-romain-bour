'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, CVData } from '@/lib/supabase'
import GlobalScore from '@/components/GlobalScore'
import SectionScores from '@/components/SectionScores'
import DetailSection from '@/components/DetailSection'
import CTASection from '@/components/CTASection'
import CTASection2 from '@/components/CTASection2'
import BonusSection from '@/components/BonusSection'

export default function ResultsPage() {
  const params = useParams()
  const code = params.code as string
  
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [animationPhase, setAnimationPhase] = useState(0)
  const [showSpacer, setShowSpacer] = useState(true)

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const { data, error } = await supabase
          .from('cv_result')
          .select('*')
          .eq('cv_id', code)
          .single()

        if (error) {
          setError('CV analysis not found')
          return
        }

        setCvData(data)
      } catch {
        setError('Error loading CV analysis')
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchCVData()
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
            <p className="text-gray-600">Loading your CV analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !cvData) {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analysis not found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/" 
              className="bg-[#2C2C2C] text-white px-6 py-3 rounded-lg hover:bg-[#3C3C3C] transition-colors text-sm border border-[#555555] shadow-sm"
              style={{ 
                boxShadow: 'inset 0 2px 0 0 #666666, inset 0 -2px 0 0 #666666, inset 2px 0 0 0 #666666, inset -2px 0 0 0 #666666, 0 1px 3px rgba(0, 0, 0, 0.1)' 
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Préparer les données pour les sections
  const sections = [
    {
      name: 'Structure & Visuals',
      score: cvData.structure_visuals_awarded_sum,
      maxScore: cvData.structure_visuals_max_sum
    },
    {
      name: 'Education',
      score: cvData.education_awarded_sum,
      maxScore: cvData.education_max_sum
    },
    {
      name: 'Experience',
      score: cvData.experience_awarded_sum,
      maxScore: cvData.experience_max_sum
    },
    {
      name: 'Others',
      score: cvData.others_awarded_sum,
      maxScore: cvData.others_max_sum
    }
  ]

  // Préparer les critères détaillés
  const structureCriteria = [
    {
      name: 'No photo',
      description: cvData.no_photo_desc,
      score: cvData.no_photo_points_awarded,
      maxScore: cvData.no_photo_points_max,
      feedback: cvData.no_photo_feedback
    },
    {
      name: 'English CV',
      description: cvData.english_cv_desc,
      score: cvData.english_cv_points_awarded,
      maxScore: cvData.english_cv_points_max,
      feedback: cvData.english_cv_feedback
    },
    {
      name: 'One page length',
      description: cvData.one_page_length_desc,
      score: cvData.one_page_length_points_awarded,
      maxScore: cvData.one_page_length_points_max,
      feedback: cvData.one_page_length_feedback
    },
    {
      name: 'Single column layout',
      description: cvData.single_column_layout_desc,
      score: cvData.single_column_layout_points_awarded,
      maxScore: cvData.single_column_layout_points_max,
      feedback: cvData.single_column_layout_feedback
    },
    {
      name: 'No color',
      description: cvData.no_color_desc,
      score: cvData.no_color_points_awarded,
      maxScore: cvData.no_color_points_max,
      feedback: cvData.no_color_feedback
    },
    {
      name: 'Readable formatting',
      description: cvData.readable_formatting_desc,
      score: cvData.readable_formatting_points_awarded,
      maxScore: cvData.readable_formatting_points_max,
      feedback: cvData.readable_formatting_feedback
    },
    {
      name: 'Uniform margins',
      description: cvData.uniform_margins_desc,
      score: cvData.uniform_margins_points_awarded,
      maxScore: cvData.uniform_margins_points_max,
      feedback: cvData.uniform_margins_feedback
    },
    {
      name: 'Three section structure',
      description: cvData.three_section_structure_desc,
      score: cvData.three_section_structure_points_awarded,
      maxScore: cvData.three_section_structure_points_max,
      feedback: cvData.three_section_structure_feedback
    }
  ]

  const educationCriteria = [
    {
      name: 'Education completeness',
      description: cvData.education_completeness_desc,
      score: cvData.education_completeness_points_awarded,
      maxScore: cvData.education_completeness_points_max,
      feedback: cvData.education_completeness_feedback
    },
    {
      name: 'Honors & tests',
      description: cvData.honors_tests_desc,
      score: cvData.honors_tests_points_awarded,
      maxScore: cvData.honors_tests_points_max,
      feedback: cvData.honors_tests_feedback
    },
    {
      name: 'Relevant courses',
      description: cvData.relevant_courses_desc,
      score: cvData.relevant_courses_points_awarded,
      maxScore: cvData.relevant_courses_points_max,
      feedback: cvData.relevant_courses_feedback
    },
    {
      name: 'Exchanges & double degrees',
      description: cvData.exchanges_double_degrees_desc,
      score: cvData.exchanges_double_degrees_points_awarded,
      maxScore: cvData.exchanges_double_degrees_points_max,
      feedback: cvData.exchanges_double_degrees_feedback
    }
  ]

  const experienceCriteria = [
    {
      name: 'Reverse chronological',
      description: cvData.reverse_chronological_desc,
      score: cvData.reverse_chronological_points_awarded,
      maxScore: cvData.reverse_chronological_points_max,
      feedback: cvData.reverse_chronological_feedback
    },
    {
      name: 'Clear titles',
      description: cvData.clear_titles_desc,
      score: cvData.clear_titles_points_awarded,
      maxScore: cvData.clear_titles_points_max,
      feedback: cvData.clear_titles_feedback
    },
    {
      name: 'Experience substance',
      description: cvData.experience_substance_desc,
      score: cvData.experience_substance_points_awarded,
      maxScore: cvData.experience_substance_points_max,
      feedback: cvData.experience_substance_feedback
    },
    {
      name: 'Bullet count',
      description: cvData.bullet_count_desc,
      score: cvData.bullet_count_points_awarded,
      maxScore: cvData.bullet_count_points_max,
      feedback: cvData.bullet_count_feedback
    },
    {
      name: 'Action verbs',
      description: cvData.action_verbs_desc,
      score: cvData.action_verbs_points_awarded,
      maxScore: cvData.action_verbs_points_max,
      feedback: cvData.action_verbs_feedback
    },
    {
      name: 'Tangible outcomes',
      description: cvData.tangible_outcomes_desc,
      score: cvData.tangible_outcomes_points_awarded,
      maxScore: cvData.tangible_outcomes_points_max,
      feedback: cvData.tangible_outcomes_feedback
    },
    {
      name: 'Use of numbers',
      description: cvData.use_of_numbers_desc,
      score: cvData.use_of_numbers_points_awarded,
      maxScore: cvData.use_of_numbers_points_max,
      feedback: cvData.use_of_numbers_feedback
    },
    {
      name: 'Concision & clarity',
      description: cvData.concision_clarity_desc,
      score: cvData.concision_clarity_points_awarded,
      maxScore: cvData.concision_clarity_points_max,
      feedback: cvData.concision_clarity_feedback
    }
  ]

  const othersCriteria = [
    {
      name: 'Professional email',
      description: cvData.professional_email_desc,
      score: cvData.professional_email_points_awarded,
      maxScore: cvData.professional_email_points_max,
      feedback: cvData.professional_email_feedback
    },
    {
      name: 'Phone format',
      description: cvData.phone_format_desc,
      score: cvData.phone_format_points_awarded,
      maxScore: cvData.phone_format_points_max,
      feedback: cvData.phone_format_feedback
    },
    {
      name: 'Location & mobility',
      description: cvData.location_mobility_desc,
      score: cvData.location_mobility_points_awarded,
      maxScore: cvData.location_mobility_points_max,
      feedback: cvData.location_mobility_feedback
    },
    {
      name: 'Professional links',
      description: cvData.professional_links_desc,
      score: cvData.professional_links_points_awarded,
      maxScore: cvData.professional_links_points_max,
      feedback: cvData.professional_links_feedback
    },
    {
      name: 'Banned header',
      description: cvData.banned_header_desc,
      score: cvData.banned_header_points_awarded,
      maxScore: cvData.banned_header_points_max,
      feedback: cvData.banned_header_feedback
    },
    {
      name: 'Skills & tools',
      description: cvData.skills_tools_desc,
      score: cvData.skills_tools_points_awarded,
      maxScore: cvData.skills_tools_points_max,
      feedback: cvData.skills_tools_feedback
    },
    {
      name: 'Languages',
      description: cvData.languages_desc,
      score: cvData.languages_points_awarded,
      maxScore: cvData.languages_points_max,
      feedback: cvData.languages_feedback
    },
    {
      name: 'Certifications',
      description: cvData.certifications_desc,
      score: cvData.certifications_points_awarded,
      maxScore: cvData.certifications_points_max,
      feedback: cvData.certifications_feedback
    },
    {
      name: 'Interests',
      description: cvData.interests_desc,
      score: cvData.interests_points_awarded,
      maxScore: cvData.interests_points_max,
      feedback: cvData.interests_feedback
    },
    {
      name: 'Summary & profile',
      description: cvData.summary_profile_desc,
      score: cvData.summary_profile_points_awarded,
      maxScore: cvData.summary_profile_points_max,
      feedback: cvData.summary_profile_feedback
    }
  ]

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

      {/* Header avec logo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white shadow-sm py-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <Image
              src="/mimprep-logo.png"
              alt="MiMPrep Logo"
              width={200}
              height={60}
              className="mx-auto"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
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
          score={cvData.grand_total_awarded}
          maxScore={cvData.grand_total_max}
          onComplete={handleGlobalScoreComplete}
        />

        {/* Section Scores */}
        {animationPhase >= 1 && (
          <SectionScores
            sections={sections}
            onComplete={handleSectionScoresComplete}
          />
        )}

        {/* CTA Section */}
        {animationPhase >= 2 && (
          <CTASection
            targetFlag={cvData.candidate_target_flag}
            targetReason={cvData.candidate_target_reason}
          />
        )}

        {/* Detail Sections */}
        {animationPhase >= 2 && (
          <div>
            <DetailSection
              title="Structure & Visuals"
              criteria={structureCriteria}
              totalScore={cvData.structure_visuals_awarded_sum}
              maxScore={cvData.structure_visuals_max_sum}
              delay={0.6}
            />
            
            <DetailSection
              title="Education"
              criteria={educationCriteria}
              totalScore={cvData.education_awarded_sum}
              maxScore={cvData.education_max_sum}
              delay={0.75}
            />
            
            <DetailSection
              title="Experience"
              criteria={experienceCriteria}
              totalScore={cvData.experience_awarded_sum}
              maxScore={cvData.experience_max_sum}
              delay={0.9}
            />
            
            {/* CTA Section 2 */}
            <CTASection2 targetFlag={cvData.candidate_target_flag} delay={1.0} />
            
            <DetailSection
              title="Others"
              criteria={othersCriteria}
              totalScore={cvData.others_awarded_sum}
              maxScore={cvData.others_max_sum}
              delay={1.05}
            />
            
            {/* Bonus Section */}
            <BonusSection
              originalBullet={cvData.pass4_bullet_original}
              feedback={cvData.pass4_bullet_feedback}
              suggestion={cvData.pass4_bullet_suggestion}
              delay={1.2}
            />
          </div>
        )}
      </main>
    </div>
  )
}
