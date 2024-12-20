import React from "react";
import CategoriesCard from "./CategoriesCard";
import "./Categories.css";

const Categories = ({ categories, onSelectCategory }) => {
  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <CategoriesCard
          key={category.id}
          category={category}
          onSelect={onSelectCategory}
        />
      ))}
    </div>
  );
};

export default Categories;
