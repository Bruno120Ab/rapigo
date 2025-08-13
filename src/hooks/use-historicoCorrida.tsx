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
    const proxyUrl = `https://script.google.com/macros/s/AKfycbxqbks7rjDU0olOVjZ3hvifM4nr-wfGx8e1F2UHLB7YFAiOjSvfRArRrrANhJ11EJgz/exec?type=avalies&id=${encodeURIComponent(
      nomeDoMotoboy
    )}`;
    console.log(resumo)

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
