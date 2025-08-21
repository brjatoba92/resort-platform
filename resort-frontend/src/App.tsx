import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            🏨 Resort Booking System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tailwind CSS instalado com sucesso!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card card-hover">
              <div className="w-12 h-12 bg-room-occupied rounded-lg mb-4 mx-auto"></div>
              <h3 className="text-xl font-semibold mb-2">Quartos Ocupados</h3>
              <p className="text-gray-600">24 quartos</p>
            </div>
            
            <div className="card card-hover">
              <div className="w-12 h-12 bg-room-reserved rounded-lg mb-4 mx-auto"></div>
              <h3 className="text-xl font-semibold mb-2">Reservas Pendentes</h3>
              <p className="text-gray-600">8 reservas</p>
            </div>
            
            <div className="card card-hover">
              <div className="w-12 h-12 bg-room-available rounded-lg mb-4 mx-auto"></div>
              <h3 className="text-xl font-semibold mb-2">Quartos Disponíveis</h3>
              <p className="text-gray-600">15 quartos</p>
            </div>
          </div>
          
          <div className="mt-8 space-x-4">
            <button className="btn-primary">
              Botão Primário
            </button>
            <button className="btn-secondary">
              Botão Secundário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;