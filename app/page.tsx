import Image from 'next/image'
import { getContent } from '@/lib/content'

export default async function Home() {
  const content = await getContent()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/hero-image.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            Welcome to Madras
          </h1>
        </div>
      </section>

      {/* Content Sections */}
      {content.map((section) => (
        <section key={section.id} className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">{section.title}</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
        </section>
      ))}
    </main>
  )
} 