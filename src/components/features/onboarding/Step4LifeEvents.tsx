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
  Calendar,
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
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import type { LifeEvent } from "@/types";
import {
  lifeEventTypeEnum,
  priorityEnum,
} from "@/lib/validation/profileSchema";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";
const selectTriggerClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all h-auto min-h-[44px]";
const cardClass = "p-6 rounded-2xl border border-gray-100 bg-white space-y-4";
const sectionTitleClass = "text-base font-semibold text-gray-900";
const sectionSubtitleClass = "text-sm text-gray-400 mt-0.5";

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
    color: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
    defaultCost: 25000,
  },
  CHILD: {
    label: "Child",
    icon: <Baby className="w-4 h-4" />,
    color: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    defaultCost: 15000,
  },
  RENOVATION: {
    label: "Renovation",
    icon: <Hammer className="w-4 h-4" />,
    color: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    defaultCost: 50000,
  },
  TRAVEL: {
    label: "Travel",
    icon: <Plane className="w-4 h-4" />,
    color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    defaultCost: 8000,
  },
  CAR: {
    label: "Vehicle",
    icon: <Car className="w-4 h-4" />,
    color: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    defaultCost: 35000,
  },
  OTHER: {
    label: "Other",
    icon: <Sparkles className="w-4 h-4" />,
    color: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    defaultCost: 10000,
  },
};

const lifeEventFormSchema = z.object({
  type: lifeEventTypeEnum,
  label: z.string().min(1, "Required"),
  estimatedYear: z.coerce.number().min(2025).max(2050),
  estimatedCost: z.coerce.number().min(0),
  priority: priorityEnum,
});

type LifeEventForm = z.infer<typeof lifeEventFormSchema>;

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

function generateProfileId(): string {
  return `profile-${Date.now()}`;
}

function getIsoNow(): string {
  return new Date().toISOString();
}

type Props = {
  onBack: () => void;
};

export function Step4LifeEvents({ onBack }: Props) {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>(
    profile?.lifeEvents ?? [],
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] =
    useState<LifeEvent["type"]>("MARRIAGE");

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

  const {
    register: registerBudget,
    handleSubmit: handleBudgetSubmit,
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

  const removeEvent = (index: number) => {
    setLifeEvents((prev) => prev.filter((_, i) => i !== index));
  };

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
    <div className="space-y-4">
      {/* Life Events Section */}
      <div className="space-y-3">
        <div>
          <h3 className={sectionTitleClass}>Upcoming Life Events</h3>
          <p className={sectionSubtitleClass}>
            Add major expenses you&apos;re planning in the next few years
          </p>
        </div>

        {lifeEvents.map((event, index) => {
          const config = EVENT_CONFIG[event.type];
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.color}`}
                >
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {event.label}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-500">{event.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {event.estimatedYear} · $
                    {event.estimatedCost.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEvent(index)}
                className="shrink-0 text-gray-400 hover:border-gray-200 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        {lifeEvents.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-10">
            <Calendar className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-500">No life events added yet</p>
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className={sectionTitleClass}>Add Life Event</p>
            <p className={sectionSubtitleClass}>
              Plan a major upcoming expense
            </p>
            <form
              onSubmit={handleEventSubmit(onAddEvent)}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className={labelClass}>Event Type</Label>
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
                    <SelectTrigger className={selectTriggerClass}>
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

                <div className="space-y-1">
                  <Label className={labelClass}>Label</Label>
                  <Input
                    placeholder="Wedding in Charlevoix"
                    className={inputClass}
                    {...registerEvent("label")}
                  />
                  {eventErrors.label && (
                    <p className="text-xs text-red-400">
                      {eventErrors.label.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className={labelClass}>Estimated Year</Label>
                  <Input
                    type="number"
                    placeholder="2027"
                    className={inputClass}
                    {...registerEvent("estimatedYear")}
                  />
                </div>

                <div className="space-y-1">
                  <Label className={labelClass}>Estimated Cost ($)</Label>
                  <Input
                    type="number"
                    className={inputClass}
                    {...registerEvent("estimatedCost")}
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label className={labelClass}>Priority</Label>
                  <Select
                    defaultValue="HIGH"
                    onValueChange={(v) =>
                      setEventValue("priority", v as "HIGH")
                    }
                  >
                    <SelectTrigger className={selectTriggerClass}>
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
                  className="flex-1 rounded-full py-4 font-semibold text-white hover:opacity-90 transition-all"
                  style={{ background: "var(--ws-green)" }}
                >
                  Add Event
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-gray-200 py-4 text-gray-600 hover:border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-dashed py-4 transition-all"
            style={{
              borderColor: "var(--ws-green)",
              color: "var(--ws-green)",
            }}
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Life Event
          </Button>
        )}
      </div>

      {/* Monthly Budget + Family + Nav */}
      <form onSubmit={handleBudgetSubmit(onFinalSubmit)} className="space-y-4">
        <div className={cardClass}>
          <div>
            <h3 className={sectionTitleClass}>Monthly Budget</h3>
            <p className={sectionSubtitleClass}>
              Your typical monthly spending
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Fixed Expenses ($)",
                field: "fixedExpenses" as const,
                placeholder: "2800",
              },
              {
                label: "Variable Expenses ($)",
                field: "variableExpenses" as const,
                placeholder: "1500",
              },
              {
                label: "Sports & Hobbies ($)",
                field: "sportsHobbies" as const,
                placeholder: "300",
              },
              {
                label: "Travel ($)",
                field: "travel" as const,
                placeholder: "400",
              },
              {
                label: "Pet Care ($)",
                field: "petCare" as const,
                placeholder: "150",
              },
              {
                label: "Other ($)",
                field: "other" as const,
                placeholder: "200",
              },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="space-y-1">
                <Label className={labelClass}>{label}</Label>
                <Input
                  type="number"
                  placeholder={placeholder}
                  className={inputClass}
                  {...registerBudget(field)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <h3 className={sectionTitleClass}>Family Planning</h3>
            <p className={sectionSubtitleClass}>
              Current and planned children
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className={labelClass}>Current Children</Label>
              <Input
                type="number"
                placeholder="0"
                className={inputClass}
                {...registerBudget("numberOfChildren")}
              />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Planned Children</Label>
              <Input
                type="number"
                placeholder="2"
                className={inputClass}
                {...registerBudget("plannedChildren")}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 rounded-full border border-gray-200 py-4 text-gray-600 hover:border-gray-300"
          >
            ← Back
          </Button>
          <Button
            type="submit"
            className="btn-generate-shimmer w-full rounded-full py-5 text-base font-semibold text-white transition-all"
            style={{ background: "var(--ws-green)" }}
          >
            Generate My Recommendations →
          </Button>
        </div>
      </form>
    </div>
  );
}
