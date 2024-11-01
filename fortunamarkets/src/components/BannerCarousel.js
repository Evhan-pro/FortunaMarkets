import React, { useState, useEffect } from 'react';

const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const banners = [
    { title: 'Offre spéciale sur le trading', description: 'Frais réduits de 50% ce mois-ci.' },
    { title: 'Staking de Solana', description: 'Gagnez jusqu\'à 10% de rendement.' },
    { title: 'Achetez du Bitcoin facilement', description: 'Achetez des BTC avec votre carte bancaire en quelques minutes.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change de bannière toutes les 5 secondes
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="banner-carousel">
      <div className="banner">
        <h2>{banners[activeIndex].title}</h2>
        <p>{banners[activeIndex].description}</p>
      </div>
    </div>
  );
};

export default BannerCarousel;
