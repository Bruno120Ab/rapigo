import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Package, MapPin, Clock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

interface Pedido {
  id: string;
  nome_cliente: string;
  endereco_origem: string;
  endereco_destino: string | null;
  tipo_servico: string;
  status: string;
  data_solicitacao: string;
  observacoes: string | null;
}

const DashboardEntregador = () => {
  const navigate = useNavigate();
  const { user, signOut, userRole, loading } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  // Redirecionar se não estiver logado ou não for entregador
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (userRole === 'cliente') {
        navigate('/');
      }
    }
  }, [user, userRole, loading, navigate]);

  // Buscar pedidos disponíveis e aceitos
  const fetchPedidos = async () => {
    try {
      setLoadingPedidos(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('data_solicitacao', { ascending: false });

      if (error) throw error;

      setPedidos(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    if (user && userRole === 'entregador') {
      fetchPedidos();

      // Configurar realtime para atualizar lista automaticamente
      const channel = supabase
        .channel('pedidos-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pedidos'
          },
          () => {
            fetchPedidos();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, userRole]);

  const aceitarPedido = async (pedidoId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({
          status: 'aceito',
          entregador_id: user?.id
        })
        .eq('id', pedidoId);

      if (error) throw error;

      toast.success('Pedido aceito com sucesso!');
      fetchPedidos();
    } catch (error: any) {
      console.error('Erro ao aceitar pedido:', error);
      toast.error('Erro ao aceitar pedido');
    }
  };

  const concluirPedido = async (pedidoId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: 'concluido' })
        .eq('id', pedidoId);

      if (error) throw error;

      toast.success('Pedido concluído!');
      fetchPedidos();
    } catch (error: any) {
      console.error('Erro ao concluir pedido:', error);
      toast.error('Erro ao concluir pedido');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pendente: 'default',
      aceito: 'secondary',
      concluido: 'outline',
      cancelado: 'destructive'
    };

    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  const getTipoServicoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      corrida: 'Corrida',
      entrega: 'Entrega',
      coleta: 'Coleta',
      buscar_pessoa: 'Buscar Pessoa'
    };
    return labels[tipo] || tipo;
  };

  if (loading || loadingPedidos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-2xl">Dashboard Entregador</CardTitle>
              <CardDescription>Gerencie seus pedidos e entregas</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </CardHeader>
        </Card>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pedidos Disponíveis</h2>
          
          {pedidos.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                Nenhum pedido disponível no momento
              </CardContent>
            </Card>
          ) : (
            pedidos.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {getTipoServicoLabel(pedido.tipo_servico)}
                    </CardTitle>
                    {getStatusBadge(pedido.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Cliente</p>
                      <p className="text-sm text-muted-foreground">{pedido.nome_cliente}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Origem</p>
                      <p className="text-sm text-muted-foreground">{pedido.endereco_origem}</p>
                      {pedido.endereco_destino && (
                        <>
                          <p className="text-sm font-medium mt-2">Destino</p>
                          <p className="text-sm text-muted-foreground">{pedido.endereco_destino}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Solicitado em</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(pedido.data_solicitacao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {pedido.observacoes && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-1">Observações</p>
                      <p className="text-sm text-muted-foreground">{pedido.observacoes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {pedido.status === 'pendente' && (
                      <Button 
                        onClick={() => aceitarPedido(pedido.id)}
                        className="flex-1"
                      >
                        Aceitar Pedido
                      </Button>
                    )}
                    {pedido.status === 'aceito' && (
                      <Button 
                        onClick={() => concluirPedido(pedido.id)}
                        className="flex-1"
                      >
                        Concluir Pedido
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEntregador;
