// src/app/garaje/ModalAsignarEstado.tsx

import React, {useState} from 'react'

interface ModalProps {
  selectedBlock: string | null;
  selectedSpace: number | null;
  currentStatus: string;
  onChangeStatus: (newStatus: string) => void;
  onCancel: () => void;
  onSelectBlock: (block: string) => void;
  onSelectSpace: (space: number) => void;
}

const ModalAsignarEstado = ({ 
  selectedBlock,
  selectedSpace,
  currentStatus,
  onChangeStatus,
  onCancel,
  onSelectBlock,
  onSelectSpace,
   }: ModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  // Opciones de estado basado en el estado actual
  const availableStatuses = ['DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO'].filter(
    (status) => status !== currentStatus
  );
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Asignar Estado a Espacio</h2>

        {/* Selección de bloque */}
        <label className="block mb-2">Selecciona Bloque:</label>
        <select
          value={selectedBlock || ''}
          onChange={(e) => onSelectBlock(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        >
          <option value="">Selecciona Bloque</option>
          <option value="A">Bloque A</option>
          <option value="B">Bloque B</option>
          <option value="C">Bloque C</option>
          <option value="D">Bloque D</option>
        </select>

        {/* Selección de espacio */}
        {selectedBlock && (
          <>
            <label className="block mb-2">Selecciona Espacio:</label>
            <select
              value={selectedSpace || ''}
              onChange={(e) => onSelectSpace(Number(e.target.value))}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            >
              <option value="">Selecciona Espacio</option>
              {Array.from({ length: 34 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Espacio {index + 1}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Estado actual y cambio de estado */}
        {selectedSpace && (
          <>
            <label className="block mb-2">Estado Actual: {currentStatus}</label>
            <label className="block mb-2">Nuevo Estado:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            >
              <option value="">Seleccionar estado</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Botones de cambio y cancelación */}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onChangeStatus(selectedStatus)}
            disabled={!selectedStatus}
          >
            Cambiar
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarEstado;