// Função para converter coordenadas em endereço legível
export const coordenadasParaEndereco = async (lat: number, lng: number): Promise<string> => {
  try {
    // Usando Nominatim (OpenStreetMap) como alternativa gratuita ao Mapbox
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      // Extrair partes principais do endereço
      const address = data.address;
      let endereco = '';
      
      if (address.road) {
        endereco += address.road;
        if (address.house_number) {
          endereco += `, ${address.house_number}`;
        }
      }
      
      if (address.suburb || address.neighbourhood) {
        endereco += endereco ? ` - ${address.suburb || address.neighbourhood}` : address.suburb || address.neighbourhood;
      }
      
      if (address.city || address.town || address.village) {
        endereco += endereco ? `, ${address.city || address.town || address.village}` : address.city || address.town || address.village;
      }
      
      return endereco || data.display_name;
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Erro ao converter coordenadas:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Função para converter endereço em coordenadas
export const enderecoParaCoordenadas = async (endereco: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error);
    return null;
  }
};