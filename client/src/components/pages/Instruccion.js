// client/src/components/pages/Instruccion.js
import React, { useState } from 'react';
import './Pages.css';

const Instruccion = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Paso 1: Configuración",
      content: "Primero, asegúrate de tener Node.js instalado en tu sistema. Luego, crea un nuevo proyecto de React.",
      code: "npx create-react-app mi-proyecto\ncd mi-proyecto\nnpm start"
    },
    {
      title: "Paso 2: Estructura de Componentes",
      content: "Organiza tu aplicación en componentes reutilizables. Crea una carpeta 'components' para mantener el código ordenado.",
      code: "src/\n  components/\n    Header.js\n    Navigation.js\n    pages/\n      Instruccion.js\n      Galeria.js\n      ..."
    },
    {
      title: "Paso 3: Navegación",
      content: "Implementa la navegación entre páginas usando el estado de React para cambiar entre componentes.",
      code: "const [currentPage, setCurrentPage] = useState('instruccion');\n\n// Renderizar página actual\n{currentPage === 'instruccion' && <Instruccion />}"
    },
    {
      title: "Paso 4: Estilos y Responsive",
      content: "Añade estilos CSS para hacer tu aplicación atractiva y asegúrate de que sea responsive.",
      code: "@media (max-width: 768px) {\n  .container {\n    padding: 1rem;\n  }\n}"
    }
  ];

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Guía de Instrucciones</h2>
        <p className="page-description">
          Sigue estos pasos para entender cómo funciona esta aplicación React.
        </p>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`step-card ${activeStep === index ? 'active' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              <div className="step-header">
                <span className="step-number">{index + 1}</span>
                <h3 className="step-title">{step.title}</h3>
              </div>
              {activeStep === index && (
                <div className="step-content">
                  <p>{step.content}</p>
                  <pre className="code-block">
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
          >
            Anterior
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStep === steps.length - 1}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instruccion;