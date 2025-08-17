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

  // Busca os mototaxistas do Google Sheets ao carregar
  useEffect(() => {
    (async () => {
      const dados = await buscarPedidosDoGoogleSheets();
      // transforma os dados para o formato do Mototaxista e marca como ativo
      const lista = dados.map((item: any) => ({
        id: item.ID || item.idCorrida || "", // ajusta conforme sua coluna
        nome: item.Nome || "",
        foto: item.foto || "",
        tipoVeiculo: item.tipoVeiculo || "",
        modelo: item.Modelo || "",
        detalhes_foto: item.detalhes_foto || "",
        Grupo: item.Grupo || "",
        telefone: item.Telefone || "",
        ponto: item.Ponto || "",
        ativo: item.Status === "Ativo", // só ativa se Status = Ativo
      }));
      setMototaxistas(lista);
    })();
  }, []);

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
  const quantidadeAtivos = mototaxistas.filter(m => m.tipoVeiculo == 'moto').length;

  return {
    mototaxistas,
    mototaxistasAtivos,
    quantidadeAtivos,
    toggleStatus
  };
};