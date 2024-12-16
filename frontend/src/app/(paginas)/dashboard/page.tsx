'use client'
import { CardParkingSummary } from "./CardParkingSummary";
import { CardComprobantesRecientes } from "./CardComprobantesRecientes";
import { CardVehiculosFrecuentes } from "./CardVehiculosFrecuentes";

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 ml-6 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardParkingSummary />  
      <CardVehiculosFrecuentes/>  
      <CardComprobantesRecientes/>         
      </div>
      
      
    </>
  );
}