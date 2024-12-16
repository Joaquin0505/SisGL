// src/app/garaje/BloqueC.tsx
'use client' 
import { FaTruckMoving } from 'react-icons/fa';

interface BloqueCProps {
  availableSpaces: { index: number, color: string, status:string }[];
  
}

const BloqueC = ({ availableSpaces }: BloqueCProps) => {
  return (
    <div className="flex justify-end items-end">
      <div className="">
        
        {/* Sección derecha del Bloque C */}
        <div className=" space-y-3">
          {availableSpaces.slice(19, 28).map(({ index, color , status}) => (
            <div 
              key={index} 
              className={`${color} w-14 h-14 text-center md:w-16 md:h-16 flex items-center hover:cursor-pointer 
             rounded-lg  text-xs px-6  transition-transform duration-200 hover:scale-105 justify-center text-white  lg:font-bold `} 
            >
             {index}  {status}
            </div>

          ))}

        </div>
        <h2 className="text-2xl font-semibold text-center ">Bloque C</h2>
      </div>
    </div>
  );
};

export default BloqueC;