import React from 'react'
import { HomeSearch } from './HomeSearch'

const Hero = () => {
  return (
    <section className="relative py-16 md:py-28 dotted-background">
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl md:text-8xl mb-4 gradient-title">
          Find your Dream Car with Vehiql AI
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Advanced AI Car Search and test drive from thousands of vehicles.
        </p>
      </div>

      {/* Search Component (Client) */}
      <HomeSearch />
    </div>
  </section>
  )
}

export default Hero