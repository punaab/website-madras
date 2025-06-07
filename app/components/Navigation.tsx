'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10) // Show nav when scrolled more than 10px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Height of the fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      // Smooth scroll with easing
      const startPosition = window.pageYOffset
      const distance = offsetPosition - startPosition
      const duration = 1000 // Duration in milliseconds
      let start: number | null = null

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)
        
        // Easing function for smooth acceleration and deceleration
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress))

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    const startPosition = window.pageYOffset
    const duration = 1000 // Duration in milliseconds
    let start: number | null = null

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Easing function for smooth acceleration and deceleration
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      
      window.scrollTo(0, startPosition * (1 - easeInOutCubic(progress)))

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
    setIsMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={scrollToTop}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('sacrament')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              SACRAMENT
            </button>
            <button
              onClick={() => scrollToSection('message')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              MESSAGE
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              ANNOUNCEMENTS
            </button>
            <button
              onClick={() => scrollToSection('more')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              MORE
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200 ${
                isScrolled 
                  ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100' 
                  : 'text-white hover:text-gray-200 hover:bg-white/10'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={scrollToTop}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('sacrament')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              SACRAMENT
            </button>
            <button
              onClick={() => scrollToSection('message')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              MESSAGE
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              ANNOUNCEMENTS
            </button>
            <button
              onClick={() => scrollToSection('more')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              MORE
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation 