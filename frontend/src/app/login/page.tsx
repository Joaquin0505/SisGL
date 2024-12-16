'use client'
import React, { useState } from "react";
import { useLoginUserMutation } from "@/state/api";
import { useRouter } from "next/navigation";

  const LoginForm = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading, isError }] = useLoginUserMutation();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    try {
      const response = await loginUser({ email, password }).unwrap();
      localStorage.setItem("token", response.token);
      alert("Login exitoso");
      router.push("/dashboard")
      ;

    } catch (error: any) {
      console.error("Error de login:", error);
      if (error.status && error.data){
        
        alert ("error al inicar seccion : "+(error.data.message ||"verifica tus credenciales"));
      } else {
          console.error("error inesperado", error);
        alert("error al iniciar session verifica tu credenciales")
      }
    }
  };
  return (
    <section className="flex items-center justify-center min-h-[100vh] bg-cover bg-center" style={{
      backgroundImage: `url('/fondo.jpeg')`,
    }}>
      <div className="flex justify-center items-center h-[100vh] w-full">
        <div className="relative">
          <div className="relative w-[400px] min-h-[400px] rounded-[40px] bg-[#2e93e6] bg-opacity-45 backdrop-blur-[10px] text-black items-center py-3">
            <form
              className="flex flex-col items-center h-full p-5 mt-[10px] justify-center"
              onSubmit={handleLogin} >
                
              <img src="logo.png" alt="Logo"  className="w-[40%] h-[40%] border border-[#1246d6] rounded-[50%] mb-4" />
              <h1 className="text-[30px] font-semibold text-white">
                Iniciar Sesión
              </h1>
              <div className="flex items-center justify-center w-full mt-5">
                <input
                  type="email"
                  placeholder="Correo"
                  className="w-[70%] py-[10px] px-[20px] rounded-[50px] bg-[#fff] bg-opacity-20 border-t-2 border-l-2 outline-none text-[16px] tracking-[1px] text-[#221c1c] placeholder:text-[#fcfafa] placeholder:font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-center w-full mt-5">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-[70%] py-[10px] px-[20px] rounded-[50px] bg-[#fff] bg-opacity-20 border-t-2 border-l-2 outline-none text-[16px] tracking-[1px] text-[#221c1c] placeholder:text-[#fcfafa] placeholder:font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex w-full mt-5 items-center justify-center">
                
            
                <button
                  type="submit"
                  className="bg-sky-200 hover:bg-purple-500 hover:text-white text-[#252424] font-bold w-[120px] cursor-pointer rounded-2xl py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Cargando..." : "Ingresar"}
                </button>
                
                            
              </div>
              {isError && (
                <p className="mt-3 text-red-500">
                  Error al iniciar sesión. Verifica tus credenciales.
                </p>
              )}                
                
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
