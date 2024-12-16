'use client';

import { useEffect, useState } from "react";
import { useGetVehiculosQuery, useGetTipovehiculoQuery } from "@/state/api";
import { Header } from "@/app/(components)/Header";
import { ChangeEvent, FormEvent } from "react";
import { v4 } from "uuid";

type VehicleFormData = {
  vehiculoId: string;
  tipovehiculoId: string;
  tipoVehiculoNombre: string;
  nplaca: string;
  marca: string;
  modelo: string;
  color: string;

};

type CreateVehicleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: VehicleFormData) => void;
  initialData?: VehicleFormData | null;
};

export const CreateVehicleModal = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
}: CreateVehicleModalProps) => {
  const { data: vehiculos } = useGetVehiculosQuery();
  const { data: tiposVehiculo } = useGetTipovehiculoQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>(
    initialData || {
      vehiculoId: v4(),
      tipovehiculoId: "",
      tipoVehiculoNombre: "",
      nplaca: "",
      marca: "",
      modelo: "",
      color: "",

    }
  );

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData); // Rellenar el formulario en modo edición
      setErrorMessage(null); // Resetear el mensaje de error al abrir el modal
    } else if (isOpen && !initialData) {
      // Limpiar el formulario si estamos en modo creación
      setFormData({
        vehiculoId: v4(),
        tipovehiculoId: "",
        tipoVehiculoNombre: "",
        nplaca: "",
        marca: "",
        modelo: "",
        color: "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "tipovehiculoId") {
      const selectedTipo = tiposVehiculo?.find(
        (tipo) => tipo.tipovehiculoId === value
      );
      setFormData({
        ...formData,
        tipovehiculoId: value,
        tipoVehiculoNombre: selectedTipo ? selectedTipo.nombre : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar si la placa ya existe
    const isDuplicatePlaca = vehiculos?.some(
      (vehiculo) =>
        vehiculo.nplaca.toLowerCase() === formData.nplaca.toLowerCase() &&
        vehiculo.vehiculoId !== formData.vehiculoId // Ignorar el registro actual en modo edición
    );

    if (isDuplicatePlaca) {
      setErrorMessage("La placa ya está registrada.");
      return;
    }

    // Proceder con la creación
    setErrorMessage(null);
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={initialData ? "Editar Vehículo" : "Crear Vehículo"} />
        <form onSubmit={handleSubmit} className="mt-5">
          {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}

          <label htmlFor="tipovehiculoId" className="block text-sm font-medium text-gray-700">
            Tipo de Vehículo
          </label>
          <select
            name="tipovehiculoId"
            onChange={handleChange}
            value={formData.tipovehiculoId}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          >
            <option value="" disabled>
              Selecciona un tipo de vehículo
            </option>
            {tiposVehiculo?.map((tipo) => (
              <option key={tipo.tipovehiculoId} value={tipo.tipovehiculoId}>
                {tipo.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="nplaca" className="block text-sm font-medium text-gray-700">
            Número de Placa
          </label>
          <input
            type="text"
            name="nplaca"
            onChange={handleChange}
            value={formData.nplaca}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            name="marca"
            onChange={handleChange}
            value={formData.marca}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <input
            type="text"
            name="modelo"
            onChange={handleChange}
            value={formData.modelo}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            name="color"
            onChange={handleChange}
            value={formData.color}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {initialData ? "Actualizar" : "Crear"}
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
