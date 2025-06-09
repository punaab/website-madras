'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Footer = () => {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show footer after scrolling past 25% of viewport height (changed from 40%)
      if (currentScrollY > window.innerHeight * 0.25) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <footer 
      className={`fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t border-gray-100 py-4 transition-all duration-700 ease-in-out z-50 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}
      style={{
        backgroundImage: `
          linear-gradient(135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.98) 10%,
            rgba(255, 255, 255, 0.95) 20%,
            rgba(255, 255, 255, 0.98) 30%,
            rgba(255, 255, 255, 0.95) 40%,
            rgba(255, 255, 255, 0.98) 50%,
            rgba(255, 255, 255, 0.95) 60%,
            rgba(255, 255, 255, 0.98) 70%,
            rgba(255, 255, 255, 0.95) 80%,
            rgba(255, 255, 255, 0.98) 90%,
            rgba(255, 255, 255, 0.95) 100%
          ),
          linear-gradient(45deg,
            rgba(255, 255, 255, 0.97) 0%,
            rgba(255, 255, 255, 0.99) 25%,
            rgba(255, 255, 255, 0.97) 50%,
            rgba(255, 255, 255, 0.99) 75%,
            rgba(255, 255, 255, 0.97) 100%
          )
        `,
        boxShadow: '0 -4px 20px -5px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-2 sm:space-x-6">
            <Link 
              href="https://www.churchofjesuschrist.org/?lang=eng" 
              target="_blank" 
              rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-lg transition-all duration-500 group shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage: `
                linear-gradient(135deg,
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(255, 255, 255, 0.98) 25%,
                  rgba(255, 255, 255, 0.95) 50%,
                  rgba(255, 255, 255, 0.98) 75%,
                  rgba(255, 255, 255, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(4px)'
            }}
            >
            <span className="hidden sm:inline text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-500">Official Website</span>
              <Image 
                src="/assets/images/web-icon.svg" 
                alt="Church Website" 
              width={20} 
              height={20} 
              className="sm:hidden group-hover:scale-110 transition-transform duration-500"
              />
            </Link>
          
            <Link 
              href="https://www.churchofjesuschrist.org/study/scriptures?lang=eng" 
              target="_blank" 
              rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-lg transition-all duration-500 group shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage: `
                linear-gradient(135deg,
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(255, 255, 255, 0.98) 25%,
                  rgba(255, 255, 255, 0.95) 50%,
                  rgba(255, 255, 255, 0.98) 75%,
                  rgba(255, 255, 255, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(4px)'
            }}
            >
            <span className="hidden sm:inline text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-500">Scriptures</span>
              <Image 
                src="/assets/images/scripture-icon.svg" 
                alt="Scriptures" 
              width={20} 
              height={20} 
              className="sm:hidden group-hover:scale-110 transition-transform duration-500"
              />
            </Link>
          
            <Link 
            href="https://www.churchofjesuschrist.org/music/library/hymns?lang=eng" 
              target="_blank" 
              rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-lg transition-all duration-500 group shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage: `
                linear-gradient(135deg,
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(255, 255, 255, 0.98) 25%,
                  rgba(255, 255, 255, 0.95) 50%,
                  rgba(255, 255, 255, 0.98) 75%,
                  rgba(255, 255, 255, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(4px)'
            }}
            >
            <span className="hidden sm:inline text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-500">Hymns</span>
              <Image 
                src="/assets/images/music-icon.svg" 
              alt="Hymns" 
              width={20} 
              height={20} 
              className="sm:hidden group-hover:scale-110 transition-transform duration-500"
              />
            </Link>
          
              <Link 
            href="/admin/login" 
            className="flex items-center px-3 py-2 rounded-lg transition-all duration-500 group shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage: `
                linear-gradient(135deg,
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(255, 255, 255, 0.98) 25%,
                  rgba(255, 255, 255, 0.95) 50%,
                  rgba(255, 255, 255, 0.98) 75%,
                  rgba(255, 255, 255, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(4px)'
            }}
              >
            <span className="hidden sm:inline text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-500">Admin Login</span>
                <Image 
                  src="/assets/images/admin-icon.svg" 
              alt="Admin Login" 
              width={20} 
              height={20} 
              className="sm:hidden group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer 