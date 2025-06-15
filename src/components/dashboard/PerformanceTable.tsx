"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface PerformerProps {
  name: string;
  position: string;
  image: string;
  rating: number;
  maxRating: number;
}

function Performer({ name, position, image, rating, maxRating }: PerformerProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar className="">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{position}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{rating}/{maxRating}</span>
        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
      </div>
    </div>
  );
}

export default function PerformanceTable() {
  const performers = [
    {
      name: "Dr. Benjamin Kular",
      position: "Backend Engineering Practice",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      maxRating: 5,
    },
    {
      name: "Ms. Umutoni Ange",
      position: "HR Management Practice",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 4,
      maxRating: 5,
    },
    {
      name: "PhD. Benson Williams",
      position: "Chief of Operations",
      image: "https://i.pravatar.cc/150?img=3",
      rating: 4,
      maxRating: 5,
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Best Performer</CardTitle>
          <Button variant="secondary" size="sm" className="h-7 px-3 text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {performers.map((performer) => (
            <Performer
              key={performer.name}
              name={performer.name}
              position={performer.position}
              image={performer.image}
              rating={performer.rating}
              maxRating={performer.maxRating}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}