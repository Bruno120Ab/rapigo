import { useEffect, useState } from "react";

export default function HistoricoCorridas({ nomeDoMotoboy }) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 useEffect(() => {
  if (!nomeDoMotoboy) return;

  setLoading(true);
  setError(null);

  const url = `https://script.google.com/macros/s/AKfycbw2b6Cb7Xl76IKbe4iJZtBcE23QUPnWIzqrBAkRoaqT2jOK8cHkZAsrX1XSOP96vZZE/exec?nome=${encodeURIComponent(nomeDoMotoboy)}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
    .then((json) => {
      if (json.error) throw new Error(json.error);
      
      // Aqui cria IDs únicos para cada corrida
      const corridasComId = json.corridas.map((c, i) => ({
        id: `${i}-${c.dataHora.replace(/\D/g, '')}`, // ex: "0-07082025173610"
        ...c
      }));

      setDados({
        ...json,
        corridas: corridasComId
      });
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, [nomeDoMotoboy]);


  if (loading)
    return (
      <p className="text-center p-4 text-gray-600">Carregando corridas...</p>
    );
  if (error)
    return (
      <p className="text-center p-4 text-red-600 font-semibold">
        Erro: {error}
      </p>
    );
  if (!dados) return null;

  // Conta quantas vezes cada endereço aparece
  const contagemEnderecos = {};
  dados.corridas.forEach(({ endereco }) => {
    if (endereco) {
      contagemEnderecos[endereco] = (contagemEnderecos[endereco] || 0) + 1;
    }
  });

  // Função pra definir cor de fundo conforme frequência
  const corFundo = (qtd) => {
    if (qtd >= 5) return "bg-red-400 text-white";
    if (qtd >= 3) return "bg-yellow-300";
    if (qtd >= 1) return "bg-blue-200";
    return "";
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        Corridas do Motoboy: {dados.motoboy}
      </h2>
      <p className="mb-6 text-gray-700 font-medium">
        Total de corridas:{" "}
        <span className="font-bold">{dados.totalCorridas}</span>
      </p>
      {dados.corridas.length === 0 ? (
        <p className="text-center text-gray-500">Sem corridas encontradas.</p>
      ) : (
        <ul className="space-y-3">
          {dados.corridas.map(({ dataHora, endereco }, i) => {
            const qtd = contagemEnderecos[endereco] || 0;
            return (
              <li
                key={i}
                className={`p-3 rounded-md flex justify-between items-center shadow-sm ${corFundo(
                  qtd
                )}`}
                title={`Este local teve ${qtd} corrida(s)`}
              >
                <span className="font-medium text-gray-900">{endereco}</span>
                <span className="text-sm text-gray-700">{dataHora}</span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-sm text-gray-600 italic text-center">
        Locais com mais corridas são destacados em cores quentes.
      </p>
    </div>
  );
}
