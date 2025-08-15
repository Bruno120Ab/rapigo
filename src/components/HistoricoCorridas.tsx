import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "precosCorridas";

type Corrida = {
  id: string;
  dataHora: string;
  endereco: string;
  comentario: string;
  avaliacao: number;
  tipo: string;
  corrida: string;
  nome:string;
};

type Dados = {
  motoboy: string;
  corridas: Corrida[];
  totalCorridas: number;
  avaliacaoMedia: number;
};

export default function HistoricoCorridas({
  idMoto,
  isPremium,
}: {
  idMoto: string;
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

  // Hooks adicionais no topo do componente
  const [painel_horaInicio, setPainel_horaInicio] = useState<string>("");
  const [painel_horaFim, setPainel_horaFim] = useState<string>("");
  const [painel_despesas, setPainel_despesas] = useState<number>(0);
  const [painel_metaGanho, setPainel_metaGanho] = useState<number | "">("");
  const [painel_corridas, setPainel_corridas] = useState<{ id: number; valor: number }[]>([]);
  const [painel_novoValor, setPainel_novoValor] = useState<number>(0);
  const painel_adicionarCorrida = () => {
    setPainel_corridas([...painel_corridas, { id: Date.now(), valor: painel_novoValor }]);
    setPainel_novoValor(0);
  };

  // Calcula total ganho
  const painel_totalCorridas = painel_corridas.reduce((acc, c) => acc + c.valor, 0);
  const painel_ganhoLiquido = painel_totalCorridas - painel_despesas;

  // Calcula porcentagem da meta
  const painel_metaPorcentagem =
    painel_metaGanho && painel_metaGanho > 0
      ? Math.min((painel_ganhoLiquido / Number(painel_metaGanho)) * 100, 100)
      : 0;

  // Calcula horas trabalhadas
  const painel_horasTrabalhadas =
    painel_horaInicio && painel_horaFim
      ? (new Date(`1970-01-01T${painel_horaFim}:00`).getTime() -
          new Date(`1970-01-01T${painel_horaInicio}:00`).getTime()) /
        1000 /
        60 /
        60
      : 0;

  const painel_ganhoPorHora = painel_horasTrabalhadas > 0 ? painel_ganhoLiquido / painel_horasTrabalhadas : 0;

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
    if (!idMoto) return;
    console.log(idMoto)

    setLoading(true);
    setError(null);
     let url = `https://script.google.com/macros/s/AKfycbzClSWg9RpR-Ya6TZT-GmkjmrAURjmXCb_yOLlxT64gBNZ01DTkjts7H0HKGfBHoZaM/exec?type=run&id=${encodeURIComponent(
      idMoto
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
  }, [idMoto, isPremium, dataInicio, dataFim]);

  if (loading)
    return <p className="text-center p-4 text-gray-600">Carregando corridas...</p>;
  if (error)
    return (
      <p className="text-center p-4 text-red-600 font-semibold">Erro: {error}</p>
    );
  if (!dados) return null;

  console.log(dados)


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

const totalFinanceiro = dados.corridas.reduce((acc, corrida) => {
  const precoStr = precos[corrida.id]?.toString() || "0";
  const precoNum = parseFloat(precoStr.replace(",", "."));
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg ">
      <h2 className="text-lg font-bold mb-4">Painel do Motoboy</h2>
        {!isPremium && (
        <p className="mb-4 text-center text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
          Você está no plano básico e visualiza apenas as corridas feitas no dia.
          Para acessar todas as corridas do mês, assine o plano Premium mensal.
        </p>
      )}

      {/* Inputs para filtro de datas só para premium */}
      {isPremium && (
        <>
        <div className="mb-4 flex gap-4 justify-center flex-col">
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
        <div className="flex gap-4 mb-4">
          
        <label className="flex flex-col">
          Início:
          <input
            type="time"
            value={painel_horaInicio}
            onChange={(e) => setPainel_horaInicio(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col">
          Fim:
          <input
            type="time"
            value={painel_horaFim}
            onChange={(e) => setPainel_horaFim(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
      </div>
      </>
      )}

    
   <div className="grid grid-cols-2 gap-1 mb-5">

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                Horarios com mais corrida
              </p>
              <p className="text-xs text-muted-foreground">
                    {faixaHorariaMaisCorridas.chave
                ? `${faixaHorariaMaisCorridas.chave} (${faixaHorariaMaisCorridas.valor} corrida${
                    faixaHorariaMaisCorridas.valor > 1 ? "s" : ""
                  })`
                : "N/D"}          
              </p>
            </div>
           
          </div>
           <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                  Avaliação
              </p>
              <p className="text-xs text-muted-foreground">
                   <strong>Avaliação Média {isPremium ? "disponíveis" : "hoje"}:</strong>{" "}
                   {dados.avaliacaoMedia}        
              </p>
            </div>
          </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                  Horas trabalhadas
              </p>
              <p className="text-xs text-muted-foreground">
                   Horas trabalhadas: {painel_horasTrabalhadas.toFixed(2)}h     
              </p>
            </div>
          </div>
           <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                  Quantidade de Corridas
              </p>
              <p className="text-xs text-muted-foreground">
                   <strong>Total de corridas {isPremium ? "disponíveis" : "hoje"}:</strong>{" "}
                   {dados.totalCorridas}        
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                  Receita Total
              </p>
              <p className="text-xs text-muted-foreground">
                    {totalFinanceiro.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) }       
              </p>
            </div>
          </div>
           <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                  Lucro Liquido
              </p>
             
              <p className="text-xs text-muted-foreground">
                    {(totalFinanceiro - painel_despesas).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) }       
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
                  Despesas( ex. gasolina )
              </p>
              <input
            type="number"
            min="0"
            step="0.01"
            value={painel_despesas}
            onChange={(e) => setPainel_despesas(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
            </div>
          </div>
          {/* <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
               Top pedidos
              </p>
              <p className="text-xs text-muted-foreground">
            {bairroMaisAtivo.chave
              ? `${bairroMaisAtivo.chave} (${bairroMaisAtivo.valor} chamada${
                  bairroMaisAtivo.valor > 1 ? "s" : ""
                })`
              : "N/D"}   
              </p>
            </div>
          </div> */}
          {/* <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">
               Locais que mais pede
              </p>
              <p className="text-xs text-muted-foreground">
               {localMaisChamado.chave
            ? `${localMaisChamado.chave} (${localMaisChamado.valor} chamada${
                localMaisChamado.valor > 1 ? "s" : ""
              })`
            : "N/D"}
              </p>
            </div>
          </div> */}
           <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div>
            <p className="font-medium">
              Ticket médio
            </p>
            <p className="text-xs text-muted-foreground">
              {(
                Number(totalFinanceiro) / (dados.totalCorridas || 1)
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            </div>
          </div>
          
    </div>



      {dados.corridas.length === 0 ? (
        <p className="text-center text-gray-500">
          Sem corridas {isPremium ? "encontradas." : "para hoje."}
        </p>
      ) : (
        <ul className="space-y-3">
         {dados.corridas.map(({ id, dataHora, endereco, comentario,corrida, nome, avaliacao, tipo }) => {
  const qtd = contagemEnderecos[endereco] || 0;
  const precoSalvo = precos[id] || "";
  return (
  <li
  key={id}
  onClick={() => abrirModalPreco(id)}
  title={`Clique para informar preço. Este local teve ${qtd} corrida(s) ${isPremium ? "" : "hoje"}`}
  className={`
    cursor-pointer p-4 rounded-lg flex justify-between items-center shadow-sm
    hover:shadow-md transition-shadow bg-white border border-gray-200
    ${corFundo(qtd)}
    flex-wrap
  `}
>
  <div className="flex flex-col max-w-[60%] min-w-0">
    <div className="font-semibold text-gray-900 truncate">
      {nome || "Sem comentário"}
    </div>
    <div className="text-xs text-gray-500 mt-1 truncate">
      {dataHora}
    </div>
  </div>

  <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full select-none mx-4 whitespace-nowrap">
    {corrida}
  </div>

  <div className="text-sm font-semibold text-gray-800 whitespace-nowrap select-none">
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
        Essa avaliações foram dadas pelos nossos usuarios {isPremium ? "" : "hoje"} 
      </p>
    </div>
  );
}
