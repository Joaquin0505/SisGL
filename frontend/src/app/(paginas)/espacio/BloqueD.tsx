// src/app/garaje/BloqueD.tsx
import { FaTruckMoving } from 'react-icons/fa';

interface BloqueDProps {
  availableSpaces: { index: number, color: string , status: string}[];
 
}

const BloqueD = ({ availableSpaces }: BloqueDProps) => {
  return (
    <>
    <div className="flex p-4 bg-gray-100 space-x-2 justify-around rounded-lg shadow-md ">
        <div className='flex justify-around gap-x-6 '>
            <div className="md:w-48 lg:w-72 w-20 h-16  text-sm  bg-gray-500 flex items-center justify-center text-white 
            font-bold rounded-lg shadow-lg">
                Administración
            </div>

            {/* Puerta */}
            <div className=" md:w-48 lg:w-72  w-28 h-16 bg-yellow-500 flex items-center justify-center text-white font-bold rounded-lg shadow-lg">
                Puerta
            </div>
        </div>
        <div className='flex justify-between  gap-5'>
            {availableSpaces.slice(28, 31).map(({ index, color, status }) => (
                <div 
                key={index} 
                className={`${color} w-10 h-10 md:w-20 md:h-20 flex items-center  text-center hover:cursor-pointer  justify-center text-white font-bold
                 rounded-lg transition-transform duration-200 hover:scale-105`} 
               
                >
                 {index} {status}
                </div>
            ))}
        <div className="col-span-1"></div>      
    </div>    
    </div>
    <h2 className="col-span-3 text-2xl font-semibold text-center mb-4">Bloque D</h2>
    </>
  );
};

export default BloqueD;