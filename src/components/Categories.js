import React from "react";
import SportsCard from "./SportsCard";

const Categories = ({ categories, onSelectCategory }) => {
  return (
    <div className="categories">
      {categories.map((category) => (
        <SportsCard
          key={category.id}
          category={category}
          onSelect={onSelectCategory}
        />
      ))}
    </div>
  );
};

export default Categories;
