import { useState } from "react";
import { Mototaxista } from "@/types/mototaxi";

// Dados mockados para o MVP
const mototaxistasIniciais: Mototaxista[] = [
  {
    id: "1",
    nome: "Allysson",
    telefone: "7798861-9707",
    foto: "../assets/file.enc",
    ativo: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto:"/public/Mt01-Mto.png"
  },
  {
    id: "2",
    nome: "Renan",
    telefone: "7798861-9707",
    foto: "../assets/file.enc",
    ativo: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto:"/public/Mt01-Mto.png"
  },
  {
    id: "3",
    nome: "Patrick",
    telefone: "7798861-9707",
    foto: "../assets/file.enc",
    ativo: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto:"/public/Mt01-Mto.png"
  },
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