// src/app/garaje/BloqueB.tsx
import { FaCarSide, FaTruckPickup } from 'react-icons/fa';

interface BloqueBProps {
  availableSpaces: { index: number, color: string, status:string  }[];
  
}

const BloqueB = ({ availableSpaces }: BloqueBProps) => {
  return (
    <div className="flex justify-evenly  bg-slate-300 hover:cursor-pointer  p-2 m-2 border-slate-600 shadow-xl rounded-2xl ">
      <div className="">
        <h2 className="text-2xl font-semibold text-center">Bloque B </h2>
        {/* Sección central del Bloque B */}
        <div className="flex  justify-evenly gap-1 md:gap-2 lg:gap-5">
          {availableSpaces.slice(5, 19).map(({ index, color,status }, i) => (
            <div 
              key={index} 
              className={`${color} w-7 h-7  text-center flex md:w-10 md:h-10 lg:w-16 xl:16 lg:h-16 justify-center items-center  transition-transform duration-200 hover:scale-105
               hover:cursor-pointer  text-xs py-2  text-white lg:font-bold rounded-lg `} 
              
            >
             {index} {status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloqueB;