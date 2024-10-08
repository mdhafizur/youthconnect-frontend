import React, { useState } from "react";

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onColorChange: (category: string, color: string) => void;
}

const categories = [
  { value: "school", label: "School" },
  { value: "kindergarten", label: "Kindergarten" },
  { value: "social-child-project", label: "Social Child Project" },
  { value: "social-teenager-project", label: "Social Teenager Project" },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoryChange,
  onColorChange,
}) => {
  const [categoryColors, setCategoryColors] = useState<{
    [key: string]: string;
  }>({
    "school": "#ff0000",
    "kindergarten": "#269254",
    "social-child-project": "#091DAF",
    "social-teenager-project": "#9D09B2",
  });

  const handleColorChange = (category: string, color: string) => {
    setCategoryColors((prevColors) => ({
      ...prevColors,
      [category]: color,
    }));
    onColorChange(category, color);
  };

  return (
    <div>
      <label
        htmlFor="categorySelector"
        className="block text-sm lg:text-md xl:text-lg 2xl:text-4xl font-medium mb-4 text-white"
      >
        Select Categories:
      </label>
      <div
        id="categorySelector"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4 bg-white rounded-lg shadow-md"
      >
        {categories.map((category) => (
          <label
            key={category.value}
            className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <input
              type="checkbox"
              value={category.value}
              checked={selectedCategories.includes(category.value)}
              onChange={() => onCategoryChange(category.value)}
              className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
            />
            <span className="text-gray-700 text-xs sm:text-sm">
              {category.label}
            </span>
            <input
              type="color"
              value={categoryColors[category.value]}
              onChange={(e) =>
                handleColorChange(category.value, e.target.value)
              }
              className="h-4 w-4 sm:h-5 sm:w-5 rounded-full ml-auto" 
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;