import { useState, useEffect } from "react";

export function useAvaCorridas(nomeDoMotoboy) {
  const [resumo, setResumo] = useState(null);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nomeDoMotoboy) {
      setResumo(null);
      setLoadingHistorico(false);
      return;
    }

    setLoadingHistorico(true);
    console.log(nomeDoMotoboy)

    const proxyUrl = `https://script.google.com/macros/s/AKfycbwNFDyGr0UUAmP1-d_bGai0ZXCJtcai59MGAtrHowT83051OAgrvCeDNYU7H_I7eA/exec?type=avalies&id=${encodeURIComponent(
      nomeDoMotoboy
    )}`;

    fetch(proxyUrl)
      .then(response => response.json())
      .then(data => {
        setResumo(data);
        setLoadingHistorico(false);
      })
      .catch(err => {
        setError(err);
        setLoadingHistorico(false);
      });

  }, [nomeDoMotoboy]);

  return { resumo, loadingHistorico, error };
}
