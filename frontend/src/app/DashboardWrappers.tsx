'use client'

import React, { useEffect } from 'react'
import {Navbar} from './(components)/Navbar'
import StoreProvider, { useAppSelector } from './redux'
import { Sidebar } from './(components)/Sidebar'

const DashboarLayout = ({children}:{children:React.ReactNode}) => {
  const isSiderbarCollapsed = useAppSelector(
    (state)=>state.global.isSidebarCoolapsed
  )
  const isDarkMode =useAppSelector((state)=>state.global.isDarkMode);
  useEffect(()=>{
    if (isDarkMode){
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.add("light")
    }
  })
  return (
    <div className={`${isDarkMode ? "dark":"light"} flex bg-gray-50 
    text-gray-900 w-full min-h-screen`}>
        <Sidebar/>
        <main className={`flex flex-col w-full h-full py-7 px-7 bg-gray-50
        ${isSiderbarCollapsed? "md:pl-24 ":"md:pl-72"}
             md:pl-24`}>
              <Navbar/>
            {children}
        </main>
    </div>
  )
}
export const DashboardWrappers = ({children}:{children:React.ReactNode}) => {
  return (
    <StoreProvider>
      <DashboarLayout>{children}</DashboarLayout>
    </StoreProvider>
  )
}