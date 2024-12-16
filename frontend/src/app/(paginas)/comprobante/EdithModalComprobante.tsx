'use client';
import React, { useState, useEffect } from 'react';
import { useUpdateComprobanteMutation } from "@/state/api";

type ComprobanteFormData = {
  comprobanteId: string;
  estadoComp: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  comprobante: ComprobanteFormData | null;
};

export const EdithModalComprobante = ({ isOpen, onClose, comprobante }: Props) => {
  const [estadoComp, setEstadoComp] = useState(comprobante?.estadoComp || "");
  const [updateComprobante] = useUpdateComprobanteMutation();

  // Sincronizar el estado cuando cambien las props
  useEffect(() => {
    if (comprobante) {
      setEstadoComp(comprobante.estadoComp || "");
    }
  }, [comprobante]);

  const handleSave = async () => {
    if (!comprobante?.comprobanteId || !estadoComp) {
      console.log("Datos inválidos:", { comprobante, estadoComp });
      alert("Comprobante inválido.");
      return;
    }
    console.log("Enviando datos a la mutación:", { comprobanteId: comprobante.comprobanteId, estadoComp });

    try {
      const result = await updateComprobante({ comprobanteId: comprobante.comprobanteId, estadoComp }).unwrap();
      alert("Estado actualizado correctamente.");
    
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado. Inténtelo nuevamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Comprobante</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            value={estadoComp}
            onChange={(e) => setEstadoComp(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Seleccione un estado</option>
            <option value="POR_PAGAR">POR_PAGAR</option>
            <option value="PAGADO">PAGADO</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
