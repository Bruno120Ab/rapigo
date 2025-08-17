export const buscarPedidosDoGoogleSheets = async () => {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycby3iCeujayrADpcZYBl2ZCL3e5y4hgU6h90pcF8FA1GkB2_yHw0VprWofMSXfoO9YU_/exec?type=taxis");
    const data = await response.json();
        console.log(data)

    return data; // vai ser um array de objetos [{ Carimbo: "...", ID: "...", Nome: "...", ... }]
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }
};