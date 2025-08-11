import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Car, Bike, Star, Shield, Phone, ShieldCheck } from "lucide-react";
import { Mototaxista } from "@/types/mototaxi";
import { useHistoricoCorridas } from "@/hooks/use-historicoCorrida";

interface DetalhesMotoboyModalProps {
  mototaxista: Mototaxista | null;
  isOpen: boolean;
  loading: boolean;
  premium: boolean;
  onClose: () => void;
  onSelecionar: (mototaxista: Mototaxista) => void;
  metricas?: { mediaEstrelas: number; taxaAceite: number; totalViagens: number; viagensAvaliadas: number };
}

export const DetalhesMotoboyModal = ({ 
  mototaxista, 
  loading,
  premium,
  isOpen, 
  onClose, 
  onSelecionar,
  metricas 
}: DetalhesMotoboyModalProps) => {
  if (!mototaxista) return null;
  const { resumo, loadingHistorico, error } = useHistoricoCorridas(mototaxista.id);

  const handleSelecionar = () => {
    onSelecionar(mototaxista);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Motorista</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar e info básica */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mototaxista.foto} alt={mototaxista.nome} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{mototaxista.nome}</h3>
                <Badge 
                  variant={mototaxista.ativo ? "default" : "secondary"}
                  className={mototaxista.ativo ? "bg-success text-success-foreground" : ""}
                >
                  {metricas.mediaEstrelas > 4 ? "Bem avaliado" : "Pontual"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mototaxista.telefone}</span>
              </div>
            </div>
          </div>

          {/* Tipo de veículo */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {mototaxista.tipoVeiculo === 'carro' ? (
              <>
                <Car className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">MOdelo do carro: {mototaxista.detalhes}</p>
                  <p className="text-sm text-muted-foreground">Mais conforto e proteção</p>
                </div>
              </>
            ) : (
              <>
                <img   className="w-16 h-16 rounded-md object-cover" src={mototaxista.detalhes_foto} alt="" />
                <div>
                  <p className="font-medium">Modelo da moto: {mototaxista.detalhes}</p>
                  <p className="text-sm text-muted-foreground">Mais ágil no trânsito</p>
                </div>
              </>
            )}
          </div>

          <p className="font-medium mx-auto" >Historico de viagens com você :</p>

          {/* Métricas */}
          {metricas && metricas.totalViagens > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="font-medium">
                    {metricas.mediaEstrelas > 0 ? metricas.mediaEstrelas.toFixed(1) : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Avaliação ({metricas.viagensAvaliadas} avaliações)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{Math.round(metricas.taxaAceite)}%</p>
                  <p className="text-xs text-muted-foreground">
                    Taxa de aceite ({metricas.totalViagens} viagens)
                  </p>
                </div>
              </div>
            </div>
          )}
          <span className="flex items-center mr-0">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <h3 className="font-medium ml-1" > Quer mais confiança?</h3> 
          </span>
            <h5 className="text-sm text-muted-foreground">Veja o desempenho do motoboy com base nas avaliações feitas por outros usuários. Aqui você encontra o histórico completo de atendimentos e avaliações detalhadas, que ajudam a entender a qualidade do serviço prestado..</h5>
          {loadingHistorico ? (
  <div className="flex items-center justify-center p-8">
    <p>Verificando status premium...</p>
  </div>
) : error ? (
  <div className="flex items-center justify-center p-8 text-red-600">
    <p>Erro ao carregar dados: {error.message}</p>
  </div>
) : (
  <>
    <div
      className={`
        transition-all duration-300
        ${!premium ? "blur-sm pointer-events-none" : ""}
      `}
    >
      {resumo && resumo.totalAvaliacoes > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <div>
              <p className="font-medium">
                {resumo.mediaAvaliacoes && resumo.mediaAvaliacoes !== "N/A"
                  ? Number(resumo.mediaAvaliacoes).toFixed(1)
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Avaliação ({resumo.totalAvaliacoes} avaliações)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">
                {resumo.corridasAceitas
                  ? Math.round(
                      (resumo.corridasAceitas / resumo.totalAvaliacoes) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground">
                Taxa de aceite ({resumo.totalAvaliacoes} viagens)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
)}

          {/* Botão de seleção */}
          {mototaxista.ativo && (
            <Button onClick={handleSelecionar} className="w-full">
              Selecionar este motorista
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};