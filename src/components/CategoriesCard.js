import React from "react";
import PropTypes from "prop-types";

const sanitizeCategoryName = (name) => {
  return name
    .toLowerCase()
    .replace(/ & /g, "_and_")
    .replace(/:/g, "")
    .replace(/ /g, "_");
};

const CategoriesCard = ({ category, onSelect }) => {
  const imageUrl = `/images/${sanitizeCategoryName(category.name)}.jpg`;

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
