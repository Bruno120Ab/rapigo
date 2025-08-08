import { useState } from "react";
import { History, MapPin, Calendar, Bike, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Solicitacao } from "@/types/mototaxi";
import { AvaliacaoModal } from "@/components/AvaliacaoModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const BannerSection = () => {
  const items = [
    { src: "/screen01.png", alt: "App futuro 1" },
    { src: "/screen02.png", alt: "App futuro 2" },
    { src: "/Image.png", alt: "Funcionalidade em breve" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Nosso App
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Estamos construindo outros aplicativos incríveis para facilitar ainda mais o seu dia a dia. Aguarde novidades!
        </p>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {items.map((item, idx) => (
                <CarouselItem key={idx} className="basis-full">
                  <img src={item.src} alt={item.alt} className="w-full h-48 object-cover rounded-md" loading="lazy" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex items-center justify-center mt-3">
            <div className="h-3 w-3 rounded-full bg-primary/50 animate-pulse" />
            <span className="ml-2 text-xs text-muted-foreground">Novidades sendo preparadas...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};