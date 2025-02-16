
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TravelPreferences } from "@/lib/gemini";
import { MapPin, Calendar, Users, DollarSign, Plane } from "lucide-react";

interface TravelFormProps {
  onSubmit: (preferences: TravelPreferences) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [preferences, setPreferences] = useState<TravelPreferences>({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    interests: "",
    includeTransportation: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="source" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-travel-primary" />
            Departure City
          </Label>
          <Input
            id="source"
            required
            value={preferences.source}
            onChange={(e) =>
              setPreferences({ ...preferences, source: e.target.value })
            }
            placeholder="e.g., New York"
            className="border-gray-200 focus:border-travel-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination" className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-travel-primary" />
            Destination
          </Label>
          <Input
            id="destination"
            required
            value={preferences.destination}
            onChange={(e) =>
              setPreferences({ ...preferences, destination: e.target.value })
            }
            placeholder="e.g., Paris"
            className="border-gray-200 focus:border-travel-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-travel-primary" />
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            required
            value={preferences.startDate}
            onChange={(e) =>
              setPreferences({ ...preferences, startDate: e.target.value })
            }
            className="border-gray-200 focus:border-travel-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-travel-primary" />
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            required
            value={preferences.endDate}
            onChange={(e) =>
              setPreferences({ ...preferences, endDate: e.target.value })
            }
            className="border-gray-200 focus:border-travel-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-travel-primary" />
            Budget
          </Label>
          <Input
            id="budget"
            required
            value={preferences.budget}
            onChange={(e) =>
              setPreferences({ ...preferences, budget: e.target.value })
            }
            placeholder="e.g., $5000"
            className="border-gray-200 focus:border-travel-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travelers" className="flex items-center gap-2">
            <Users className="w-4 h-4 text-travel-primary" />
            Number of Travelers
          </Label>
          <Input
            id="travelers"
            type="number"
            min="1"
            required
            value={preferences.travelers}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                travelers: parseInt(e.target.value),
              })
            }
            className="border-gray-200 focus:border-travel-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Preferences</Label>
        <Textarea
          id="interests"
          required
          value={preferences.interests}
          onChange={(e) =>
            setPreferences({ ...preferences, interests: e.target.value })
          }
          placeholder="e.g., historical sites, local cuisine, outdoor activities"
          className="h-24 border-gray-200 focus:border-travel-primary"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="includeTransportation"
          checked={preferences.includeTransportation}
          onCheckedChange={(checked) =>
            setPreferences({
              ...preferences,
              includeTransportation: checked as boolean,
            })
          }
        />
        <Label
          htmlFor="includeTransportation"
          className="text-sm font-medium leading-none text-gray-600"
        >
          Include transportation details
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-travel-primary hover:bg-travel-primary/90 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating Plan...
          </div>
        ) : (
          "Plan My Trip"
        )}
      </Button>
    </form>
  );
}
