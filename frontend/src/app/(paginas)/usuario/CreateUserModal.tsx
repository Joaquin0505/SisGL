'use client'

import { useEffect, useState } from "react";
import { Header } from "@/app/(components)/Header";
import { ChangeEvent, FormEvent } from "react";
import { v4 } from "uuid";
import { useGetUsersQuery } from "@/state/api";

interface UserFormData {
    userId?: string;  // Opcional, ya que es generado en el backend o frontend
    dni: string;
    name: string;
    lastname: string;
    celphone: string;
    direccion: string;
    email: string;
    password: string;
}

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: UserFormData) => void;  // Asegurarse que coincida con UserFormData
    initialData?: UserFormData | null;
}

export const CreateUserModal = ({ isOpen, onClose, onCreate, initialData }: CreateUserModalProps) => {
    const { data: users } = useGetUsersQuery(); // Obtener la lista de usuarios para validar el DNI
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de error
  
    // Asegurarse de que cuando no hay datos iniciales (modo de creación), los campos se establezcan vacíos
    const [formData, setFormData] = useState<UserFormData>(
      initialData || {
        userId: v4(),
        dni: "",
        name: "",
        lastname: "",
        celphone: "",
        direccion: "",
        email: "",
        password: "",
      }
    );
  
    useEffect(() => {
      if (isOpen && initialData) {
        setFormData(initialData); // Rellenar el formulario con datos iniciales en modo edición
      } else if (isOpen && !initialData) {
        // Limpiar el formulario si estamos en modo creación
        setFormData({
          userId: v4(),
          dni: "",
          name: "",
          lastname: "",
          celphone: "",
          direccion: "",
          email: "",
          password: "",
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
  
      // Validar duplicado de DNI
      const isDuplicateDNI = users?.some((user) => user.dni === formData.dni);
      if (isDuplicateDNI) {
        setErrorMessage("El DNI ya está registrado.");
        return;
      }
  
      // Si no hay duplicados, proceder con la creación
      setErrorMessage(null);
      onCreate(formData);
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed -inset-y-10 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <Header name={initialData ? "Editar Usuario" : "Crear Usuario"} />
          <form onSubmit={handleSubmit} className="mt-5">
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
            <input type="text" name="dni" onChange={handleChange} value={formData.dni} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" required />
  
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="name" onChange={handleChange} value={formData.name} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" required />
  
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
            <input type="text" name="lastname" onChange={handleChange} value={formData.lastname} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" required />
  
            <label htmlFor="celphone" className="block text-sm font-medium text-gray-700">Celular</label>
            <input type="text" name="celphone" onChange={handleChange} value={formData.celphone} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" required />
  
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
            <input type="text" name="direccion" onChange={handleChange} value={formData.direccion} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" />
  
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" onChange={handleChange} value={formData.email} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" required />
  
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" name="password" onChange={handleChange} value={formData.password} className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md" required />
  
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              {initialData ? "Actualizar" : "Crear"}
            </button>
            <button onClick={onClose} className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    );
  };
