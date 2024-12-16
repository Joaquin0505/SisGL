import { useState, useEffect } from 'react';
import { useGetVehiculosQuery, useGetCustomersQuery, useUpdateEstadoEspacioMutation, 
  useCreateComprobanteMutation,
  NewCustomer,
  NewVehiculo,
  useCreateVehiculosMutation,
  useDeleteVehiculoMutation,
  useUpdateVehiculoMutation,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useGetComprobanteQuery,
} from '@/state/api';
import { CreateVehicleModal } from '../vehiculo/CreateVehicleModal';
import { CreateCustomerModal } from '../cliente/CreateCustomerModal';


export type VehicleFormData = {
  vehiculoId: string;
  tipovehiculoId: string;
  tipoVehiculoNombre: string;
  nplaca: string;
  marca: string;
  modelo: string;
  color: string;
};

type Customer = {
  customerId: string;
  dni: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
}


interface CreateComprobanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEspacioId: string;
  uuid: string;
  currentStatus: string;
  onChangeStatus: (newStatus: string) => void;
}

export const CreateComprobanteModal = ({
  isOpen,
  onClose,
  selectedEspacioId,
  uuid,
  onChangeStatus,
}: CreateComprobanteModalProps) => {
  const { data: vehiculos, isError } = useGetVehiculosQuery();
  const { data: customers } = useGetCustomersQuery();
  const [updateEstadoEspacio] = useUpdateEstadoEspacioMutation();
  const [createComprobant]=useCreateComprobanteMutation();
  const [createVehiculo] = useCreateVehiculosMutation();
  const [deleteVehiculo] = useDeleteVehiculoMutation();
  const [updateVehiculo] = useUpdateVehiculoMutation();
  const [createCustomer] = useCreateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  
  const [nuevoCliente, setNuevoCliente] = useState<NewCustomer>({
    dni: '',
    name: '',
    lastname: '',    
    celphone: '',
    direccion: '',
  });

  const [nuevoVehiculo, setNuevoVehiculo] = useState<NewVehiculo>({
    nplaca: '',
    marca: '',
    modelo: '',
    color: '',
  });
 

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [selectedVehiculo, setSelectedVehiculo] = useState<VehicleFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [fechaEntrada, setFechaEntrada] = useState('');

  useEffect(() => {
    if (!fechaEntrada) {
      const getCurrentPeruTime = () => {
        const peruDate = new Date().toLocaleString('en-US', {
          timeZone: 'America/Lima',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // formato de 24 horas
        });
        return peruDate.replace(',', ''); // Elimina la coma en el formato
      };
      setFechaEntrada(getCurrentPeruTime());
    }
  }, [fechaEntrada]);

  const [fechaSalida, setFechaSalida] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { data: comprobantes } = useGetComprobanteQuery(); // Consultar comprobantes existentes
  

  const [estadoComp,setSelectedEstadoComp]=useState('');
  
  const [dni, setDni] = useState(""); // Estado para 'dni'
 
  const [isLoading, setIsLoading] = useState(false);

  
  const handlerCreateVehiculo = async (productData: VehicleFormData) => {
    const vehiculoData = { ...productData, cantidad: 1 }; // Añadimos cantidad con valor 1
    try {
        let vehiculoId: string | null = null;
        if (isEditMode && selectedVehiculo) {
            const result = await updateVehiculo({
                vehiculoId: selectedVehiculo.vehiculoId,
                data: vehiculoData,
            });
            if (result.error) throw new Error('Error al actualizar vehículo');
            vehiculoId = selectedVehiculo.vehiculoId; // Usamos el mismo vehiculoId
        } else {
            const result = await createVehiculo(vehiculoData); // Creamos el vehículo
            if (result.error) throw new Error('Error al crear vehículo');
            vehiculoId = result.data?.vehiculoId; // Obtenemos el vehiculoId de la respuesta
        }

        // Verificamos que vehiculoId se haya generado correctamente
        if (!vehiculoId) throw new Error('Faltó el vehiculoId');

        // Actualizamos el estado con los nuevos datos
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedVehiculo(null);
        setNuevoVehiculo({
            nplaca: vehiculoData.nplaca,
            marca: vehiculoData.marca,
            modelo: vehiculoData.modelo,
            color: vehiculoData.color,
        });

        // Establecemos el vehiculoId para el comprobante
        setSelectedVehiculoId(vehiculoId);

    } catch (error) {
        console.error('Error al crear o actualizar vehículo:', error);
    }
};

  useEffect(() => {
    if (selectedVehiculoId) {
      const vehiculo = vehiculos?.find((v) => v.vehiculoId === selectedVehiculoId);
      if (vehiculo) {
        setNuevoVehiculo({
          nplaca: vehiculo.nplaca,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          color: vehiculo.color,
        });
      }
    }
  }, [selectedVehiculoId, vehiculos]);



  const handleCreateOrUpdateCustomer = async (customerData: Customer) => {
    const clienteData = { ...customerData };
    try {
        let customerId: string | null = null;
        if (isEditMode && selectedCustomer) {
            const result = await updateCustomer({ customerId: selectedCustomer.customerId, data: customerData });
            if (result.error) throw new Error('Error al actualizar cliente');
            customerId = selectedCustomer.customerId; // Usamos el mismo customerId
        } else {
            const result = await createCustomer(clienteData); // Creamos el cliente
            if (result.error) throw new Error('Error al crear cliente');
            customerId = result.data?.customerId; // Obtenemos el customerId de la respuesta
        }

        // Verificamos que customerId se haya generado correctamente
        if (!customerId) throw new Error('Faltó el customerId');

        // Actualizamos el estado con los nuevos datos
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedCustomer(null);
        setNuevoCliente({
            dni: clienteData.dni,
            name: clienteData.name,
            lastname: clienteData.lastname,
            celphone: clienteData.celphone,
            direccion: clienteData.direccion,      
        });

        // Establecemos el customerId para el comprobante
        setSelectedCustomerId(customerId);

    } catch (error) {
        console.error('Error al crear o actualizar cliente:', error);
    }
};

  useEffect(() => {
    if (selectedCustomerId) {
      const cliente = customers?.find((c) => c.customerId === selectedCustomerId);
      if (cliente) {
        setNuevoCliente({
          name: cliente.name,
          lastname: cliente.lastname,
          dni: cliente.dni,
          celphone: cliente.celphone,
          direccion: cliente.direccion,
        });
      }
    }
  }, [selectedCustomerId, customers]);

  
  
  const handleCreateComprobante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;  
    setIsLoading(true);

    try {
        // Verificamos que tanto el cliente como el vehículo estén seleccionados
        if (!selectedCustomerId || !selectedVehiculoId) {
          throw new Error('Faltan datos para crear el comprobante: Cliente o Vehículo no seleccionados');
      }

      // Verificar si el vehículo ya tiene un comprobante en estado "PAGADO" o "POR PAGAR"
      const existingComprobante = comprobantes?.find((comp) => comp.vehiculoId === selectedVehiculoId);
      if (existingComprobante && (existingComprobante.estadoComp === 'PAGADO' || existingComprobante.estadoComp === 'POR PAGAR')) {
          alert('Este vehículo ya tiene un comprobante en estado "PAGADO" o "POR PAGAR". No puede crear otro hasta que el anterior sea "RETIRADO".');
          return;
      }

        // Intentamos crear el comprobante
        const dataCreate = {
            customerId: selectedCustomerId,  
            espacioId: uuid,
            vehiculoId: selectedVehiculoId,
            fechaentrada: fechaEntrada,
            descripcion: "", 
            estadoComp: estadoComp,
        };

        const comprobanteResult = await createComprobant(dataCreate);
        if (comprobanteResult.error) throw new Error('Error al crear el comprobante');

        // Actualizamos el estado del espacio
        await updateEstadoEspacio({ espacioId: uuid, estado: 'OCUPADO' });
        onChangeStatus('OCUPADO');
        console.log(dataCreate);

        onClose();
    } catch (error) {
        console.error('Error al crear el comprobante:', error);
    } finally {
        setIsLoading(false);
    }
};



   
  
  

  const handleSetMaintenance = () => {
    updateEstadoEspacio({ espacioId: uuid, estado: 'MANTENIMIENTO' });
    onChangeStatus('MANTENIMIENTO');
    onClose();
  };

  const handleBuscarCliente = async () => {
    try {
      const cliente = customers?.find((c) => c.dni === nuevoCliente.dni);
      if (cliente) {
        setNuevoCliente({
          dni: cliente.dni,
          name: cliente.name,
          lastname: cliente.lastname,
          celphone: cliente.celphone,
          direccion: cliente.direccion,
        });
        setSelectedCustomerId(cliente.customerId);
      } else {
        alert("Cliente no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
    }
  };
  
  const handleBuscarVehiculo = async () => {
    try {
      const vehiculo = vehiculos?.find((v) => v.nplaca === nuevoVehiculo.nplaca);
      if (vehiculo) {
        setNuevoVehiculo({
          nplaca: vehiculo.nplaca,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          color: vehiculo.color,
        });
        setSelectedVehiculoId(vehiculo.vehiculoId);
      } else {
        alert("Vehículo no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar vehículo:", error);
    }
  };
  
  

  const validateForm = () => {
  if (!nuevoVehiculo.nplaca || !fechaEntrada) {
    alert('Por favor, completa los campos obligatorios.');
    return false;
  }
  if (new Date(fechaSalida) < new Date(fechaEntrada)) {
    alert('La fecha de salida no puede ser menor que la fecha de entrada.');
    return false;
  }
  return true;
  };

  if (!isOpen) return null;


  return (
<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-4 rounded-lg shadow-2xl max-w-2xl w-full">
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Crear Comprobante</h2>
      <button
        onClick={handleSetMaintenance}
        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
      >
        Mantenimiento
      </button>
    </div>
    <form onSubmit={handleCreateComprobante} className="space-y-6">
      {/* Espacio seleccionado */}
      <div>
        <label htmlFor="espacioId" className="block text-sm font-medium text-gray-700">
          Espacio
        </label>
        <input
          type="text"
          id="espacioId"
          name="espacioId"
          value={selectedEspacioId}
          readOnly
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Placa del vehículo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className='md:w-[560px]'>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
            Placa
          </label>
          <div className='flex w-full gap-4'>
            <input
              type="text"
              id="placa"
              name="placa"
              value={nuevoVehiculo.nplaca}
              onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, nplaca: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 justify-start"
            />
          <div className='flex  gap-4 justify-end'>
            <button
              type="button"
              onClick={handleBuscarVehiculo}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
            >
              Buscar
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditMode(false);
                setSelectedVehiculo(null);
                setIsModalOpen(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-3 py-0 rounded-lg shadow w-36"
            >
              Agregar Vehículo
            </button>

          </div>

          </div>
        </div>
      </div>

      {/* Información adicional del vehículo */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={nuevoVehiculo.marca}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={nuevoVehiculo.modelo}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={nuevoVehiculo.color}
            onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, color: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Información del cliente */}
      <div>
        <label htmlFor="dniCliente" className="block text-sm font-medium text-gray-700">
          DNI Cliente
        </label>
        <div className="mt-1 flex space-x-4">
          <input
            type="text"
            id="dniCliente"
            name="dniCliente"
            value={nuevoCliente.dni}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, dni: e.target.value })}
            className="flex-1 border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleBuscarCliente}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCustomerModalOpen(true);
              setIsEditMode(false);
              setSelectedCustomer(null);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
          >
            Agregar Cliente
          </button>
        </div>
      </div>

      {/* Campos adicionales del cliente */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={nuevoCliente.name}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={nuevoCliente.lastname}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, lastname: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="celphone" className="block text-sm font-medium text-gray-700">
            Celular
          </label>
          <input
            type="text"
            id="celphone"
            name="celphone"
            value={nuevoCliente.celphone}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, celphone: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fechaEntrada" className="block text-sm font-medium text-gray-700">
            Fecha de Entrada
          </label>
          <input
              type="text"
              id="fechaEntrada"
              name="fechaEntrada"
              value={fechaEntrada}
              readOnly
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div>
          <label htmlFor="fechaSalida" className="block text-sm font-medium text-gray-700">
            Fecha de Salida
          </label>
          <input
            type="datetime-local"
            id="fechaSalida"
            name="fechaSalida"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className='flex justify-between'>
        <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Descripción opcional..."
        />
        </div>
        <div className=' '>
        <label htmlFor="estadoComp" className="block text-sm font-medium text-gray-700">
          Etado de Comprobante
        </label>
        <select className='p-1 borderborder-gray-300'
        id='estadoComp'
        name='estadoComp'
        value={estadoComp}
        onChange={(e) => setSelectedEstadoComp(e.target.value )}
      >
          <option value="">Seleccione un estado</option>
          <option value="POR_PAGAR">Por_Pagar</option>
          <option value="PAGADO">Pagado</option>
      </select>
      </div>
      </div>
      

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium px-6 py-2 rounded-lg shadow"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2 rounded-lg shadow ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  </div>
      <CreateVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handlerCreateVehiculo}
        initialData={isEditMode ? selectedVehiculo : null}
      />


      <CreateCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCreate={handleCreateOrUpdateCustomer}
        initialData={isEditMode ? selectedCustomer : null}
      />   
    </div>
  );
};