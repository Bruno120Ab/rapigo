export const enviarAvaParaGoogleForms = ({
  Avaliacao,
  Feita,
  Comentario,
  Motoboy,
  TimeRun,
  Type,
}: {
  Avaliacao: number;
  Feita: boolean;
  Comentario: string;
  Motoboy: string;
  TimeRun: string;
  Type: string;
}) => {
  fetch("https://docs.google.com/forms/d/e/1FAIpQLSdINfOixqgkpJsQRyJEAZD5do8QC4KdqbEGO6qeuwvrZ92X2Q/formResponse", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "entry.373104202": Avaliacao.toString(),
      "entry.695374528": Feita ? "Sim" : "Não",
      "entry.182623884": Comentario,
      "entry.1778800915": Motoboy,
      "entry.1753144534": TimeRun,
      "entry.904318387": Type,
    }).toString()
  });
};
