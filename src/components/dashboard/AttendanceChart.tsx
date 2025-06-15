"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AttendanceChartProps {
  selectedYear: string;
}

export default function AttendanceChart({ selectedYear }: AttendanceChartProps) {
  const data = [
    { name: "All Attended", value: 100 },
    { name: "Late Attended", value: 20 },
    { name: "Missed", value: 24 }
  ];
  
  const COLORS = ["#65B741", "#F4CE14", "#EB455F"];
  
  return (
    <Card className="bg-[#E0E2E5] backdrop-blur-sm border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Workers Attendance</CardTitle>
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
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Avg Workers Arrival Time: <span className="font-medium text-foreground">08:43</span></p>
        </div>
        
        <div className="w-full h-[200px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
            <span className="text-3xl font-semibold">80%</span>
            <span className="text-xs text-muted-foreground">Attendance Rate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 -mt-[9rem] w-[8rem] float-right pb-5">
          {data.map((item, index) => (
            <div key={item.name} className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs">{item.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">({item.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}