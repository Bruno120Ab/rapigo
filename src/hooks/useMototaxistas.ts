import { useState } from "react";
import { Mototaxista } from "@/types/mototaxi";

// Dados mockados para o MVP
const mototaxistasIniciais: Mototaxista[] = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "(11) 99999-1111",
    foto: "/placeholder.svg",
    ativo: true
  },
  {
    id: "2", 
    nome: "Maria Santos",
    telefone: "(11) 99999-2222",
    foto: "/placeholder.svg",
    ativo: true
  },
  {
    id: "3",
    nome: "Pedro Costa",
    telefone: "(11) 99999-3333", 
    foto: "/placeholder.svg",
    ativo: false
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    telefone: "(11) 99999-4444",
    foto: "/placeholder.svg",
    ativo: true
  }
];

export const useMototaxistas = () => {
  const [mototaxistas, setMototaxistas] = useState<Mototaxista[]>(mototaxistasIniciais);

  const toggleStatus = (id: string) => {
    setMototaxistas(prev => 
      prev.map(mototaxista => 
        mototaxista.id === id 
          ? { ...mototaxista, ativo: !mototaxista.ativo }
          : mototaxista
      )
    );
  };

  const mototaxistasAtivos = mototaxistas.filter(m => m.ativo);
  const quantidadeAtivos = mototaxistasAtivos.length;

  return {
    mototaxistas,
    mototaxistasAtivos,
    quantidadeAtivos,
    toggleStatus
  };
};