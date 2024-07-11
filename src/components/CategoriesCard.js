import React from "react";
import PropTypes from "prop-types";

const CategoriesCard = ({ category, onSelect }) => {
  // Sanitize the category name for the image file name
  const imageUrl = `/images/${category.name
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/ /g, "_")}.jpg`;

  return (
    <div className="categories-card" onClick={() => onSelect(category)}>
      <img src={imageUrl} alt={category.name} />
      <h3>{category.name}</h3>
    </div>
  );
};

CategoriesCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoriesCard;
