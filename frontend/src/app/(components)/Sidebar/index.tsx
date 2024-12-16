'use client'
import {  BookUser, Car,   Layout, LogOut, LucideIcon, Map, Menu, MonitorCog, SquareKanban, User } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { useGetEmpresaQuery } from "@/state/api";


interface SiderbarLinkProps{
    href:string;
    icon:LucideIcon;
    label:string;
    isCollapsed:boolean
}


const SidebarLink=({href,icon:Icon,label,isCollapsed}:SiderbarLinkProps)=>{
    const pathname =usePathname();
    const isActive =pathname===href ||(pathname=="/" && href==="/dasboard")
    return(
        <Link href={href}>
            <div className={`cursor-pointer flex items-center 
                ${isCollapsed?"justify-center py-4": "justify-start px-8 py-4 m4"}
                 hover:text-blue-300 hover:bg-blue-100 gap-3 transition-colors 
                 ${isActive? "bg-blue-200 text-white":""}`}>
                    <Icon className='w-6 h-6 !text-gray-700'>
                    </Icon>
                    <span className={`${isCollapsed? "hidden":"block"}
                    font-medium text-gray-700`}>
                        {label}
                    </span>

            </div>
        </Link>
        );
    };
export const Sidebar = () => {
    const dispatch =useAppDispatch();
    const isSidebarCollapsed=useAppSelector((state)=>state.global.isSidebarCoolapsed);
    
    const toggleSidebar=()=>{
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
    };

    const { data: empresas, isLoading, error } = useGetEmpresaQuery();


    const sidebarClassNames=` w- full fixed flex flex-col 
    ${isSidebarCollapsed? "w-0 md:w-20": "w-72 md:w-64 "} bg-white transition-all 
    duration-300 overflow-hidden h-full shadow-md z-40 `;



    

  return (
    <div className={sidebarClassNames}>
        <button 
            className='absolute w-f md:hidden p-3 bg-gray-100 rounded-full mt-7  hover:bg-blue-100 right-11 ' 
                onClick={toggleSidebar}>
            <Menu className='w-4 h-4'/>
        </button>

        <div className={`flex flex-col w-full gap-3 justify-between md:justify-center 
            items-center content-center pt-8 ${isSidebarCollapsed? "px-5": "px-8"} 
            `}
            >
            {isLoading && <p>Cargando...</p>}
            {error && <p>Error al cargar la información</p>}

            {empresas?.map((empresa) => (

            <div className='flex flex-col items-center justify-center content-center'
                key={empresa.empresaId}  
                >
                <img 
                    src={empresa.imagen } 
                    alt="Logo Empresa" 
                    className='rounded-full w-24 mb-3'
                />
                <h1 
                    className={`${
                        isSidebarCollapsed ? "hidden" : "block"
                    } font-extrabold text-2xl`}>
                    {empresa.name}
                </h1>
            </div>  
           ))}    

        <div className='flex w-full items-center justify-center hover:text-purple-500 mt-6'>
            <Link href='/empresa' className='cursor-pointer text-sky-600 hover:text-purple-500'>
                <MonitorCog />                
            </Link>
        </div>
        </div>


        <div className='flex-grow  mt-6  space-y-32'>
            <SidebarLink
            href='/dashboard'
            icon={Layout}
            label='Dashboard'
            isCollapsed={isSidebarCollapsed}/>

            <SidebarLink
            href='/usuario'
            icon={User}
            label='Usuarios'
            isCollapsed={isSidebarCollapsed}/>

            <SidebarLink
            href='/espacio'
            icon={Map}
            label='Espacio'
            isCollapsed={isSidebarCollapsed}/>

            <SidebarLink
            href='/vehiculo'
            icon={Car}
            label='Vehiculo'
            isCollapsed={isSidebarCollapsed}/>

            <SidebarLink
            href='/cliente'
            icon={BookUser}
            label='Clientes'
            isCollapsed={isSidebarCollapsed}/>

            <SidebarLink
            href='/comprobante'
            icon={SquareKanban}
            label='Comprobante'
            isCollapsed={isSidebarCollapsed}/>

                <SidebarLink
            href='/'
            icon={LogOut}
            label='Cerrar'
            isCollapsed={isSidebarCollapsed}/>
            
        </div>
        
        <div className={`${isSidebarCollapsed? "hidden":"block"}mb-10`}>
            <p className='text-center text-xs text-gray-500'>@copy:2024 SISAWS</p>
        </div>
    </div>
  )
}