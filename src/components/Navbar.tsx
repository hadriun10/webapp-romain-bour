'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="relative mx-auto max-w-5xl mt-8">
      {/* Photo de Romain Bour - Positionnée par-dessus, complètement indépendante du flux */}
      <div
        className="absolute z-[60]"
        style={{
          left: '0px',
          top: '50%',
          transform: 'translateY(-50%) translateX(-40%)'
        }}
      >
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: '100px',
            height: '100px',
            boxShadow: '0 0 12px rgba(7, 68, 130, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Image
            src="/romain-face.jpeg"
            alt="Romain Bour"
            width={100}
            height={100}
            className="object-cover"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              display: 'block'
            }}
          />
        </div>
      </div>
      
      {/* Navbar seule, sans la photo dans son flux */}
      <nav 
        className="bg-white border border-gray-300 py-5 px-6 z-50 relative rounded-lg h-[80px] flex items-center shadow-md" 
        style={{ background: '#ffffff' }}
      >
        {/* Masque pour cacher le bord gauche de la navbar derrière Romain */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-white z-[1] pointer-events-none rounded-l-lg"
          style={{
            width: '50px',
            borderTop: '1px solid #d1d5db',
            borderBottom: '1px solid #d1d5db',
            borderLeft: '1px solid #d1d5db',
          }}
        />
        
        <div className="flex items-center justify-between w-full relative z-[2]">
          {/* Texte à gauche : Romain Bour / Sous-titre */}
          <div className="flex flex-col ml-12">
            <div
              className="text-[#191919] font-semibold text-base leading-tight"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Romain Bour
            </div>
            <div
              className="text-[#374151] text-sm leading-tight mt-0.5"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              J&apos;aide les indépendants à transformer leurs 3 likes en 10 clients
            </div>
          </div>
          
          {/* Espace flexible pour pousser les boutons à droite */}
          <div className="flex-1" />
          
          {/* Boutons à droite */}
          <div className="flex items-center gap-3">
            {/* Conteneur ellipses + texte */}
            <Link
              href="https://romainbour.framer.website/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              {/* Ellipses clients qui se chevauchent */}
              <div className="flex items-center mb-1">
                <Image
                  src="/elipses-clients/Ellipse 1.png"
                  alt="Client 1"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white -mr-3"
                />
                <Image
                  src="/elipses-clients/Ellipse 2.png"
                  alt="Client 2"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white -mr-3"
                />
                <Image
                  src="/elipses-clients/Ellipse 3.png"
                  alt="Client 3"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white -mr-3"
                />
                <Image
                  src="/elipses-clients/Ellipse 4.png"
                  alt="Client 4"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white -mr-3"
                />
                <Image
                  src="/elipses-clients/Ellipse 5.png"
                  alt="Client 5"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white -mr-3"
                />
                <Image
                  src="/elipses-clients/Ellipse 6.png"
                  alt="Client 6"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              </div>
              {/* Texte en dessous en bleu */}
              <span
                className="text-sm font-medium whitespace-nowrap text-[#074482]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                +80 clients accompagnés
              </span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/romainbour/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-[#074482] text-white text-sm font-semibold hover:bg-[#053a6b] transition-colors rounded-lg border border-[#074482]"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Me contacter
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

