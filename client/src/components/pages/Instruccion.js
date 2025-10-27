import React, { useState } from 'react';
import './Pages.css';

import imgWalk from '../../images/IMG_20230330_064614.jpg';
import imgLick from '../../images/IMG_20210630_204940.jpg';
import imgRelax from '../../images/IMG_20201106_233757.jpg';
import imgPatiente from '../../images/IMG_20210907_152657.jpg';



const Instruccion = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Paso 1: Calma y Conexion",
      content: "Empieza el día con un paseo tranquilo de 20-30 minutos.\nDeja que huela libremente y evita zonas ruidosas o con muchos perros. \nUsa un tono suave y hazle masajes cortos en pecho o detrás de las orejas para activar su nervio vago",
      code: imgWalk
    },
    {
      title: "Paso 2: Mente activa, cuerpo tranquilo",
      content: "Después de la guardería o en casa, dedica 10-15 minutos a juegos de olfato o entrenamiento positivo.\nEjemplo: esconder premios o practicar “mírame” y “quieto”.\nMantén sesiones cortas y alegres, sin exigir demasiado..",
      code: imgLick
    },
    {
      title: "Paso 3: Tarde de relajación",
      content: "Crea un ambiente relajante: música suave, luz baja, rutinas predecibles. \nSi hay truenos o ruidos, usa una camiseta ajustada tipo “Thundershirt” y prémialo por mantener la calma. \nUn snack de lamido (yogurt o mantequilla de maní en lickimat) ayuda a relajar.",
      code: imgRelax
    },
    {
      title: "Paso 4: Constancia y paciencia",
      content: "La calma se entrena con repetición. Mantén horarios fijos y refuerza con cariño cada avance. Evita castigos: enfócate en premiar la tranquilidad y el autocontrol.",
      code: imgPatiente
    }
  ];

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Guía de Instrucciones</h2>
        <p className="page-description">
          Sigue estos pasos para tratar de entrenar a un perro loco.
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
                  <div className="code-block">
                    <img src={step.code} alt="Descripción de la imagen" className="imagen-pequena"></img>
                  </div>
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