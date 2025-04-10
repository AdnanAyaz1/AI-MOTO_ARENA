import React from 'react'
import { Car, Calendar, Shield } from 'lucide-react'

const Benefits = () => {
  return (
    <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-12">
        Why Choose Our Platform
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
          <p className="text-gray-600">
            Thousands of verified vehicles from trusted dealerships and
            private sellers.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
          <p className="text-gray-600">
            Book a test drive online in minutes, with flexible scheduling
            options.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Secure Process</h3>
          <p className="text-gray-600">
            Verified listings and secure booking process for peace of mind.
          </p>
        </div>
      </div>
    </div>
  </section>

  )
}

export default Benefits