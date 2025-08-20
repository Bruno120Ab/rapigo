export const enviarUserParaGoogleForms = ({
  ehMotoboy,
  userId,
  nomeClientePadrao,
  email,
  Premium,
  DateExpir,
  DateCAd,
  ativo
}: {
  ehMotoboy: string;
  userId: string;
  nomeClientePadrao: string;
  email: string;
  Premium: string;
  DateExpir: string;
  DateCAd: string;
  ativo;
}) => {
  

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSf3vlDRyJA9IjlirDlT2cHjXUi4raNqdSmhKz8fYqS39ftxhw/formResponse", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "entry.706332873": ehMotoboy,
      "entry.2125053126": userId,
      "entry.561500317": nomeClientePadrao,
      "entry.1412515038": email,
      "entry.1905294411": Premium,
      "entry.1486339636": DateExpir,
      "entry.1587630965": DateCAd,
      "entry.1241088726": ativo,

    }).toString()
  }).then(() => {
  }).catch((error) => {
    console.error("Erro ao enviar para Google Forms:", error);
  });
};
