// client/src/components/pages/Resumen.js
import React, { useState, useEffect } from 'react';
import './Pages.css';

const Resumen = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    favoritePage: '',
    timeSpent: 0
  });

  const summaryData = [
    {
      category: "Instrucción",
      description: "Guía paso a paso para entender la aplicación",
      features: ["Tutorial interactivo", "Ejemplos de código", "Navegación por pasos"],
      completion: 100
    },
    {
      category: "Galería",
      description: "Colección de imágenes y elementos visuales",
      features: ["Galería interactiva", "Detalles expandibles", "Diseño responsive"],
      completion: 85
    },
    {
      category: "Interactiva",
      description: "Componentes dinámicos y juegos",
      features: ["Contador", "Selector de colores", "Chat en tiempo real"],
      completion: 90
    },
    {
      category: "Resumen",
      description: "Estadísticas y overview de la aplicación",
      features: ["Métricas de uso", "Progreso general", "Estadísticas"],
      completion: 95
    }
  ];

  useEffect(() => {
    // Simular datos de estadísticas
    setStats({
      totalVisits: 142,
      favoritePage: "Interactiva",
      timeSpent: 45 // minutos
    });
  }, []);

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Resumen General</h2>
        <p className="page-description">
          Vista general del progreso y estadísticas de la aplicación.
        </p>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Visitas Totales</h3>
              <span className="stat-number">{stats.totalVisits}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Página Favorita</h3>
              <span className="stat-text">{stats.favoritePage}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h3>Tiempo Total</h3>
              <span className="stat-number">{stats.timeSpent} min</span>
            </div>
          </div>
        </div>

        {/* Resumen por Categoría */}
        <div className="summary-section">
          <h3>Resumen por Sección</h3>
          <div className="summary-list">
            {summaryData.map((section, index) => (
              <div key={index} className="summary-item">
                <div className="summary-header">
                  <h4>{section.category}</h4>
                  <span className="completion-badge">
                    {section.completion}%
                  </span>
                </div>
                <p className="summary-description">{section.description}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${section.completion}%` }}
                  ></div>
                </div>
                <ul className="features-list">
                  {section.features.map((feature, featIndex) => (
                    <li key={featIndex}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusión */}
        <div className="conclusion-card">
          <h3>🎉 ¡Aplicación Completada!</h3>
          <p>
            Esta aplicación demuestra el poder de React para crear interfaces modernas 
            y responsive con componentes reutilizables. Cada sección muestra diferentes 
            capacidades del framework.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">React</span>
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">CSS3</span>
            <span className="tech-tag">JavaScript ES6+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resumen;