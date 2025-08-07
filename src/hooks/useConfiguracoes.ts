import { useState, useEffect } from "react";

export interface Configuracao {
  nomeClientePadrao: string;
  modoEscuro: boolean;
  tamanhoFonte: 'pequeno' | 'medio' | 'grande';
  usuarioPadrao: boolean;
}

const configuracaoPadrao: Configuracao = {
  nomeClientePadrao: "",
  modoEscuro: false,
  tamanhoFonte: 'medio',
  usuarioPadrao: false,
};

export const useConfiguracoes = () => {
  const [configuracao, setConfiguracao] = useState<Configuracao>(configuracaoPadrao);

  useEffect(() => {
    const configSalva = localStorage.getItem("configuracoes-usuario");
    if (configSalva) {
      try {
        const config = JSON.parse(configSalva);
        setConfiguracao(config);
        aplicarConfiguracoes(config);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }
  }, []);

  const aplicarConfiguracoes = (config: Configuracao) => {
    // Aplicar tema
    const root = document.documentElement;
    if (config.modoEscuro) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Aplicar tamanho da fonte
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (config.tamanhoFonte) {
      case 'pequeno':
        root.classList.add('text-sm');
        break;
      case 'grande':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }
  };

  const salvarConfiguracao = (novaConfig: Partial<Configuracao>) => {
    const configAtualizada = { ...configuracao, ...novaConfig };
    setConfiguracao(configAtualizada);
    localStorage.setItem("configuracoes-usuario", JSON.stringify(configAtualizada));
    aplicarConfiguracoes(configAtualizada);
  };

  return {
    configuracao,
    salvarConfiguracao,
  };
};