import Image from 'next/image'
import { getContent } from '@/lib/content'
import Navigation from './components/Navigation'

export default async function Home() {
  const content = await getContent()

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative w-full bg-white">
          {/* Diagonal Design Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 top-0 w-40 h-full bg-white transform rotate-12 opacity-50"></div>
            <div className="absolute -right-10 top-0 w-40 h-full bg-white transform -rotate-12 opacity-50"></div>
            <div className="absolute left-1/4 top-0 w-40 h-full bg-white transform rotate-12 opacity-30"></div>
            <div className="absolute right-1/4 top-0 w-40 h-full bg-white transform -rotate-12 opacity-30"></div>
          </div>
          
          {/* Image Container */}
          <div className="relative h-[50vh] md:h-[60vh] w-full max-w-4xl mx-auto px-4">
            <Image
              src="/assets/images/Christ-Church-Symbol.png"
              alt="Christ Church Symbol"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Welcome to Madras
            </h1>
          </div>
        </section>

        {/* Content Sections */}
        <section id="sacrament" className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="section-title text-3xl mb-8 text-gray-800">Sacrament</h2>
          <div className="prose max-w-none">
            {content.filter(item => item.section === 'sacrament').map(item => (
              <div key={item.id} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{item.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))}
          </div>
        </section>

        <section id="message" className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
          <h2 className="section-title text-3xl mb-8 text-gray-800">Message</h2>
          <div className="prose max-w-none">
            {content.filter(item => item.section === 'message').map(item => (
              <div key={item.id} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{item.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))}
          </div>
        </section>

        <section id="announcements" className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="section-title text-3xl mb-8 text-gray-800">Announcements</h2>
          <div className="prose max-w-none">
            {content.filter(item => item.section === 'announcements').map(item => (
              <div key={item.id} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{item.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))}
          </div>
        </section>

        <section id="more" className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
          <h2 className="section-title text-3xl mb-8 text-gray-800">More</h2>
          <div className="prose max-w-none">
            {content.filter(item => item.section === 'more').map(item => (
              <div key={item.id} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{item.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
} 