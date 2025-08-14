import { Car, Calendar, Truck, Bike } from "lucide-react";

const cards = [
  {
    titulo: "Viagem",
    descricao: "Vá a qualquer lugar com o app da RapMoto. Solicite uma viagem, e relaxe.",
    icon: <Car className="h-8 w-8 text-orange-500" />
  },
  {
    titulo: "Reserve",
    descricao: "Reserve sua viagem com antecedência e fique tranquilo no dia da viagem.",
    icon: <Calendar className="h-8 w-8 text-orange-500" />
  },
  {
    titulo: "Flash",
    descricao: "A RapMoto torna fácil a entrega de itens no mesmo dia.",
    icon: <Truck className="h-8 w-8 text-orange-500" />
  },
  {
    titulo: "Moto",
    descricao: "Faça viagens de moto econômicas em minutos na porta de sua casa.",
    icon: <Bike className="h-8 w-8 text-orange-500" />
  }
];

export const CardsSection = () => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
        Serviços RapMoto
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{card.titulo}</h3>
            <p className="text-sm text-gray-600">{card.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
