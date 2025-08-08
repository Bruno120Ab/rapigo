import { Shield, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PoliticaSeguranca = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Política e Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold">Privacidade</h3>
          <p className="text-sm text-muted-foreground">
            Respeitamos sua privacidade. Seus dados são usados apenas para processar solicitações e melhorar sua experiência no app.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Segurança</h3>
          <p className="text-sm text-muted-foreground">
            Armazenamos informações locais de forma segura no seu dispositivo. Não compartilhamos seus dados com terceiros sem seu consentimento.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-4 w-4" />
          Este app está em constante evolução com foco em segurança e confiabilidade.
        </div>
      </CardContent>
    </Card>
  );
};
