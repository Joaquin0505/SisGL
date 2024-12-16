'use client'

import { useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation } from "@/state/api";
import { CreateUserModal } from "./CreateUserModal";
import { useAppSelector } from "@/app/redux";


interface UserFormData {
  userId?: string;
  dni: string;
  name: string;
  lastname: string;
  celphone: string;
  direccion: string;
  email: string;
  password: string;
}

export default function UsuarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
  const [searchDNI, setSearchDNI] = useState("");
  const { data: users, isError, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();


  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  


  const handleCreateOrUpdateUser = async (userData: UserFormData) => {
    if (isEditMode && selectedUser) {
      await updateUser({ userId: selectedUser.userId!, data: userData });  // Asegurarse de que userId no sea undefined en modo edición
    } else {
      await createUser(userData);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: UserFormData) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      await deleteUser(userId);
    }
  };

  const columns: GridColDef[] = [
    { field: "dni", headerName: "DNI", width: 120 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "lastname", headerName: "Apellido", width: 150 },
    { field: "celphone", headerName: "Celular", width: 130 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "actions",
      headerName: "Acciones",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MdEdit color="#22c11a" size={25} />}
          label="Editar"
          onClick={() => handleEditUser(params.row)}
        />,
        <GridActionsCellItem
          icon={<MdDeleteForever color="#c11a3f" size={25} />}
          label="Eliminar"
          onClick={() => handleDeleteUser(params.row.userId)}
        />
      ]
    }
  ];

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !users) {
    return (
      <div className="text-center text-red-500 py-4">
        Falla en la conexión
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.dni.toLowerCase().includes(searchDNI.toLowerCase())
  );

  return (
    <div className="flex flex-col content-center h-full justify-center items-center pt-1 xl:pt-1 px-4 mt-6 ml-3">
      <div className="flex flex-col gap-6 bg-white w-full rounded-2xl shadow-lg shadow-slate-500 pb-11 pt-8 px-5">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="md:text-3xl font-extrabold text-gray-800 text-3xl">Lista de Usuarios</h1>
          <div className="border-gray-500 border-2 rounded-2xl p-2 flex items-center px-3">
            <input 
              type="text" 
              placeholder="Buscar por DNI" 
              className="outline-none bg-transparent"
              value={searchDNI}
              onChange={(e) => setSearchDNI(e.target.value)}
            />
            <FaSearch color="#146984" />
          </div>
        </div>
        
        <div style={{ height: 330, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.userId}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            className="bg-white"
            sx={{
              '& .MuiDataGrid-cell': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Dark mode text color
              },
              '& .MuiTablePagination-root': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Pagination text color
              },
              '& .MuiTablePagination-select': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Rows per page dropdown color
              },
              '& .MuiTablePagination-actions': {
                color: isDarkMode ? 'rgb(203, 213, 225)' : 'rgb(55, 65, 81)', // Arrow buttons color
              },
            }}
          />
        </div>
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-40"
        onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
          setSelectedUser(null);
        }}
      >
        Agregar Usuario
      </button>
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrUpdateUser}
        initialData={isEditMode ? selectedUser : null}
      />
    </div>
  );
}
