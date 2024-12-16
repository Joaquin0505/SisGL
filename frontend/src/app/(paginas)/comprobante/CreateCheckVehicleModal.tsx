'use client';
import { Header } from "@/app/(components)/Header";
import { useGetVehiculosQuery, useGetCustomersQuery, useGetTipovehiculoQuery } from "@/state/api";
import { useState, useEffect, ChangeEvent } from "react";
import { v4 } from "uuid";
import { VehicleFormData, CustomerFormData } from "./CreateComprobanteModal";


export function CreateCheckVehicleModal({ isOpen, onClose }) {
  const { data: vehiculos } = useGetVehiculosQuery();
  const { data: customers } = useGetCustomersQuery();
  const { data: tiposVehiculo } = useGetTipovehiculoQuery();

  const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
    vehiculoId: v4(),
    tipovehiculoId: "",
    tipoVehiculoNombre: "",
    nplaca: "",
    marca: "",
    modelo: "",
    color: "",
  });

  const [customerFormData, setCustomerFormData] = useState<CustomerFormData>({
    customerId: v4(),
    dni: "",
    name: "",
    lastname: "",
    celphone: "",
    direccion: "",
  });

  const [vehicleFound, setVehicleFound] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVehicleFound(false);
      setCustomerFound(false);
    }
  }, [isOpen]);

  const handleVehicleSearch = () => {
    const vehicle = vehiculos?.find((vehiculo) => vehiculo.nplaca === vehicleFormData.nplaca);
    if (vehicle) {
      setVehicleFound(true);
      setErrorMessage(null); // Reseteamos el error
    } else {
      setVehicleFound(false);
    }
  };

  const handleCustomerSearch = () => {
    const customer = customers?.find((customer) => customer.dni === customerFormData.dni);
    if (customer) {
      setCustomerFound(true);
      setErrorMessage(null); // Reseteamos el error
    } else {
      setCustomerFound(false);
    }
  };

  const handleCreateVehicle = (formData: VehicleFormData) => {
    // Aquí iría tu lógica para crear un vehículo en la base de datos
    setErrorMessage(null);
    console.log("Creando vehículo:", formData);
    // Cierra el modal después de crear
    onClose();
  };

  const handleCreateCustomer = (formData: CustomerFormData) => {
    // Aquí iría tu lógica para crear un cliente en la base de datos
    setErrorMessage(null);
    console.log("Creando cliente:", formData);
    // Cierra el modal después de crear
    onClose();
  };

  const handleVehicleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "tipovehiculoId") {
      const selectedTipo = tiposVehiculo?.find((tipo) => tipo.tipovehiculoId === value);
      setVehicleFormData({
        ...vehicleFormData,
        tipovehiculoId: value,
        tipoVehiculoNombre: selectedTipo ? selectedTipo.nombre : "",
      });
    } else {
      setVehicleFormData({ ...vehicleFormData, [name]: value });
    }
  };

  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerFormData({ ...customerFormData, [name]: value });
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20 ${!isOpen ? "hidden" : ""}`}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Buscar o Crear Vehículo y Cliente" />

        <form onSubmit={(e) => e.preventDefault()} className="mt-5">
          {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}

          <label htmlFor="nplaca" className="block text-sm font-medium text-gray-700">
            Número de Placa
          </label>
          <input
            type="text"
            name="nplaca"
            value={vehicleFormData.nplaca}
            onChange={handleVehicleChange}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required />

          <button
            type="button"
            onClick={handleVehicleSearch}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Buscar Vehículo
          </button>

          <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mt-4">
            DNI Cliente
          </label>
          <input
            type="text"
            name="dni"
            value={customerFormData.dni}
            onChange={handleCustomerChange}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required />

          <button
            type="button"
            onClick={handleCustomerSearch}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Buscar Cliente
          </button>

          <div className="mt-4">
            {(!vehicleFound || !customerFound) && (
              <div>
                <h3 className="text-lg font-semibold">No se encontró el vehículo o cliente. Crear nuevo:</h3>
                {!vehicleFound && (
                  <div className="mt-2">
                    <Header name="Crear Vehículo" />
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateVehicle(vehicleFormData); }} className="mt-5">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                      >
                        Crear Vehículo
                      </button>
                    </form>
                  </div>
                )}
                {!customerFound && (
                  <div className="mt-2">
                    <Header name="Crear Cliente" />
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateCustomer(customerFormData); }} className="mt-5">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                      >
                        Crear Cliente
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mt-4"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
}
