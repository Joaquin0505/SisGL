// OccupiedSpaceModal.tsx

import React from "react";

type OccupiedSpaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const OccupiedSpaceModal: React.FC<OccupiedSpaceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center">
          El espacio se encuentra ocupado por un vehículo
        </h2>
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
