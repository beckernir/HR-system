"use client";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface YearSelectorProps {
  selectedYear: string;
  onChange: (value: string) => void;
}

export function YearSelector({ selectedYear, onChange }: YearSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedYear} onValueChange={onChange}>
        <SelectTrigger className="w-[90px] h-8">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2022">2022</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}