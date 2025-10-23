// client/src/components/pages/Galeria.js
import React, { useState } from 'react';
import './Pages.css';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      title: "Montañas",
      description: "Paisaje montañoso al atardecer",
      color: "#FF6B6B",
      emoji: "🏔️"
    },
    {
      id: 2,
      title: "Océano",
      description: "Playas tropicales y aguas cristalinas",
      color: "#4ECDC4",
      emoji: "🌊"
    },
    {
      id: 3,
      title: "Bosque",
      description: "Naturaleza verde y exuberante",
      color: "#45B7D1",
      emoji: "🌲"
    },
    {
      id: 4,
      title: "Ciudad",
      description: "Skyline urbano moderno",
      color: "#96CEB4",
      emoji: "🏙️"
    },
    {
      id: 5,
      title: "Desierto",
      description: "Dunas y paisajes áridos",
      color: "#FFEAA7",
      emoji: "🏜️"
    },
    {
      id: 6,
      title: "Espacio",
      description: "Galaxias y estrellas infinitas",
      color: "#DDA0DD",
      emoji: "🚀"
    }
  ];

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Galería de Imágenes</h2>
        <p className="page-description">
          Explora nuestra colección de imágenes. Haz clic en cualquier tarjeta para ver los detalles.
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
                {image.emoji}
              </div>
              <div className="gallery-content">
                <h3>{image.title}</h3>
                <p>{image.description}</p>
                {selectedImage === image.id && (
                  <div className="image-details">
                    <p><strong>ID:</strong> {image.id}</p>
                    <p><strong>Color:</strong> 
                      <span 
                        className="color-sample"
                        style={{ backgroundColor: image.color }}
                      ></span>
                      {image.color}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="selected-info">
            <h3>Imagen Seleccionada: {images.find(img => img.id === selectedImage)?.title}</h3>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedImage(null)}
            >
              Cerrar Detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Galeria;