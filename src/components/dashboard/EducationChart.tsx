"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface EducationChartProps {
  selectedYear: string;
}

export default function EducationChart({ selectedYear }: EducationChartProps) {
  const data = [
    { name: "B.S / B.A Degree", value: 32, color: "#65B741" },
    { name: "Master Degree", value: 25, color: "#3A86FF" },
    { name: "Ph.D / P.E Degree", value: 24, color: "#FF9E00" },
    { name: "Masters / MBA", value: 46, color: "#FF5678" }
  ];
  
  return (
    <Card className="bg-[#E0E2E5] backdrop-blur-sm border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Workers Education Level</CardTitle>
          <Select defaultValue={selectedYear}>
            <SelectTrigger className="w-[70px] h-7 text-xs bg-background border-0">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[200px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-semibold">127</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex items-baseline gap-1">
                <span className="text-xs">{item.name}</span>
                <span className="text-xs text-muted-foreground">({item.value})</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}