import { useEffect, useState } from "react";

const STORAGE_KEY = "precosCorridas";

type Corrida = {
  id: string;
  dataHora: string;
  endereco: string;
};

type Dados = {
  motoboy: string;
  corridas: Corrida[];
  totalCorridas: number;
};

export default function HistoricoCorridas({
  nomeDoMotoboy,
  isPremium,
}: {
  nomeDoMotoboy: string;
  isPremium: boolean;
}) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [precos, setPrecos] = useState<{ [key: string]: string | number }>({});
  const [precoEditando, setPrecoEditando] = useState<{ id: string; preco: string | number } | null>(null);
  const [inputPreco, setInputPreco] = useState("");

  // Novos estados para filtro de datas premium
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");

  // Carregar preços do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPrecos(JSON.parse(stored));
    }
  }, []);

  // Salvar preço no estado e no localStorage
  const salvarPreco = (id: string, preco: string | number) => {
    const novosPrecos = { ...precos, [id]: preco };
    setPrecos(novosPrecos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosPrecos));
  };

  useEffect(() => {
    if (!nomeDoMotoboy) return;

    setLoading(true);
    setError(null);

    let url = `https://script.google.com/macros/s/AKfycbw2b6Cb7Xl76IKbe4iJZtBcE23QUPnWIzqrBAkRoaqT2jOK8cHkZAsrX1XSOP96vZZE/exec?nome=${encodeURIComponent(
      nomeDoMotoboy
    )}`;

    // Adiciona filtro de datas só para premium
    if (isPremium && dataInicio && dataFim) {
      url += `&dataInicio=${encodeURIComponent(dataInicio)}&dataFim=${encodeURIComponent(dataFim)}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((json) => {
        if (json.error) throw new Error(json.error);

        let corridasFiltradas = json.corridas;

        // Filtra corridas do dia para não-premium
        if (!isPremium) {
          const extrairData = (dataHoraStr: string) => dataHoraStr.split(" ")[0];
          const hoje = new Date();
          const dia = String(hoje.getDate()).padStart(2, "0");
          const mes = String(hoje.getMonth() + 1).padStart(2, "0");
          const ano = hoje.getFullYear();
          const dataHojeStr = `${dia}/${mes}/${ano}`;
          corridasFiltradas = json.corridas.filter(
            (c: Corrida) => extrairData(c.dataHora) === dataHojeStr
          );
        } else if (dataInicio && dataFim) {
          // Para premium, filtra entre as datas selecionadas
          const parseData = (str: string) => {
            const [data] = str.split(" ");
            const [d, m, a] = data.split("/");
            return new Date(Number(a), Number(m) - 1, Number(d));
          };

          const dtInicio = new Date(dataInicio);
          const dtFim = new Date(dataFim);

          corridasFiltradas = json.corridas.filter((c: Corrida) => {
            const dataCorrida = parseData(c.dataHora);
            return dataCorrida >= dtInicio && dataCorrida <= dtFim;
          });
        }

        const corridasComId = corridasFiltradas.map((c: Corrida, i: number) => ({
          id: `${i}-${c.dataHora.replace(/\D/g, "")}`,
          ...c,
        }));

        setDados({
          ...json,
          corridas: corridasComId,
          totalCorridas: corridasComId.length,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [nomeDoMotoboy, isPremium, dataInicio, dataFim]);

  if (loading)
    return <p className="text-center p-4 text-gray-600">Carregando corridas...</p>;
  if (error)
    return (
      <p className="text-center p-4 text-red-600 font-semibold">Erro: {error}</p>
    );
  if (!dados) return null;

  // Contagem dos endereços e bairros
  const contagemEnderecos: Record<string, number> = {};
  const contagemBairros: Record<string, number> = {};
  const contagemFaixaHoraria: Record<string, number> = {};

  dados.corridas.forEach(({ dataHora, endereco }) => {
    if (endereco) {
      contagemEnderecos[endereco] = (contagemEnderecos[endereco] || 0) + 1;

      const partes = endereco.split(",");
      const bairro =
        partes.length > 1 ? partes[partes.length - 1].trim() : "Desconhecido";
      contagemBairros[bairro] = (contagemBairros[bairro] || 0) + 1;
    }

    const horaStr = dataHora.split(" ")[1];
    if (horaStr) {
      const hora = parseInt(horaStr.split(":")[0], 10);
      const faixa = `${hora - (hora % 3)}h - ${hora - (hora % 3) + 2}h`;
      contagemFaixaHoraria[faixa] = (contagemFaixaHoraria[faixa] || 0) + 1;
    }
  });

  const maiorChave = (obj: Record<string, number>) => {
    let maiorValor = 0;
    let chaveMaior: string | null = null;
    for (const chave in obj) {
      if (obj[chave] > maiorValor) {
        maiorValor = obj[chave];
        chaveMaior = chave;
      }
    }
    return { chave: chaveMaior, valor: maiorValor };
  };

  const localMaisChamado = maiorChave(contagemEnderecos);
  const bairroMaisAtivo = maiorChave(contagemBairros);
  const faixaHorariaMaisCorridas = maiorChave(contagemFaixaHoraria);

  const corFundo = (qtd: number) => {
    if (qtd >= 5) return "bg-red-400 text-white";
    if (qtd >= 3) return "bg-yellow-300";
    if (qtd >= 1) return "bg-blue-200";
    return "";
  };

  const totalFinanceiro = Object.values(precos).reduce((acc: number, preco) => {
    const precoStr = preco as string | number;
    const precoNum = parseFloat(precoStr.toString().replace(",", "."));
    return acc + (isNaN(precoNum) ? 0 : precoNum);
  }, 0);

  // Modal para informar preço
  const abrirModalPreco = (id: string) => {
    setPrecoEditando({ id, preco: precos[id] || "" });
    setInputPreco(precos[id]?.toString() || "");
  };

  const confirmarPreco = () => {
    salvarPreco(precoEditando!.id, inputPreco);
    setPrecoEditando(null);
  };

  const cancelarModal = () => {
    setPrecoEditando(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        Corridas do Motoboy: {dados.motoboy}{" "}
        {!isPremium ? "(Hoje)" : "(Últimas corridas)"}
      </h2>

      {/* Inputs para filtro de datas só para premium */}
      {isPremium && (
        <div className="mb-4 flex gap-4 justify-center">
          <label>
            Data início:{" "}
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </label>

          <label>
            Data fim:{" "}
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </label>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-100 rounded-md text-gray-700 space-y-2">
        <p>
          <strong>Total de corridas {isPremium ? "disponíveis" : "hoje"}:</strong>{" "}
          {dados.totalCorridas}
        </p>
        <p>
          <strong>Horário com mais corridas:</strong>{" "}
          {faixaHorariaMaisCorridas.chave
            ? `${faixaHorariaMaisCorridas.chave} (${faixaHorariaMaisCorridas.valor} corrida${
                faixaHorariaMaisCorridas.valor > 1 ? "s" : ""
              })`
            : "N/D"}
        </p>
        <p>
          <strong>Local com mais chamadas:</strong>{" "}
          {localMaisChamado.chave
            ? `${localMaisChamado.chave} (${localMaisChamado.valor} chamada${
                localMaisChamado.valor > 1 ? "s" : ""
              })`
            : "N/D"}
        </p>
        <p>
          <strong>Bairro que mais pede mototáxi:</strong>{" "}
          {bairroMaisAtivo.chave
            ? `${bairroMaisAtivo.chave} (${bairroMaisAtivo.valor} chamada${
                bairroMaisAtivo.valor > 1 ? "s" : ""
              })`
            : "N/D"}
        </p>
        <p>
          <strong>Total financeiro informado:</strong>{" "}
          {totalFinanceiro.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      {!isPremium && (
        <p className="mb-4 text-center text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
          Você está no plano básico e visualiza apenas as corridas feitas no dia.
          Para acessar todas as corridas do mês, assine o plano Premium mensal.
        </p>
      )}

      {dados.corridas.length === 0 ? (
        <p className="text-center text-gray-500">
          Sem corridas {isPremium ? "encontradas." : "para hoje."}
        </p>
      ) : (
        <ul className="space-y-3">
          {dados.corridas.map(({ id, dataHora, endereco }) => {
            const qtd = contagemEnderecos[endereco] || 0;
            const precoSalvo = precos[id] || "";
            return (
              <li
                key={id}
                onClick={() => abrirModalPreco(id)}
                className={`cursor-pointer p-3 rounded-md flex justify-between items-center shadow-sm ${corFundo(
                  qtd
                )}`}
                title={`Clique para informar preço. Este local teve ${qtd} corrida(s) ${
                  isPremium ? "" : "hoje"
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{endereco}</div>
                  <div className="text-sm text-gray-700">{dataHora}</div>
                </div>
                <div className="text-sm font-semibold text-gray-800">
                  {precoSalvo ? `R$ ${precoSalvo}` : "Sem preço"}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal simples */}
      {precoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Informe o preço pago</h3>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2 mb-4"
              value={inputPreco}
              onChange={(e) => setInputPreco(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelarModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPreco}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-600 italic text-center">
        Locais com mais corridas {isPremium ? "" : "hoje"} são destacados em
        cores quentes.
      </p>
    </div>
  );
}
