import React from 'react'

const NoEncontrado = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="w-24 h-24 mb-4">
        <svg
          className="w-full h-full text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-200 mb-2">
        No hay usuarios disponibles
      </h3>
      <p className="text-gray-400 text-sm">
        No se encontraron usuarios para mostrar en este momento
      </p>
    </div>
  )
}

export default NoEncontrado
