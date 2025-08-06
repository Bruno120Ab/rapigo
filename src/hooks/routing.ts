export const calcularDistanciaETempo = async (
  origem: { lat: number; lng: number },
  destino: { lat: number; lng: number }
): Promise<{ distanciaKm: number; tempoMin: number } | null> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${origem.lng},${origem.lat};${destino.lng},${destino.lat}?overview=false`
    );
    if (!response.ok) throw new Error("Erro na requisição OSRM");

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      return {
        distanciaKm: data.routes[0].distance / 1000,
        tempoMin: data.routes[0].duration / 60,
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao calcular distância/tempo:", error);
    return null;
  }
};
