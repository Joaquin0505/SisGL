'use client'

import { useState, useEffect } from "react";
import { useGetEmpresaQuery, useUpdateEmpresaMutation } from "@/state/api";

const EmpresaPage = () => {
  const { data: empresa, isLoading, isError } = useGetEmpresaQuery();
  const [updateEmpresa, { isLoading: isUpdating }] = useUpdateEmpresaMutation();
  
  const [empresaName, setEmpresaName] = useState<string>("");
  const [ruc, setRuc] = useState<string>("");
  const [imagen, setImagen] = useState<string | undefined>(undefined); // Estado para la imagen

  // Cargar los datos de la empresa cuando la consulta se haya completado
  useEffect(() => {
    if (empresa && empresa.length > 0) {
      setRuc(empresa[0].ruc);
      setEmpresaName(empresa[0].name);
      setImagen(empresa[0].imagen || undefined); // Cargar la imagen si ya existe
    }
  }, [empresa]);

  // Manejar el cambio del nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpresaName(e.target.value);
  };

  // Manejar el cambio de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result as string); // Guardar la imagen como base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar la actualización
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empresaName.trim() === "") return;

    // Verificar si 'empresa' tiene elementos antes de acceder al primero
    if (empresa && empresa.length > 0) {
      try {
        await updateEmpresa({
          empresaId: empresa[0].empresaId,
          data: { name: empresaName, imagen }, // Enviar imagen como Base64
        });
        alert("Empresa actualizada correctamente");
      } catch (error) {
        alert("Error al actualizar la empresa");
      }
    } else {
      alert("No se ha encontrado la empresa.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error al cargar los datos de la empresa.</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 shadow-xl rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Datos de la Empresa</h1>
        
        <div className="mb-4">
          <p className="text-lg text-gray-500 dark:text-gray-300"><strong>RUC</strong> {ruc}</p>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="empresaName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Empresa</label>
            <input
              type="text"
              id="empresaName"
              value={empresaName}
              onChange={handleNameChange}
              placeholder="Nombre de la Empresa"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:text-white dark:bg-gray-700 transition duration-200 ease-in-out"
            />
          </div>

          {/* Campo para subir la imagen */}
          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subir Imagen</label>
            <input
              type="file"
              id="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 transition duration-200 ease-in-out"
            />
            {imagen && <img src={imagen} alt="Imagen de la empresa" className="mt-4 w-32 h-32 object-cover rounded-full" />}
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={isUpdating} 
              className={`w-full py-3 px-6 text-white font-semibold rounded-md transition duration-300 ease-in-out
                ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
            >
              {isUpdating ? "Actualizando..." : "Actualizar datos de la Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpresaPage;
