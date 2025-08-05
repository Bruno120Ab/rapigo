import { useState, useEffect } from "react";

export interface EnderecoPadrao {
  id: string;
  nome: string;
  endereco: string;
  coordenadas?: { lat: number; lng: number };
}

export const useEnderecosPadrao = () => {
  const [enderecos, setEnderecos] = useState<EnderecoPadrao[]>([]);

  useEffect(() => {
    const enderecosSalvos = localStorage.getItem("enderecos-padrao");
    if (enderecosSalvos) {
      setEnderecos(JSON.parse(enderecosSalvos));
    }
  }, []);

  const adicionarEndereco = (endereco: Omit<EnderecoPadrao, 'id'>) => {
    const novoEndereco: EnderecoPadrao = {
      ...endereco,
      id: Date.now().toString()
    };
    const novosEnderecos = [...enderecos, novoEndereco];
    setEnderecos(novosEnderecos);
    localStorage.setItem("enderecos-padrao", JSON.stringify(novosEnderecos));
  };

  const removerEndereco = (id: string) => {
    const novosEnderecos = enderecos.filter(e => e.id !== id);
    setEnderecos(novosEnderecos);
    localStorage.setItem("enderecos-padrao", JSON.stringify(novosEnderecos));
  };

  return {
    enderecos,
    adicionarEndereco,
    removerEndereco
  };
};