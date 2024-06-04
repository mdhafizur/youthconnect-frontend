// page.tsx

'use client'

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-5xl font-bold text-center text-gray-600 mb-6">Empowering Chemnitz Youth: Your Guide to Education & Care Facilities</h1>
        <p className="text-lg text-gray-700 mb-4">
          Access to education and care services is crucial for the development of children, adolescents, and young adults. These services are not only essential but also a legal right. Finding the right facilities, understanding their locations, and knowing how to access them are key to making informed decisions.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our mission is to create an interactive map application for Chemnitz that provides detailed information on these vital facilities. Explore and connect with resources available through the following open data portal:
        </p>
        <Link href="https://portal-chemnitz.opendata.arcgis.com/" className="text-gray-500 underline">
          Open Data Portal
        </Link>
        <div className="mt-8 flex justify-center">
          <a href='/register' className="bg-gray-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-gray-700 transition duration-300">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
