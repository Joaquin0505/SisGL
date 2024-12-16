'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/dashboard'); // Redirige al login si no está autenticado
    }
  }, [router]);

  return {children}; 
}