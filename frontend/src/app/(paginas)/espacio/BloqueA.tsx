// src/app/garaje/BloqueA.tsx

interface BloqueAProps {
  availableSpaces: { espacioId: number, color: string, status:string }[];
 
}

const BloqueA = ({ availableSpaces }: BloqueAProps) => {
  return (
    <div className="flex justify-start items-center bg-slate-300p-2 m-2 border-slate-600 shadow-xl rounded-2xl  w-28">
      <div className=" items-center space-y-5 px-4">
        {/* Sección izquierda del Bloque A */}
        {availableSpaces.slice(0, 5).map(({ espacioId, color , status}) => (
          <div
            key={espacioId}
            className={`${color} w-20 h-20 flex items-center transition-transform duration-200 hover:scale-105
            justify-center text-white font-bold  text-center rounded-lg px-1  hover:cursor-pointer `}
            
          >
             {espacioId}   {status}
          </div>
        ))}
        <h2 className="text-2xl font-semibold text-center ">Bloque A</h2>
      </div>
      
    </div>
  );
};

export default BloqueA;