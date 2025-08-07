import { useState } from "react";
import { Mototaxista } from "@/types/mototaxi";
import { mototaxistasIniciais } from "@/utils/mototaxistas";

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