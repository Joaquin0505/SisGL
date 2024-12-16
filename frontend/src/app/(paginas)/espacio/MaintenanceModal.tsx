'use client';

import { useUpdateEstadoEspacioMutation } from "@/state/api";
import { useState } from "react";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceNumber: number;
  onSetAvailable: () => void;
  uuid: string;
  onChangeStatus: (newStatus: string) => void;
}

export const MaintenanceModal = ({
  isOpen,
  onClose,
  spaceNumber,
  onSetAvailable,
  uuid,
  onChangeStatus
}: MaintenanceModalProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [updateEstadoEspacio] = useUpdateEstadoEspacioMutation();

  const handleSetDisponible = () => {
    updateEstadoEspacio({ espacioId: uuid, estado: 'DISPONIBLE' });
    onChangeStatus('DISPONIBLE');
    onClose();
  };

  const handleConfirm = () => {
    onSetAvailable();
    setShowConfirmation(false);
    handleSetDisponible();
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {showConfirmation ? (
            <>
              <h2 className="text-lg font-bold mb-4">Confirmar acción</h2>
              <p className="mb-4">¿Estás seguro de cambiar el espacio número {spaceNumber} a disponible?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Confirmar
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">Espacio en Mantenimiento</h2>
              <p className="mb-4">El espacio número {spaceNumber} se encuentra en mantenimiento.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Cambiar a Disponible
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
};