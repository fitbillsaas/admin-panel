"use client";

import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "@/models/state";

interface StateSelectionProps {
  states: State[];
  onStateChange: (state: State) => void;
  initialState?: string;
}

export default function StateSelection({
  states,
  onStateChange,
  initialState = "",
}: StateSelectionProps) {
  const handleSelection = (value: string) => {
    const selectedState = states.find((state) => state.code === value);
    if (selectedState) {
      onStateChange(selectedState);
    }
  };

  return (
    <Select onValueChange={handleSelection} value={initialState}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="State" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {states.map((option) => (
          <SelectItem key={option.id} value={`${option.code}`}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
