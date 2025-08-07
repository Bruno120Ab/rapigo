import { useState } from "react";
import { History, MapPin, Calendar, Bike, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Solicitacao } from "@/types/mototaxi";
import { AvaliacaoModal } from "@/components/AvaliacaoModal";



export const BannerSection = () => {
  const [expandido, setExpandido] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<Solicitacao | null>(null);
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Nossos outros apps
          </CardTitle>
        </CardHeader>
        <CardContent>
        
        </CardContent>
      </Card>
    </>
  );
};