'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import { Header } from "@/app/(components)/Header";

type CreateTipoVehiculoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (nombre: string, tarifa: number) => void;
};

export const CreateTipoVehiculoModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateTipoVehiculoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [tarifa, setTarifa] = useState<number | "">("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof tarifa === "string" || isNaN(tarifa)) {
      alert("Por favor, ingresa un valor numérico válido para la tarifa.");
      return;
    }
    onCreate(nombre, tarifa);
    setNombre("");
    setTarifa("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Tipo de Vehículo" />
        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre del Tipo de Vehículo
          </label>
          <input
            type="text"
            name="nombre"
            value={nombre}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="tarifa" className="block text-sm font-medium text-gray-700">
            Tarifa
          </label>
          <input
            type="number"
            name="tarifa"
            value={tarifa}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTarifa(parseInt(e.target.value))}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Crear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};
