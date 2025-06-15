"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CircleCheck } from "lucide-react";

interface AttendanceRecordProps {
  name: string;
  position: string;
  image: string;
  attendedDays: number;
  totalDays: number;
}

function AttendanceRecord({ name, position, image, attendedDays, totalDays }: AttendanceRecordProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{position}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{attendedDays}/{totalDays}</span>
        <CircleCheck className="h-4 w-4 text-emerald-500" />
      </div>
    </div>
  );
}

export default function AttendanceTable() {
  const [selectedMonth, setSelectedMonth] = useState<string>("january");

  const attendanceRecords = [
    {
      name: "Dr. Benjamin Kular",
      position: "Backend Engineering Practice",
      image: "https://i.pravatar.cc/150?img=1",
      attendedDays: 28,
      totalDays: 28,
    },
    {
      name: "Ms. Umutoni Ange",
      position: "HR Management Practice",
      image: "https://i.pravatar.cc/150?img=5",
      attendedDays: 22,
      totalDays: 28,
    },
    {
      name: "PhD. Benson Williams",
      position: "Chief of Operations",
      image: "https://i.pravatar.cc/150?img=3",
      attendedDays: 20,
      totalDays: 28,
    },
  ];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Attendance</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="h-7 px-3 text-xs">
              View All
            </Button>
            <Select 
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[100px] h-7 text-xs">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {attendanceRecords.map((record) => (
            <AttendanceRecord
              key={record.name}
              name={record.name}
              position={record.position}
              image={record.image}
              attendedDays={record.attendedDays}
              totalDays={record.totalDays}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}