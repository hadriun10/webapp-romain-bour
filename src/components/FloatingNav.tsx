import Image from "next/image";

export default function FloatingNav() {
  return (
    <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-3/4 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center px-8 py-3">
          {/* Logo MiMPrep - À gauche */}
          <div className="flex-shrink-0">
            <Image
              src="/mimprep-logo.png"
              alt="MiMPrep Logo"
              width={180}
              height={54}
              className="h-14 w-auto"
            />
          </div>

          {/* Espace restant divisé en 5 parties égales avec liens aux points 1/5, 2/5, 3/5, 4/5 */}
          <div className="flex-1 relative">
            {/* Graduate Program - 1/5 */}
            <a
              href="https://www.mimprep.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-1/5 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black hover:text-gray-700 font-medium text-base transition-colors"
            >
              Graduate Program
            </a>
            
            {/* Masterclass - 2/5 */}
            <a
              href="https://www.mimprep.com/mim-prep-masterclass"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-2/5 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black hover:text-gray-700 font-medium text-base transition-colors"
            >
              Masterclass
            </a>
            
            {/* Smart Prep - 3/5 */}
            <a
              href="https://smartprep.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-3/5 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black hover:text-gray-700 font-medium text-base transition-colors"
            >
              Smart Prep
            </a>
            
            {/* The Banking Vault - 4/5 */}
            <a
              href="https://thebankingvault.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-4/5 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black hover:text-gray-700 font-medium text-base transition-colors"
            >
              The Banking Vault
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
