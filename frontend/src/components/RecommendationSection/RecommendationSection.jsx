import React from 'react';
import Slider from 'react-slick';
import './RecommendationSection.css';

function RecommendationSection({ recommendations }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    
    // centerMode: true, // Active le mode centré
    // centerPadding: '100px', // Ajoute un espacement entre les éléments
  };

  return (
    <div>
      <h2>Recommandations de Films</h2>
      <Slider {...settings}>
        {recommendations.map((movie) => (
          <div className="slider-item" key={movie.title}>
            <div className="slider-item-content">
              <div
                style={{
                  backgroundImage: `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`,
                  height: '100%',
                }}
              >
                <h3>{movie.title}</h3>
                <p>Langue: {movie.goriginal_language}</p>
                <p>Note: {movie.vote_average}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default RecommendationSection;
