import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum EstadoEspacio {
  DISPONIBLE = "DISPONIBLE",
  OCUPADO = "OCUPADO",
  MANTENIMIENTO = "MANTENIMIENTO",
}
export interface Espacio {
  espacioId: string;
  bloqueId: string;
  categoriId: string;
  nombre: string;
  estado: EstadoEspacio;
}
export interface ParkingSummary {
  totalSpaces: number;
  occupiedSpaces: number;
  maintenanceSpaces: number;
}
export interface DashboardMetrics {
  ingresosMensuales: number;
  comprobantesRecientes: Comprobante[]; // Ajusta este tipo según tu respuesta real
  tiposVehiculosFrecuentes:{ tipoVehiculo: string; frecuencia: number }[];
  parkingSummary: ParkingSummary;

}
export interface User {
  userId: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
  dni: string;
  email: string;
  password: string;
}

export interface NewUser {
  name: string;
  email: string;
}

export interface Empresa {
  empresaId: string;
  ruc: string;
  name: string;
  imagen: string | undefined;
}

export interface Vehiculo {
  vehiculoId: string;
  tipovehiculoId: string;
  nplaca: string;
  marca: string;
  modelo: string;
  color: string;
  cantidad: number;
}

export interface NewVehiculo {
  nplaca: string;
  marca: string;
  modelo: string;
  color: string;
}

export interface Customer {
  customerId: string;
  dni: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
}

export interface NewCustomer {
  dni: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
}
export interface Tipovehiculo {
  tipovehiculoId: string;
  nombre: string;
  tarifa: number; // Asegurarte de que tarifa sea number
}
export interface NewTipovehiculo {
  nombre: string;
  tarifa: number;
}
export interface Comprobante {
  comprobanteId: string;
  vehiculoId: string;
  customerId: string;
  userId?: string;
  espacioId: string;
  fechaentrada?: Date | string | null;
  fechasalida?: Date;
  descripcion: string | null;
  estadoComp: string;
}

export interface NewComprobante {
  customerId: string;
  espacioId: string;
  vehiculoId: string;
  fechaentrada?: Date | string | null;
  descripcion: string | null;
  estadoComp: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    responseHandler: async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.message || "Error desconocido",
        };
      }
      return response.json();
    },
  }),
  tagTypes: [
    "DashboardMetrics",
    "Users",
    "Comprobantes",
    "Espacios",
    "Vehiculos",
    "Customers",
    "Tipovehiculo",
    "Empresa",
  ],
  endpoints: (build) => ({
    loginUser: build.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getProfile: build.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    }),

    // Obtener espacios
    getEspacios: build.query<Espacio[], void>({
      query: () => "/espacio", // Ruta de la API para obtener espacios
      providesTags: ["Espacios"],
    }),

    // Actualizar estado de un espacio
    updateEstadoEspacio: build.mutation<
      void,
      { espacioId: string; estado: string }
    >({
      query: ({ espacioId, estado }) => ({
        url: `/espacio`,
        method: "PUT",
        body: { espacioId, estado },
      }),
      invalidatesTags: (result, error, { espacioId }) => [
        { type: "Espacios", id: espacioId },
      ],
    }),

    // Resto de endpoints existentes
    getComprobante: build.query<Comprobante[], void>({
      query: () => "/comprobante",
      providesTags: ["Comprobantes"],
    }),

    retirarComprobante: build.mutation({
      query: (comprobanteId) => ({
        url: `/comprobante/retirar/${comprobanteId}`,
        method: "PATCH",
      }),
    }),

    updateComprobante: build.mutation({
      query: ({ comprobanteId, estadoComp }) => ({
        url: `/comprobante/${comprobanteId}`, // Ruta de tu API
        method: "PUT",
        body: { estadoComp }, // Datos enviados al backend
      }),
    }),

    // Crear comprobante
    createComprobante: build.mutation<Comprobante, NewComprobante>({
      query: (newComprobante) => ({
        url: "/comprobante",
        method: "POST",
        body: newComprobante,
      }),
      invalidatesTags: ["Comprobantes"],
    }),

    deleteComprobantes: build.mutation<void, string>({
      query: (comprobanteId) => ({
        url: `/comprobante/${comprobanteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comprobantes"], // Invalida la caché para refrescar la lista de comprobantes
    }),

    getComprobanteById: build.query<Comprobante, string>({
      query: (comprobanteId) => `/comprobante/${comprobanteId}`,
      providesTags: ["Comprobantes"],
    }),

    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    createUser: build.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: build.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: build.mutation<User, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    getVehiculoByPlaca: build.query<Vehiculo, string>({
      query: (nplaca) => `/vehiculo/placa/${nplaca}`,
      providesTags: ["Vehiculos"],
    }),

    getVehiculos: build.query<Vehiculo[], void>({
      query: () => "/vehiculo",
      providesTags: ["Vehiculos"],
    }),

    createVehiculos: build.mutation<Vehiculo, NewVehiculo>({
      query: (NewVehiculo) => ({
        url: "/vehiculo",
        method: "POST",
        body: NewVehiculo,
      }),
      invalidatesTags: ["Vehiculos"],
    }),

    deleteVehiculo: build.mutation<void, string>({
      query: (vehiculoId) => ({
        url: `/vehiculo/${vehiculoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehiculos"], // Invalida la cache para actualizar la lista de vehículos
    }),

    updateVehiculo: build.mutation<
      Vehiculo,
      { vehiculoId: string; data: Partial<Vehiculo> }
    >({
      query: ({ vehiculoId, data }) => ({
        url: `/vehiculo/${vehiculoId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vehiculos"], // Invalida la cache para refrescar la lista
    }),

    getTipovehiculo: build.query<Tipovehiculo[], void>({
      query: () => "/tipovehiculo",
      providesTags: ["Tipovehiculo"],
    }),

    createTipovehiculo: build.mutation<Tipovehiculo, NewTipovehiculo>({
      query: (newTipovehiculo) => ({
        url: "/tipovehiculo",
        method: "POST",
        body: newTipovehiculo,
      }),
      invalidatesTags: ["Tipovehiculo"],
    }),

    getCustomerByDni: build.query<Customer, string>({
      query: (dni) => `/customer/dni/${dni}`,
      providesTags: ["Customers"],
    }),

    // Obtener todos los clientes
    getCustomers: build.query<Customer[], void>({
      query: () => "/customer",
      providesTags: ["Customers"],
    }),

    // Crear un nuevo cliente
    createCustomer: build.mutation<Customer, NewCustomer>({
      query: (NewCustomer) => ({
        url: "/customer",
        method: "POST",
        body: NewCustomer,
      }),
      invalidatesTags: ["Customers"], // Invalida la caché para actualizar la lista de clientes
    }),

    // Eliminar un cliente por ID
    deleteCustomer: build.mutation<void, string>({
      query: (customerId) => ({
        url: `/customer/${customerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"], // Invalida la caché para actualizar la lista de clientes
    }),

    // Actualizar un cliente por ID
    updateCustomer: build.mutation<Customer,{ customerId: string; data: Partial<Customer> }>({
      query: ({ customerId, data }) => ({
        url: `/customer/${customerId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customers"], // Invalida la caché para refrescar la lista
    }),

    getEmpresa: build.query<Empresa[], void>({
      query: () => "/empresa", // Esto se conecta con el backend
      providesTags: ["Empresa"],
    }),

    updateEmpresa: build.mutation<Empresa,{ empresaId: string; data: Partial<Empresa> }>({
      query: ({ empresaId, data }) => ({
        url: `/empresa/${empresaId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Empresa"], // Refresca la caché
    }),
  }),
});

export const {
  useRetirarComprobanteMutation,
  useUpdateComprobanteMutation,
  useGetEmpresaQuery,
  useUpdateEmpresaMutation,
  useGetEspaciosQuery,
  useUpdateEstadoEspacioMutation,
  useGetComprobanteQuery,
  useCreateComprobanteMutation,
  useDeleteComprobantesMutation,
  useGetComprobanteByIdQuery,
  useGetVehiculoByPlacaQuery,
  useGetCustomerByDniQuery,
  useUpdateVehiculoMutation,
  useDeleteVehiculoMutation,
  useGetTipovehiculoQuery,
  useCreateTipovehiculoMutation,
  useCreateVehiculosMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useGetVehiculosQuery,
  useGetDashboardMetricsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetProfileQuery,
  useLoginUserMutation,
} = api;
