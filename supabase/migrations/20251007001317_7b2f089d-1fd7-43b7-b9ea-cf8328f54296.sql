-- Criar enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('cliente', 'entregador', 'admin');

-- Criar tabela de perfis vinculada aos usuários do auth
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles: usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_roles: usuários podem ver apenas suas próprias roles
CREATE POLICY "Usuários podem ver suas próprias roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Função security definer para verificar se usuário tem uma role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Criar tabela de pedidos/solicitações
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entregador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome_cliente TEXT NOT NULL,
  endereco_origem TEXT NOT NULL,
  endereco_destino TEXT,
  tipo_servico TEXT NOT NULL, -- 'corrida', 'entrega', 'coleta', 'buscar_pessoa'
  status TEXT NOT NULL DEFAULT 'pendente', -- 'pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado'
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_agendamento TIMESTAMP WITH TIME ZONE,
  coordenadas_origem JSONB,
  coordenadas_destino JSONB,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela pedidos
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pedidos
-- Clientes podem ver apenas seus próprios pedidos
CREATE POLICY "Clientes podem ver seus próprios pedidos"
  ON public.pedidos FOR SELECT
  USING (auth.uid() = cliente_id);

-- Clientes podem criar pedidos
CREATE POLICY "Clientes podem criar pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);

-- Entregadores podem ver todos os pedidos pendentes e seus próprios pedidos aceitos
CREATE POLICY "Entregadores podem ver pedidos disponíveis"
  ON public.pedidos FOR SELECT
  USING (
    public.has_role(auth.uid(), 'entregador') AND 
    (status = 'pendente' OR entregador_id = auth.uid())
  );

-- Entregadores podem atualizar pedidos que aceitaram
CREATE POLICY "Entregadores podem atualizar seus pedidos"
  ON public.pedidos FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'entregador') AND 
    entregador_id = auth.uid()
  );

-- Função para criar perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'telefone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para pedidos
ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos;