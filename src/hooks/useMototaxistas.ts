// import { useState } from "react";
// import { Mototaxista } from "@/types/mototaxi";
// import { mototaxistasIniciais } from "@/utils/mototaxistas";

// export const useMototaxistas = () => {
//   const [mototaxistas, setMototaxistas] = useState<Mototaxista[]>(mototaxistasIniciais);

//   const toggleStatus = (id: string) => {
//     setMototaxistas(prev => 
//       prev.map(mototaxista => 
//         mototaxista.id === id 
//           ? { ...mototaxista, ativo: !mototaxista.ativo }
//           : mototaxista
//       )
//     );
//   };

//   const mototaxistasAtivos = mototaxistas.filter(m => m.ativo);
//   const quantidadeAtivos = mototaxistasAtivos.length;

//   return {
//     mototaxistas,
//     mototaxistasAtivos,
//     quantidadeAtivos,
//     toggleStatus
//   };
// };
import { useState, useEffect } from "react";
import { buscarPedidosDoGoogleSheets } from "./useBuscarTaxis";
import { Mototaxista } from "@/types/mototaxi";

export const useMototaxistas = () => {
  const [mototaxistas, setMototaxistas] = useState<Mototaxista[]>([]);
  const [loadingMoto, setLoading] = useState(false); // estado de loading

  const buscarMototaxistas = async () => {
    setLoading(true); // inicia loading
    try {
      const dados = await buscarPedidosDoGoogleSheets();
      const lista = dados.map((item: any) => ({
        id: item.ID || item.idCorrida || "",
        nome: item.Nome || "",
        foto: item.foto || "",
        tipoVeiculo: item.tipoVeiculo || "",
        modelo: item.Modelo || "",
        detalhes_foto: item.detalhes_foto || "",
        Grupo: item.Grupo || "",
        telefone: item.Telefone || "",
        ponto: item.Ponto || "",
        status: item.Status,
        ativo: item.ativo,
      }));
      setMototaxistas(lista);
    } catch (err) {
      console.error("Erro ao atualizar mototaxistas:", err);
    } finally {
      setLoading(false); // termina loading
    }
  };

  useEffect(() => {
    buscarMototaxistas();
  }, []);

  const toggleStatus = (id: string) => {
    setMototaxistas(prev =>
      prev.map(m => (m.id === id ? { ...m, ativo: !m.ativo } : m))
    );
  };

  return {
    mototaxistas,
    mototaxistasAtivos: mototaxistas.filter(m => m.status),
    quantidadeAtivos: mototaxistas.filter(m => m.tipoVeiculo === "moto").length,
    toggleStatus,
    atualizarMototaxistas: buscarMototaxistas,
    loadingMoto, // ✅ exposto
  };
};