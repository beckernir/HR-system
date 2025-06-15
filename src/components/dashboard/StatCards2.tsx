"use client";

import { Users, Clock, GlobeIcon, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  total: number;
  percentage: number;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({
  title,
  value,
  total,
  percentage,
  trend,
  icon,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="bg-[#E0E2E5] backdrop-blur-sm border-0 rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center"
            )}
            style={{ backgroundColor: bgColor }}
          >
            {icon}
          </div>

          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-semibold">{value}</span>
              <span className="text-sm text-muted-foreground">/{total}</span>
            </div>
            {/* <p
              className={cn(
                "text-xs mt-0.5",
                trend === "up"
                  ? "text-emerald-500"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-amber-500"
              )}
            >
              {percentage.toFixed(1)}%
            </p> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatCards() {
  const statData = [
    {
      title: "Worked Position",
      value: 3,
      total: 127,
      percentage: 100,
      trend: "up" as const,
      icon: <Users className="h-4 w-4 text-white" />,
      bgColor: "#F9A8A8",
    },
    {
      title: "Strikes Given",
      value: 4,
      total: 127,
      percentage: 27.6,
      trend: "neutral" as const,
      icon: <Clock className="h-4 w-4 text-white" />,
      bgColor: "#E0B405",
    },
    {
      title: "Payed Months",
      value: 72,
      total: 72,
      percentage: 27.6,
      trend: "up" as const,
      icon: <Users className="h-4 w-4 text-white" />,
      bgColor: "#189904",
    },
    {
      title: "Leaves Consumed",
      value: 127,
      total: 150,
      percentage: 26.8,
      trend: "up" as const,
      icon: <GlobeIcon className="h-4 w-4 text-white" />,
      bgColor: "#555657",
    },
    {
      title: "Worked Hours",
      value: 9601,
      total: 127,
      percentage: 27.6,
      trend: "neutral" as const,
      icon: <UserPlus className="h-4 w-4 text-white" />,
      bgColor: "#FFAAF4",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statData.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          total={stat.total}
          percentage={stat.percentage}
          trend={stat.trend}
          icon={stat.icon}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
}
