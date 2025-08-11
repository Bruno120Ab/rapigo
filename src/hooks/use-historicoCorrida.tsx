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
      console.log(`${nomeDoMotoboy} Aqui`)

    const proxyUrl = 'https://script.google.com/macros/s/AKfycbxSN5Y25wszm8Z5pfx4z6wxbh87U_C5nxH2E4Qj6wOGDIywtl7saATBMCiWMojgJ6r5/exec';

    fetch(`${proxyUrl}?id=${encodeURIComponent(nomeDoMotoboy)}`)
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
