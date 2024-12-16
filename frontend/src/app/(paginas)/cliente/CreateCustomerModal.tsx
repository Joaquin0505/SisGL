'use client';

import { useEffect, useState } from "react";
import { Header } from "@/app/(components)/Header";
import { ChangeEvent, FormEvent } from "react";
import { useGetCustomersQuery } from "@/state/api";
import { v4 } from "uuid";

interface CustomerFormData {
  customerId: string; // Cambiar a obligatorio
  dni: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
}

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
}

export const CreateCustomerModal = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
}: CreateCustomerModalProps) => {
  const { data: customers } = useGetCustomersQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<CustomerFormData>(
    initialData || {
      customerId: v4(),
      dni: "",
      name: "",
      lastname: "",
      celphone: "",
      direccion: "",
    }
  );

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData); // Rellenar el formulario si estamos editando
    } else if (isOpen && !initialData) {
      // Limpiar el formulario si estamos en modo creación
      setFormData({
        customerId: v4(),
        dni: "",
        name: "",
        lastname: "",
        celphone: "",
        direccion: "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar si el DNI ya existe
    const isDuplicateDNI = customers?.some((customer) => customer.dni === formData.dni);
    if (isDuplicateDNI && (!initialData || initialData.dni !== formData.dni)) {
      setErrorMessage("El DNI ya está registrado.");
      return;
    }

    setErrorMessage(null);
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={initialData ? "Editar Cliente" : "Crear Cliente"} />
        <form onSubmit={handleSubmit} className="mt-5">
          {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
          <input
            type="text"
            name="dni"
            onChange={handleChange}
            value={formData.dni}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            name="lastname"
            onChange={handleChange}
            value={formData.lastname}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="celphone" className="block text-sm font-medium text-gray-700">Celular</label>
          <input
            type="text"
            name="celphone"
            onChange={handleChange}
            value={formData.celphone}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="direccion"
            onChange={handleChange}
            value={formData.direccion}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {initialData ? "Actualizar" : "Crear"}
          </button>
          <button
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
