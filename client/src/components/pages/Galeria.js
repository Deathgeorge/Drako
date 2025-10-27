import React, { useState } from 'react';
import './Pages.css';
import imgCampo from '../../images/IMG_20210926_134514.jpg';
import imgLago from '../../images/IMG_20230408_122818.jpg';
import imgEnoy from '../../images/IMG_20211020_122641.jpg';


const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      title: "Campo",
      description: "Paseos en el Simon Bolivar",
      color: "#FF6B6B",
      emoji: imgCampo
    },
    {
      id: 2,
      title: "Lago",
      description: "Tarde en el Lago",
      color: "#4ECDC4",
      emoji: imgLago
    },
    {
      id: 4,
      title: "Campo",
      description: "Al loco le encanta el campo",
      color: "#96CEB4",
      emoji: imgEnoy
    }
  ];

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Galería de Imágenes</h2>
        <p className="page-description">
          Las Aventuras de Drako
        </p>

        <div className="gallery-grid">
          {images.map(image => (
            <div 
              key={image.id}
              className={`gallery-card ${selectedImage === image.id ? 'selected' : ''}`}
              onClick={() => setSelectedImage(selectedImage === image.id ? null : image.id)}
              style={{ borderColor: image.color }}
            >
              <div 
                className="gallery-emoji"
                style={{ backgroundColor: image.color }}
              >
                <img src={image.emoji} alt="Descripción de la imagen" className="imagen-pequena"></img>
              </div>
              <div className="gallery-content">
                <h3>{image.title}</h3>
                <p>{image.description}</p>
                
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default Galeria;