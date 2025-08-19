import { useMototaxistas } from "@/hooks/useMototaxistas";
import { Mototaxista } from "@/types/mototaxi";

// Dados centralizados dos mototaxistas - fonte única da verdade
// Esta é a mesma lista que está em useMototaxistas.ts
export const mototaxistasIniciais: Mototaxista[] = [
  {
    id: "t57c73ywswi",
    nome: "Allysson",
    telefone: "7798861-9707",
    foto: "/assets/file.enc",
    status: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto: "/Mt01-Mto.png",
    ponto: '-15.243889, -40.619893',
    Grupo: 'SOS',
    ativo: true
    
  }
];

// export const mototaxistasIniciais: Mototaxista[] = ativos
/**
 * Busca um mototaxista pelo nome
 * @param nome Nome do mototaxista
 * @returns Mototaxista encontrado ou null
 */
export const buscarMototaxistaPorNome = (nome: string): Mototaxista | null => {
  return mototaxistasIniciais.find(m => m.nome === nome) || null;
};

/**
 * Salva os dados do mototaxista no localStorage para uso na confirmação
 * @param mototaxista Dados do mototaxista
 */
export const salvarMototaxistaNoLocalStorage = (mototaxista: Mototaxista): void => {
  localStorage.setItem("mototaxista", JSON.stringify(mototaxista));
};