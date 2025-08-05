import { useState, useEffect } from "react";
import { Mototaxista } from "@/types/mototaxi";

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Mototaxista[]>([]);

  useEffect(() => {
    const favoritosSalvos = localStorage.getItem("motoboys-favoritos");
    if (favoritosSalvos) {
      setFavoritos(JSON.parse(favoritosSalvos));
    }
  }, []);

  const adicionarFavorito = (mototaxista: Mototaxista) => {
    if (favoritos.length >= 3) return false;
    if (favoritos.find(f => f.id === mototaxista.id)) return false;
    
    const novosFavoritos = [...favoritos, mototaxista];
    setFavoritos(novosFavoritos);
    localStorage.setItem("motoboys-favoritos", JSON.stringify(novosFavoritos));
    return true;
  };

  const removerFavorito = (id: string) => {
    const novosFavoritos = favoritos.filter(f => f.id !== id);
    setFavoritos(novosFavoritos);
    localStorage.setItem("motoboys-favoritos", JSON.stringify(novosFavoritos));
  };

  const isFavorito = (id: string) => {
    return favoritos.some(f => f.id === id);
  };

  return {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito
  };
};