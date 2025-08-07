import { Mototaxista } from "@/types/mototaxi";

// Dados centralizados dos mototaxistas - fonte única da verdade
// Esta é a mesma lista que está em useMototaxistas.ts
export const mototaxistasIniciais: Mototaxista[] = [
  {
    id: "1",
    nome: "Allysson",
    telefone: "7798861-9707",
    foto: "../assets/file.enc",
    ativo: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto: "/public/Mt01-Mto.png"
  },
  {
    id: "2",
    nome: "Renan",
    telefone: "7798861-9707",
    foto: "../assets/file.enc",
    ativo: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto: "/public/Mt01-Mto.png"
  },
  {
    id: "3",
    nome: "Patrick",
    telefone: "7798861-9707",
    foto: "../assets/file.enc",
    ativo: true,
    tipoVeiculo: "moto",
    detalhes: "Twister 160",
    detalhes_foto: "/public/Mt01-Mto.png"
  }
];

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
  console.log("Mototaxista salvo no localStorage:", mototaxista.nome);
};