// hooks/use-feedback.ts
export const enviarFeedbackParaGoogleForms = async ({
  nome,
  feedback,
}: {
  nome: string;
  feedback: string;
}) => {
  // URL do formulário público (qualquer pessoa com o link pode enviar)
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfXxqmsoq7Tf8pkBPQrASI7qEjwjdsllfLD3a2n87z3__SBYA/formResponse";

  const body = new URLSearchParams({
    "entry.382389813": nome || "Anônimo", // substitua pelo seu entry correto
    "entry.693259257": feedback,         // substitua pelo seu entry correto
  }).toString();

  try {
    await fetch(formUrl, {
      method: "POST",
      mode: "no-cors", // essencial para não gerar erro CORS
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
  }
};