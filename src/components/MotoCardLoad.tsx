import { Card, CardContent } from "./ui/card";

export const MototaxistaCardLoading = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Avatar skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              {/* Nome skeleton */}
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              {/* Tipo de veículo skeleton */}
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              {/* Métricas skeleton */}
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1" />
            </div>
          </div>

          {/* Botões skeleton */}
          <div className="flex flex-col items-end gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};