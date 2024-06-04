'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '../common/context/AuthContext';
import { NextPage } from 'next';
import CategorySelector from '../common/components/forms/CategorySelector';

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(
  () => import('../common/components/maps/MapComponent'),
  {
    ssr: false,
  }
);

const HomePage: NextPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<{ [key: string]: string }>({});

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleColorChange = (category: string, color: string) => {
    setCategoryColors((prevColors) => ({
      ...prevColors,
      [category]: color,
    }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:px-32 lg:py-10 xl:py-12 xl:px-32">
      <div className="mb-8">
        <CategorySelector
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          onColorChange={handleColorChange}
        />
      </div>
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 'calc(100vh - 25rem)', // Adjust based on the height of the header and footer
        }}
      >
        <div className="w-full h-full rounded-lg mb-8">
          <MapComponent
            selectedCategories={selectedCategories}
            categoryColors={categoryColors}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
