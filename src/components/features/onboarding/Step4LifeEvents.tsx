"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Heart,
  Baby,
  Hammer,
  Plane,
  Car,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import type { LifeEvent } from "@/types";
import {
  lifeEventTypeEnum,
  priorityEnum,
} from "@/lib/validation/profileSchema";

// ============================================
// LIFE EVENT CONFIG
// ============================================

const EVENT_CONFIG: Record<
  LifeEvent["type"],
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    defaultCost: number;
  }
> = {
  MARRIAGE: {
    label: "Marriage",
    icon: <Heart className="w-4 h-4" />,
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    defaultCost: 25000,
  },
  CHILD: {
    label: "Child",
    icon: <Baby className="w-4 h-4" />,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    defaultCost: 15000,
  },
  RENOVATION: {
    label: "Renovation",
    icon: <Hammer className="w-4 h-4" />,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    defaultCost: 50000,
  },
  TRAVEL: {
    label: "Travel",
    icon: <Plane className="w-4 h-4" />,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    defaultCost: 8000,
  },
  CAR: {
    label: "Vehicle",
    icon: <Car className="w-4 h-4" />,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    defaultCost: 35000,
  },
  OTHER: {
    label: "Other",
    icon: <Sparkles className="w-4 h-4" />,
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    defaultCost: 10000,
  },
};

// ============================================
// SCHEMA
// ============================================

const lifeEventFormSchema = z.object({
  type: lifeEventTypeEnum,
  label: z.string().min(1, "Required"),
  estimatedYear: z.coerce.number().min(2025).max(2050),
  estimatedCost: z.coerce.number().min(0),
  priority: priorityEnum,
});

type LifeEventForm = z.infer<typeof lifeEventFormSchema>;

// ============================================
// MONTHLY BUDGET SCHEMA
// ============================================

const budgetSchema = z.object({
  fixedExpenses: z.coerce.number().min(0),
  variableExpenses: z.coerce.number().min(0),
  sportsHobbies: z.coerce.number().min(0),
  travel: z.coerce.number().min(0),
  petCare: z.coerce.number().min(0),
  other: z.coerce.number().min(0),
  numberOfChildren: z.coerce.number().min(0),
  plannedChildren: z.coerce.number().min(0),
});

type BudgetForm = z.infer<typeof budgetSchema>;

/** Generate a unique profile id (used in event handlers only, not during render). */
function generateProfileId(): string {
  return `profile-${Date.now()}`;
}

/** Return current ISO timestamp (used in event handlers only, not during render). */
function getIsoNow(): string {
  return new Date().toISOString();
}

// ============================================
// PROPS
// ============================================

type Props = {
  onBack: () => void;
};

// ============================================
// COMPONENT
// ============================================

export function Step4LifeEvents({ onBack }: Props) {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>(
    profile?.lifeEvents ?? [],
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] =
    useState<LifeEvent["type"]>("MARRIAGE");

  // Life event form
  const {
    register: registerEvent,
    handleSubmit: handleEventSubmit,
    reset: resetEvent,
    setValue: setEventValue,
    formState: { errors: eventErrors },
  } = useForm<LifeEventForm>({
    resolver: zodResolver(lifeEventFormSchema) as Resolver<LifeEventForm>,
    defaultValues: {
      type: "MARRIAGE",
      label: "",
      estimatedYear: 2027,
      estimatedCost: EVENT_CONFIG["MARRIAGE"].defaultCost,
      priority: "HIGH",
    },
  });

  // Budget form
  const {
    register: registerBudget,
    handleSubmit: handleBudgetSubmit,
    formState: { errors: budgetErrors },
  } = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema) as Resolver<BudgetForm>,
    defaultValues: {
      fixedExpenses: profile?.monthlyBudget?.fixedExpenses ?? 0,
      variableExpenses: profile?.monthlyBudget?.variableExpenses ?? 0,
      sportsHobbies: profile?.monthlyBudget?.sportsHobbies ?? 0,
      travel: profile?.monthlyBudget?.travel ?? 0,
      petCare: profile?.monthlyBudget?.petCare ?? 0,
      other: profile?.monthlyBudget?.other ?? 0,
      numberOfChildren: profile?.numberOfChildren ?? 0,
      plannedChildren: profile?.plannedChildren ?? 0,
    },
  });

  // Add life event
  const onAddEvent = (data: LifeEventForm) => {
    const newEvent: LifeEvent = {
      type: selectedType,
      label: data.label,
      estimatedYear: data.estimatedYear,
      estimatedCost: data.estimatedCost,
      priority: data.priority,
    };
    setLifeEvents((prev) => [...prev, newEvent]);
    resetEvent();
    setShowForm(false);
  };

  // Remove life event
  const removeEvent = (index: number) => {
    setLifeEvents((prev) => prev.filter((_, i) => i !== index));
  };

  // Final submit — save everything and go to dashboard
  const onFinalSubmit = (budgetData: BudgetForm) => {
    updateProfile({
      lifeEvents,
      monthlyBudget: {
        fixedExpenses: budgetData.fixedExpenses,
        variableExpenses: budgetData.variableExpenses,
        sportsHobbies: budgetData.sportsHobbies,
        travel: budgetData.travel,
        petCare: budgetData.petCare,
        other: budgetData.other,
      },
      numberOfChildren: budgetData.numberOfChildren,
      plannedChildren: budgetData.plannedChildren,
      id: profile?.id ?? generateProfileId(),
      createdAt: profile?.createdAt ?? getIsoNow(),
      updatedAt: getIsoNow(),
    });

    toast.success("Profile saved! Generating your recommendations...");
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      {/* Life Events Section */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Upcoming Life Events</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add major expenses you&apos;re planning in the next few years
          </p>
        </div>

        {/* Events list */}
        {lifeEvents.map((event, index) => {
          const config = EVENT_CONFIG[event.type];
          return (
            <Card key={index} className="onboarding-card">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {event.label}
                      </span>
                      <Badge className={config.color}>{config.label}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.estimatedYear} · $
                      {event.estimatedCost.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEvent(index)}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Add event form */}
        {showForm && (
          <Card className="border-emerald-500/30 bg-card">
            <CardHeader>
              <CardTitle className="text-base">Add Life Event</CardTitle>
              <CardDescription>Plan a major upcoming expense</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleEventSubmit(onAddEvent)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select
                      defaultValue="MARRIAGE"
                      onValueChange={(v) => {
                        const type = v as LifeEvent["type"];
                        setSelectedType(type);
                        setEventValue(
                          "estimatedCost",
                          EVENT_CONFIG[type].defaultCost,
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_CONFIG).map(([type, config]) => (
                          <SelectItem key={type} value={type}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      placeholder="Wedding in Charlevoix"
                      {...registerEvent("label")}
                    />
                    {eventErrors.label && (
                      <p className="text-xs text-red-400">
                        {eventErrors.label.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Year</Label>
                    <Input
                      type="number"
                      placeholder="2027"
                      {...registerEvent("estimatedYear")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Cost ($)</Label>
                    <Input type="number" {...registerEvent("estimatedCost")} />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Priority</Label>
                    <Select
                      defaultValue="HIGH"
                      onValueChange={(v) =>
                        setEventValue("priority", v as "HIGH")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH">High — Must happen</SelectItem>
                        <SelectItem value="MEDIUM">Medium — Likely</SelectItem>
                        <SelectItem value="LOW">Low — Nice to have</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 text-white font-semibold py-6 rounded-full hover:opacity-90 transition-all"
                    style={{ background: "var(--ws-green)" }}
                  >
                    Add Event
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="rounded-full hover:opacity-90 transition-all"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {!showForm && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:opacity-90 transition-all"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Life Event
          </Button>
        )}
      </div>

      {/* Monthly Budget Section */}
      <form onSubmit={handleBudgetSubmit(onFinalSubmit)} className="space-y-6">
        <Card className="onboarding-card">
          <CardHeader>
            <CardTitle className="text-base">Monthly Budget</CardTitle>
            <CardDescription>Your typical monthly spending</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Fixed Expenses ($)",
                field: "fixedExpenses",
                placeholder: "2800",
              },
              {
                label: "Variable Expenses ($)",
                field: "variableExpenses",
                placeholder: "1500",
              },
              {
                label: "Sports & Hobbies ($)",
                field: "sportsHobbies",
                placeholder: "300",
              },
              { label: "Travel ($)", field: "travel", placeholder: "400" },
              { label: "Pet Care ($)", field: "petCare", placeholder: "150" },
              { label: "Other ($)", field: "other", placeholder: "200" },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  type="number"
                  placeholder={placeholder}
                  {...registerBudget(field as keyof BudgetForm)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Family Planning */}
        <Card className="onboarding-card">
          <CardHeader>
            <CardTitle className="text-base">Family Planning</CardTitle>
            <CardDescription>Current and planned children</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Children</Label>
              <Input
                type="number"
                placeholder="0"
                {...registerBudget("numberOfChildren")}
              />
            </div>
            <div className="space-y-2">
              <Label>Planned Children</Label>
              <Input
                type="number"
                placeholder="2"
                {...registerBudget("plannedChildren")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 rounded-full font-semibold py-6 hover:opacity-90 transition-all"
          >
            ← Back
          </Button>
          <Button
            type="submit"
            className="flex-1 text-white font-semibold py-6 rounded-full hover:opacity-90 transition-all"
            style={{ background: "var(--ws-green)" }}
          >
            Generate My Recommendations →
          </Button>
        </div>
      </form>
    </div>
  );
}
