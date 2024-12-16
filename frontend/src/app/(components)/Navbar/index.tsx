'use client'

import { setIsDarkMode,setIsSidebarCollapsed } from '@/state'
import { useAppDispatch, useAppSelector } from '@/app/redux'

import { Bell, Menu, Moon, Settings, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
    const dispatch =useAppDispatch();
    const isSidebarCollapsed= useAppSelector(
        (state)=>state.global.isSidebarCoolapsed
    )
    const isDarkMode = useAppSelector((state)=>state.global.isDarkMode)
    const userName =useAppSelector((state)=>state.global);
    const toggleSidebar =()=>{
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };
    const toggleDarkMode=()=>{
        dispatch(setIsDarkMode(!isDarkMode));

    };
 
  return (
    <div className='flex justify-between items-center w-full mb-7 '>
        <div className='flex justify-between items-center gap-5'>
            <button className='px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100' 
            onClick={toggleSidebar}>
                <Menu className='w-4 h-4' />
            </button>
        </div>
        
        <div className='flex justify-between items-center gap-5'>
            <div className='hidden md:flex justify-between items-center gap-5'>
                <div>
                    <button onClick={toggleDarkMode}>
                        {isDarkMode ? (
                            <Sun className='cursor-pointer text-gray-500' size={24}/>
                        ):(
                        <Moon className='cursor-pointer text-gray-500' size={24}/>
                        )
                        }
                        
                    </button>
                </div>
                
                <hr className='w-0 h-7 border border-solid border-l border-gray-300 mx-3' />
                <div className='flex items-center gap-3 cursor-pointer'>
                    <Image src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAogMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAABwEFBgQDAv/EAD4QAAEDAwIDBAcFBwMFAAAAAAEAAgMEBREGBxIhMRNBUWEiIzJxgZGhFUKCscEIFBYkUnLRFzNzQ2KDwtL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuKIiAiIgIiICLGV47ldrfaoe1uVZBSsxnMrw1B7UU7u28ukLfxNhqKiteO6miyD8SQFz0+/1saf5exVjx4yTtb+WUFlRReP9oChLvWWCpDfFtS0n8luLZvhpaqdw1UVfRnxkiDm/NpP5IKgi01l1VYr4B9lXOmqHH7jXji+R5rcZQZREQEREBERAREQEREBERAPRa2+3y32CgfW3WpZTwNHV3U+QHUnyWo13rSg0dazVVfraiTIp6ZpHFI79AO8qV6f0pft0biL/AKqqJKe1F2YYWkjjb4MHcP8Au6lB7LpufqPVtc+2aCtkzGdDUubl+D3+DB9V9bTstW3GcV2tL1NUTO5uiheXHPgXu/QKt2Sy26yUDKK10kVNA0ezG3HEfEnvPmthgeCDkrVtrpC2Nb2Nmp5XD79QO0P1XRU9rt9M0Np6GliaO5kLR+QXsRB55KGjkbwyUsDh4OjBWluWhdLXMEVdjoiT95kQY75jC6JEEhv2x1rmd22na+e3ztOWteTIz59R81o2ah3A21kZDqCnddLU0gCZzy8Y8n9R+JXkgFfOeCKeJ8U8bJI3jDmPGWuHmCg53RuubNq6n4rbMWVDR6yml5SM/wAjzC6YHKjWuNqpqGc37Qsj6WrhPGaSN3D05+r/APnot1tjuW3UZ+yL0BTXmL0eYwJ8dcDucO8IKYiwOgWUBERAREQEREBabVd/o9M2Wpulc70Im+iwdXuPRoW4JwoNrern3H3JptLUEh+zaJ5Ez2nkSP8Acd8PZHmgaG05W7kail1ZqfLrcyTEEB9l+OjAO5o7/Eq7RRtiY1jGhrGjDWgcgF8LZb6a10MFDRRiKmgYGRsb0AC9aAiL8lwbnJwAMkoM5CZClms936W3VhtmmaY3Sv4uDjb/ALbXeAxzcfcufZRbw6kAndW/ZkTubWGQQ8vc0F3zQXTKxkeKh38M7v2odtT30Vhbz7MVfaZ+D2heiz7uXazV7Lbry1SU7uhqI2YI8y3oR7kFqReW33CkuVFFWUM7J6eUZZIw5DgvUgw5Sndvb59e06j060w3am9ZK2I8JlA+8CPvD6qrrBGUHB7U65Zq60mGsIbdKQATt6doO54H5+BXeqCbg2+XbfXVFqizRltBVvPbRMOBxffZ8RzHmFcbdXQXGip6ykeJIKiMSRuHe0jIQepERAREQEREHObg30ac0lcLn/1WR8EP/I70W/UridgbF+7WGe/VTSaq4yHhe4c+zB/V2SvL+0VXSOt9ns0Djx1NQZC0fewOEfVyqWnbbHaLDb7fEMNpqdkfyHNBsUREGCcKRb0atrhUU+ktPOkNfWYE5i9oA9GA+fPPkq484HETgAZUN2kiGp9x77qOqHafu7iYc8+EvJDce5oQd5t3t9b9I0UckkbJ7q9o7apcM8J/pZnoF2/CEx0WUGCAVptT6btepbe+hutM2VhHoPA9OM+LT3LdLGEEE0tX3Ha7XJ05dpnyWaseOykdzaOI+i8eHM4KvYOcY6FS7f8As8dXpFt0az+YoJmkPHXgccH6kFdbtzdHXnRVorpHcUjqcNefFzfRP1CDpUREHOa+sEepdL11uczMro+OA49mRvNuPy+K4n9n2/PrrDVWWpLu3tr/AEA7qI3Hp8CD9FWCMqG6ZZ/DG/NwoGngp6/tOFvcePDx9QUFzREQEREBYKyhQRHdX+f3Z0xQu5hnZux735/9VbgojuD6re/Tkj+TSyLB/E5W5AREQfOoaXwSMHVzCB8lFf2cHiCXUVBIMTMfE458uMH6q2nPcoLXynbPd19ZM0stF0yS4dA1x9I/hdz+KC9Dosr8RSxzRtkieHscAWuacgg96/aAiLBOEHD701DKfbe7ceMydnG0eZkasbKQPp9t7UJBzf2rx7jI4hcTvPe36lv9v0VZXdtJ27TOWc8PPRvwGSVYrJborRaqS3U4AipoWxtx5BB7kREBRDccCg3n03Wt5GXsmk+PpFv6q3qI7uet3T0rGzm4OjyP/IEFtHVZWAsoCIiAsFZRBEt9mutuqtM3ocmRvw539rgfyyrVC9ssLJGnLXtDgfep1v1Zjc9DvqomF0tvmbPy/o9l30OfgtvtRfBfNDW2Zzi6aCP93m8eJnLPxGCg7FEWCgyua13pKi1hZ3UVYeCVmXU8w6xu/wAHwXt1HqS16boHVt3qmwxjk1vVzz4NHUlSOt3F1lrSrko9DWySnpweF1Rwgvx4lx9Fvu6oPLYtW6h2wrBY9WUktRbQfUSA8w3xY77zfLqFU7PuNpO7xtdT3qlicRzjqH9k4fB36KdU+zd9vL21Gq9SPdKefAwmQt8ebuX0WzZsLYQ0B91uLj4jgH6IO9r9baYt8Rkqr7b2gdzZw5x9wGSVNNWbuzXd/wBkaEpZ5qqf0G1JZ6X4G+Pmei2H+g1gHS53IH3s/wALwVexbqUiaxainhqG82GVuD824QdDtZt4dONdd707tb3UAlxLuLsQ7qM+J7yqSoK+77l7ev4rtEbta2Hm93rG4/vHpN+PJUvRO4Vm1fCG0svYVzRl9JLycPd/UPcg69FgHKygKH31323+0BQU0Z4mUIZx+XC0uP5hWmtqo6KlmqZ3cEULC97vAAZKimyEMt/1pf8AVdSx2CXNjJ6B0js4+DQB8UFxCyiICIiAiIg89fSxVtJNS1DeKGZhZI094IwohtlXTaH3AuGj7m7hpqmX1D39OPqwj+5vL3q7qXb16Olu1BHfrQ1wuduw49mPSewHPLzHX5oKhlaPWWpqLStjmudc7PDyiiBHFK/uaFodq9bx6ssgjqpGtu1KA2ojzguHc8DwKnt+dPuhui20QyO+xbc7D3MJxwtPpu8Mk8h5BB+dMaXu+6V2dqLVUk0dra7EMTMt4xn2WeDfF3f8Fc7XbqO10UdJb6aOngjGGsjZwhfWhpoaOmjpqWNsUMTQ1jGjAAC+6AiIgIiIPy9jXscx7Q5pGC0jIKju4m174JHai0WJaavgPavpoeXER1dGO4+Xf8VZFh3slBP9qdft1ZRPo7jwxXilGJWdO1b04gPzCoGfNQndWz1GitV0Ws7C0xxSyj94Y0HhD+8HH3XD6qqVesLVR6TZqOecCjfCJIxxc3uI9keJzyQcbvxqg22yR2OidxVty5Paz2mxZ5/EnA+a6rbXTf8AC+k6Khe3FS5va1P/ACO5kfDoprttaK/Xer59ZagYf3aB/wDLRuHIuHQDPUN/NXVAREQEREBERAWC3OQeYPcVlEEM3I0VcdLXWTVujnSRM5uqIYhnss8nEDvae8dy9f7Oj7c2hueaqJ11mmy+In0+zAGCPHmSrM5jS0hwBBByD3qQ652qmjrjftDyupK5ruM0rHcILuvoHuJ8OiCvN6L9KMaX3hnoJ/sjXVFLSVUZDTUiMg/jYfzHJVm2Xagu1O2otlZBVQu58UTw7Hy6IPciDoiAiIgLB6c18p6iOnjMk8jIo2jJe9wAHxKm2sN47PaOOlseLrXH0W9mfVNPm4dfcEG93XdbToW5xXWpjhbJE7sS88zKObQB3nKiGg9NXvXgo7bUVE0dhtzjmQey3iOS1vi4/QLqbJobUu4NyZedbzz0tF7UdPjhcW9cNb9we/mrZa7dR2uhiorfTsgpoRwsjYMAIM2y30tsoIaKgibDTwtDWMaOgC9aIgIiICIiAiIgIiICYREGk1Hpazakg7G70Mc3LDZMYez3O6qXV+zFztVUazRl/lgf1EcpLHeQ4m9fiFbEQQ37b3e04OGrtv2lEz74h7XPxYQfov1/rRqOlw24aQcH9/OSP6FpVvwmOXNBEP8AW+9S+jT6Rdx93rXu+gYsfxtulfSWWvTpo2HkHmlcMfiecK4YwgCCHN2w1rqiVsur7+Yoc5MTXdpj3NGGhUHSW3GndLhklJS/vFWOtTUgOdny7h8F2KIMYWURAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH/9k="
                    alt='Usuario'
                    width={50}
                    height={50}
                    className='rounded-full h-full  object-cover'/>
                    <span className='font-semibold'>Usuario</span>
                </div>
                
            </div>
            <Link href="/settings">
            <Settings className='cursor-pointer text-gray-500' size={24}/>
            </Link>
        </div>

    </div>
  )
}
