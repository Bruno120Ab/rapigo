import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  mapboxToken?: string;
}

export const MapComponent = ({ onLocationSelect, mapboxToken }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken || tokenInput;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-12.9777, -38.5016], // Salvador, BA como padrão
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.setCenter([longitude, latitude]);
            
            // Add user location marker
            new mapboxgl.Marker({ color: '#3b82f6' })
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setText('Sua localização atual'))
              .addTo(map.current);
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          toast({
            title: "Erro de localização",
            description: "Não foi possível obter sua localização atual",
            variant: "destructive"
          });
        }
      );
    }

    // Add click handler for destination selection
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation([lng, lat]);

      // Remove existing destination marker
      const existingMarkers = document.querySelectorAll('.destination-marker');
      existingMarkers.forEach(marker => marker.remove());

      // Add new destination marker
      const el = document.createElement('div');
      el.className = 'destination-marker';
      el.style.backgroundColor = '#f97316';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';

      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText('Destino selecionado'))
        .addTo(map.current!);

      // Get address using reverse geocoding
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({ lat, lng, address });
        
        toast({
          title: "Destino selecionado",
          description: address,
        });
      } catch (error) {
        console.error('Erro ao obter endereço:', error);
        onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken, tokenInput, onLocationSelect, toast]);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      setIsTokenSet(true);
      toast({
        title: "Token configurado",
        description: "Mapa carregado com sucesso!",
      });
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        duration: 1000
      });
    }
  };

  if (!isTokenSet && !mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Configurar Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Para usar o mapa, você precisa de um token do Mapbox. 
            Crie uma conta gratuita em <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Cole seu token do Mapbox aqui..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              type="password"
            />
            <Button onClick={handleTokenSubmit} disabled={!tokenInput.trim()}>
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Selecione o destino no mapa</h3>
        {userLocation && (
          <Button
            variant="outline"
            size="sm"
            onClick={centerOnUserLocation}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Minha localização
          </Button>
        )}
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="w-full h-80 rounded-lg border" />
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded p-2 text-xs text-muted-foreground">
          Clique no mapa para selecionar o destino
        </div>
      </div>
    </div>
  );
};