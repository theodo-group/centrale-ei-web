import React from 'react';

function CategorySection() {
  const categories = ['Action', 'Comédie', 'Drame', 'Science-fiction', 'Thriller'];

  return (
    <div>
      <h2>Catégories de Films</h2>
      <div className="categories">
        {categories.map(category => (
          <div key={category} className="category">
            <h3>{category}</h3>
            {/* Ajoutez ici le contenu spécifique à chaque catégorie */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;