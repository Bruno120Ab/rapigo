export const enviarPedidoParaGoogleForms = ({ idCorrida, nome, corrida, idMoto, motoboy }: { idCorrida: string; nome: string; corrida: string;idMoto:string; motoboy: string }) => {
  fetch("https://docs.google.com/forms/d/e/1FAIpQLSeL6iQXF7vL4FkoBJRr71XWRM9JOWCnmr5T9OoegFDFE7-ffA/formResponse", {
    method: "POST",
    mode: "no-cors", // importante para evitar erro CORS
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "entry.1332544433": idCorrida,
      "entry.1776174288": nome,
      "entry.2037637805": corrida,
      "entry.2107210329": idMoto,
      "entry.2047747482": motoboy
    }).toString()
  });

};
