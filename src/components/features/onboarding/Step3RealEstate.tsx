"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Home, Building2 } from "lucide-react";
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
import { useProfileStore } from "@/store/profile";
import type { RealEstate } from "@/types";
import { realEstateTypeEnum } from "@/lib/validation/profileSchema";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";
const selectTriggerClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all h-auto min-h-[44px]";

const realEstateFormSchema = z.object({
  type: realEstateTypeEnum,
  estimatedValue: z.coerce.number().min(1, "Required"),
  mortgageBalance: z.coerce.number().min(0),
  mortgageRate: z.coerce.number().min(0).max(20),
  mortgageMaturityDate: z.string().optional(),
  isOwnerOccupied: z.boolean(),
  units: z.coerce.number().min(1).optional(),
  monthlyRentPerUnit: z.coerce.number().min(0).optional(),
  mortgageInterestAnnual: z.coerce.number().min(0).optional(),
  propertyTaxAnnual: z.coerce.number().min(0).optional(),
  insuranceAnnual: z.coerce.number().min(0).optional(),
  maintenanceAnnual: z.coerce.number().min(0).optional(),
});

type RealEstateForm = z.infer<typeof realEstateFormSchema>;

function generatePropertyId(): string {
  return `property-${Date.now()}`;
}

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function Step3RealEstate({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useProfileStore();

  const [properties, setProperties] = useState<RealEstate[]>(
    profile?.realEstate ?? [],
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] =
    useState<RealEstate["type"]>("PRIMARY_RESIDENCE");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RealEstateForm>({
    resolver: zodResolver(realEstateFormSchema) as Resolver<RealEstateForm>,
    defaultValues: {
      type: "PRIMARY_RESIDENCE",
      estimatedValue: 0,
      mortgageBalance: 0,
      mortgageRate: 0,
      isOwnerOccupied: true,
    },
  });

  const isRental = selectedType === "RENTAL";

  const onAddProperty = (data: RealEstateForm) => {
    const newProperty: RealEstate = {
      id: generatePropertyId(),
      type: selectedType,
      estimatedValue: data.estimatedValue,
      mortgageBalance: data.mortgageBalance,
      mortgageRate: data.mortgageRate,
      mortgageMaturityDate: data.mortgageMaturityDate || undefined,
      isOwnerOccupied: selectedType === "PRIMARY_RESIDENCE",
    };

    if (isRental && profile?.income) {
      updateProfile({
        income: {
          ...profile.income,
          rental: {
            units: data.units ?? 1,
            monthlyRentPerUnit: data.monthlyRentPerUnit ?? 0,
            mortgageInterestAnnual: data.mortgageInterestAnnual ?? 0,
            propertyTaxAnnual: data.propertyTaxAnnual ?? 0,
            insuranceAnnual: data.insuranceAnnual ?? 0,
            maintenanceAnnual: data.maintenanceAnnual ?? 0,
            isOwnerOccupied: false,
          },
        },
      });
    }

    setProperties((prev) => [...prev, newProperty]);
    reset();
    setShowForm(false);
  };

  const removeProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const handleContinue = () => {
    updateProfile({ realEstate: properties });
    onNext();
  };

  const equity = (p: RealEstate) => p.estimatedValue - p.mortgageBalance;

  return (
    <div className="space-y-4">
      {properties.length > 0 && (
        <div className="space-y-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {property.type === "PRIMARY_RESIDENCE" ? (
                  <Home className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <Building2 className="h-5 w-5 shrink-0 text-blue-500" />
                )}
                <div className="min-w-0">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                      property.type === "PRIMARY_RESIDENCE"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    }`}
                  >
                    {property.type === "PRIMARY_RESIDENCE"
                      ? "Primary Residence"
                      : "Rental Property"}
                  </span>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    Value: ${property.estimatedValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Mortgage: ${property.mortgageBalance.toLocaleString()} @{" "}
                    {property.mortgageRate}%
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--ws-green-dark)" }}
                  >
                    Equity: ${equity(property).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProperty(property.id)}
                className="shrink-0 text-gray-400 hover:border-gray-200 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {properties.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm text-gray-500">
            No properties added yet. Add your primary residence or rental
            properties.
          </p>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-base font-semibold text-gray-900 mb-0.5">
            Add Property
          </p>
          <p className="text-sm text-gray-400 mb-4">Enter your property details</p>
          <form onSubmit={handleSubmit(onAddProperty)} className="space-y-4">
            <div className="space-y-1">
              <Label className={labelClass}>Property Type</Label>
              <Select
                defaultValue="PRIMARY_RESIDENCE"
                onValueChange={(v) =>
                  setSelectedType(v as RealEstate["type"])
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARY_RESIDENCE">
                    Primary Residence
                  </SelectItem>
                  <SelectItem value="RENTAL">Rental Property</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className={labelClass}>Estimated Value ($)</Label>
                <Input
                  type="number"
                  placeholder="550000"
                  className={inputClass}
                  {...register("estimatedValue")}
                />
                {errors.estimatedValue && (
                  <p className="text-xs text-red-400">
                    {errors.estimatedValue.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className={labelClass}>Mortgage Balance ($)</Label>
                <Input
                  type="number"
                  placeholder="380000"
                  className={inputClass}
                  {...register("mortgageBalance")}
                />
              </div>

              <div className="space-y-1">
                <Label className={labelClass}>Mortgage Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="4.99"
                  className={inputClass}
                  {...register("mortgageRate")}
                />
              </div>

              <div className="space-y-1">
                <Label className={labelClass}>Maturity Date (optional)</Label>
                <Input
                  type="date"
                  className={inputClass}
                  {...register("mortgageMaturityDate")}
                />
              </div>
            </div>

            {isRental && (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 pt-2">
                  Rental Income & Expenses
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Number of Units",
                      field: "units" as const,
                      placeholder: "3",
                    },
                    {
                      label: "Monthly Rent / Unit ($)",
                      field: "monthlyRentPerUnit" as const,
                      placeholder: "1400",
                    },
                    {
                      label: "Mortgage Interest / Year ($)",
                      field: "mortgageInterestAnnual" as const,
                      placeholder: "18000",
                    },
                    {
                      label: "Property Tax / Year ($)",
                      field: "propertyTaxAnnual" as const,
                      placeholder: "4500",
                    },
                    {
                      label: "Insurance / Year ($)",
                      field: "insuranceAnnual" as const,
                      placeholder: "2400",
                    },
                    {
                      label: "Maintenance / Year ($)",
                      field: "maintenanceAnnual" as const,
                      placeholder: "3000",
                    },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field} className="space-y-1">
                      <Label className={labelClass}>{label}</Label>
                      <Input
                        type="number"
                        placeholder={placeholder}
                        className={inputClass}
                        {...register(field)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 rounded-full py-4 font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: "var(--ws-green)" }}
              >
                Add Property
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
          Add Property
        </Button>
      )}

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
          type="button"
          onClick={handleContinue}
          className="flex-1 rounded-full py-4 font-semibold text-white hover:opacity-90 transition-all"
          style={{ background: "var(--ws-green)" }}
        >
          Continue to Life Events →
        </Button>
      </div>
    </div>
  );
}
