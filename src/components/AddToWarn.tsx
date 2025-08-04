import { useEffect, useState, useRef } from "react";

type Passo = {
  img: string;
  descricao: string;
};

const passos: Passo[] = [
  {
    img: "/public/icon-512.png", // substitua pela sua imagem
    descricao: "Toque no menu do navegador (ícone dos três pontinhos)",
  },
 {
    img: "/public/icon-512.png", // substitua pela sua imagem
    descricao: "Toque no menu do navegador (ícone dos três pontinhos)",
  },
{
    img: "/public/icon-512.png", // substitua pela sua imagem
    descricao: "Toque no menu do navegador (ícone dos três pontinhos)",
  },
];

export function AddToHomeScreenCarousel() {
  const [show, setShow] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Aparece depois de 2s
    const timerShow = setTimeout(() => setShow(true), 2000);

    // Ciclo automático dos passos (a cada 3.5s passa para o próximo)
    timeoutRef.current = setTimeout(function cycle() {
      setStepIndex((i) => (i + 1) % passos.length);
      timeoutRef.current = setTimeout(cycle, 3500);
    }, 3500);

    // Depois de 15 segundos, some deslizando para direita e some
    const timerHide = setTimeout(() => setShow(false), 15000);

    return () => {
      clearTimeout(timerShow);
      clearTimeout(timeoutRef.current);
      clearTimeout(timerHide);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-label="Instruções para adicionar à tela inicial"
      role="region"
      tabIndex={0}
      style={{
        position: "fixed",
        bottom: 40,
        left: 0,
        backgroundColor: "#25C2A0",
        color: "white",
        padding: "16px",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        width: 280,
        maxWidth: "90vw",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        animation: "slideInLeft 0.5s ease forwards",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        zIndex: 9999,
      }}
      onClick={() => setShow(false)}
    >
      <strong style={{ fontSize: 18, marginBottom: 8 }}>
        Quer acesso rápido? <br />
        Adicione o app à tela inicial:
      </strong>

      <div
        style={{
          display: "flex",
          overflowX: "hidden",
          height: 140,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {passos.map((passo, i) => (
          <div
            key={i}
            style={{
              minWidth: 240,
              flexShrink: 0,
              textAlign: "center",
              opacity: i === stepIndex ? 1 : 0,
              transition: "opacity 0.6s ease",
              position: i === stepIndex ? "relative" : "absolute",
              pointerEvents: i === stepIndex ? "auto" : "none",
            }}
          >
            <img
              src={passo.img}
              alt={passo.descricao}
              style={{
                width: "100%",
                height: 100,
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 0 8px rgba(0,0,0,0.3)",
              }}
              loading="lazy"
            />
            {/* <p
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1.3,
              }}
            >
              {passo.descricao}
            </p> */}
          </div>
        ))}
      </div>

      <small style={{ fontSize: 12, opacity: 0.7, cursor: "pointer" }}>
        Clique para fechar
      </small>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-320px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(320px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
