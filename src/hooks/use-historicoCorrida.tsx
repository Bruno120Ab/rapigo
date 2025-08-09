import { useState, useEffect } from "react";

export function useHistoricoCorridas(nomeDoMotoboy) {
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
    const proxyUrl = 'https://script.google.com/macros/s/AKfycbyvDjpqEzuGN9BV4bOTKmXCHxd5CDLPYr5vjV7If5lAiNMADwyjJB6pxIb3K3b0M-Eo/exec';

    fetch(`${proxyUrl}?nome=${encodeURIComponent(nomeDoMotoboy)}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
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
