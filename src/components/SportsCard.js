import React from "react";
import PropTypes from "prop-types";

const SportsCard = ({ category, onSelect }) => {
  return (
    <div className="sports-card" onClick={() => onSelect(category)}>
      <h3>{category.name}</h3>
    </div>
  );
};

SportsCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SportsCard;
