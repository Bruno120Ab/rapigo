import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Building2, Lock } from "lucide-react";

const empresasMock = ["Itambé Transportes", "Motoboys União", "Rapid Delivery"];

export const PoliticaSeguranca = () => {
  return (
    <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-4 max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-gray-800">
          <Shield className="h-5 w-5 text-primary" />
          Política e Segurança
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-gray-700">
        {/* Privacidade */}
        <div>
          <h3 className="font-semibold text-gray-800">Privacidade</h3>
          <p className="text-sm">
            Respeitamos sua privacidade. Seus dados são usados apenas para processar
            solicitações e melhorar sua experiência no app.
          </p>
        </div>

        {/* Segurança */}
        <div>
          <h3 className="font-semibold text-gray-800">Segurança</h3>
          <p className="text-sm mb-2">
            Todos os nossos mototaxistas são cadastrados e vinculados a empresas de
            transporte regularizadas, garantindo padrões de qualidade e segurança.
          </p>
          <div className="flex flex-wrap gap-2">
            {empresasMock.map((empresa, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
              >
                <Building2 className="h-3 w-3 text-primary" />
                {empresa}
              </div>
            ))}
          </div>
        </div>

        {/* Compromisso */}
        <div>
          <h3 className="font-semibold text-gray-800">Compromisso RapiGo</h3>
          <p className="text-sm">
            Uma das nossas principais missões é <span className="text-orange-500">apoiar e valorizar os motoboys</span> de Itambé, respeitando as organizações e garantindo confiança e segurança para passageiros e profissionais.
          </p>
        </div>

        {/* Rodapé */}
        <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-2">
          <Lock className="h-4 w-4" />
          Este app está em constante evolução, sempre focado em segurança, confiabilidade e apoio à comunidade local.
        </div>
      </CardContent>
    </Card>
  );
};
