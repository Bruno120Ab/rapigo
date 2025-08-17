import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

export default function MapaRapiCidade() {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: "SUA_CHAVE_GOOGLE_MAPS" });
  const [minhaPosicao, setMinhaPosicao] = useState<{ lat: number; lng: number } | null>(null);
  const [maisProximo, setMaisProximo] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<any>(null);

  // Coordenadas do motoboy/ponto
  const pontoMoto = { lat: -15.243887, lng: -40.619892 };

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMinhaPosicao(coords);
        setMaisProximo(pontoMoto);

        // Calcular rota real usando Directions API
        const service = new google.maps.DirectionsService();
        service.route(
          {
            origin: coords,
            destination: pontoMoto,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) setDirections(result);
          }
        );
      },
      (err) => console.error("Erro geolocalização:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!isLoaded || !minhaPosicao) return <div>Carregando mapa...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={minhaPosicao} zoom={14}>
      {/* Marcador do usuário */}
      <Marker position={minhaPosicao} label="Você" />

      {/* Marcador do motoboy/ponto */}
      <Marker
        position={pontoMoto}
        label="Motoboy mais próximo"
        icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        onClick={() => alert("Iniciar corrida com este motoboy")}
      />

      {/* Rota até o motoboy */}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
