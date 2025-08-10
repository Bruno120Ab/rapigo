import { Shield, Lock, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const empresasMock = [
  "Itambé Moto Service",
  "Rota Express",
  "Cidade Livre Transportes",
  "TransMais",
  "MotoFácil",
];

export const PoliticaSeguranca = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Política e Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Privacidade */}
        <div>
          <h3 className="font-semibold">Privacidade</h3>
          <p className="text-sm text-muted-foreground">
            Respeitamos sua privacidade. Seus dados são usados apenas para
            processar solicitações e melhorar sua experiência no app.
          </p>
        </div>

        {/* Segurança */}
        <div>
          <h3 className="font-semibold">Segurança</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Todos os nossos mototaxistas são cadastrados e vinculados a empresas
            de transporte regularizadas, garantindo padrões de qualidade e
            segurança.
          </p>
          <div className="flex flex-wrap gap-2">
            {empresasMock.map((empresa, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <Building2 className="h-3 w-3 text-primary" />
                {empresa}
              </Badge>
            ))}
          </div>
        </div>

        {/* Compromisso */}
        <div>
          <h3 className="font-semibold">Compromisso RapMoto</h3>
          <p className="text-sm text-muted-foreground">
            Essa é uma das políticas da <strong>RapMoto</strong> para oferecer
            mais segurança, confiança e tranquilidade aos passageiros.
          </p>
        </div>

        {/* Rodapé */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
          <Lock className="h-4 w-4" />
          Este app está em constante evolução com foco em segurança e
          confiabilidade.
        </div>
      </CardContent>
    </Card>
  );
};
