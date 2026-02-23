"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/store/profile";
import type { RealEstate } from "@/types";

// ============================================
// SCHEMA
// ============================================

const realEstateSchema = z.object({
  type: z.enum(["PRIMARY_RESIDENCE", "RENTAL"]),
  estimatedValue: z.coerce.number().min(1, "Required"),
  mortgageBalance: z.coerce.number().min(0),
  mortgageRate: z.coerce.number().min(0).max(20),
  mortgageMaturityDate: z.string().optional(),
  isOwnerOccupied: z.boolean(),
  // Rental specific
  units: z.coerce.number().min(1).optional(),
  monthlyRentPerUnit: z.coerce.number().min(0).optional(),
  mortgageInterestAnnual: z.coerce.number().min(0).optional(),
  propertyTaxAnnual: z.coerce.number().min(0).optional(),
  insuranceAnnual: z.coerce.number().min(0).optional(),
  maintenanceAnnual: z.coerce.number().min(0).optional(),
});

type RealEstateForm = z.infer<typeof realEstateSchema>;

// ============================================
// PROPS
// ============================================

type Props = {
  onNext: () => void;
  onBack: () => void;
};

// ============================================
// COMPONENT
// ============================================

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
    resolver: zodResolver(realEstateSchema),
    defaultValues: {
      type: "PRIMARY_RESIDENCE",
      estimatedValue: 0,
      mortgageBalance: 0,
      mortgageRate: 0,
      isOwnerOccupied: true,
    },
  });

  const isRental = selectedType === "RENTAL";

  // Add property
  const onAddProperty = (data: RealEstateForm) => {
    const newProperty: RealEstate = {
      id: `property-${Date.now()}`,
      type: selectedType,
      estimatedValue: data.estimatedValue,
      mortgageBalance: data.mortgageBalance,
      mortgageRate: data.mortgageRate,
      mortgageMaturityDate: data.mortgageMaturityDate || undefined,
      isOwnerOccupied: selectedType === "PRIMARY_RESIDENCE",
    };

    // If rental, also save to income
    if (isRental) {
      updateProfile({
        income: {
          ...profile?.income!,
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

  // Remove property
  const removeProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // Save and continue
  const handleContinue = () => {
    updateProfile({ realEstate: properties });
    onNext();
  };

  // Equity calculation helper
  const equity = (p: RealEstate) => p.estimatedValue - p.mortgageBalance;

  return (
    <div className="space-y-6">
      {/* Properties list */}
      {properties.length > 0 && (
        <div className="space-y-3">
          {properties.map((property) => (
            <Card key={property.id} className="border-border bg-card">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  {property.type === "PRIMARY_RESIDENCE" ? (
                    <Home className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Building2 className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          property.type === "PRIMARY_RESIDENCE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }
                      >
                        {property.type === "PRIMARY_RESIDENCE"
                          ? "Primary Residence"
                          : "Rental Property"}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold mt-1">
                      Value: ${property.estimatedValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mortgage: ${property.mortgageBalance.toLocaleString()} @{" "}
                      {property.mortgageRate}% · Equity: $
                      {equity(property).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProperty(property.id)}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {properties.length === 0 && !showForm && (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No properties added yet. Add your primary residence or rental
              properties.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add property form */}
      {showForm && (
        <Card className="border-emerald-500/30 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Add Property</CardTitle>
            <CardDescription>Enter your property details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onAddProperty)} className="space-y-4">
              {/* Property type */}
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  defaultValue="PRIMARY_RESIDENCE"
                  onValueChange={(v) =>
                    setSelectedType(v as RealEstate["type"])
                  }
                >
                  <SelectTrigger>
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

              {/* Basic details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estimated Value ($)</Label>
                  <Input
                    type="number"
                    placeholder="550000"
                    {...register("estimatedValue")}
                  />
                  {errors.estimatedValue && (
                    <p className="text-xs text-red-400">
                      {errors.estimatedValue.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Mortgage Balance ($)</Label>
                  <Input
                    type="number"
                    placeholder="380000"
                    {...register("mortgageBalance")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mortgage Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="4.99"
                    {...register("mortgageRate")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maturity Date (optional)</Label>
                  <Input type="date" {...register("mortgageMaturityDate")} />
                </div>
              </div>

              {/* Rental specific fields */}
              {isRental && (
                <>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pt-2">
                    Rental Income & Expenses
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number of Units</Label>
                      <Input
                        type="number"
                        placeholder="3"
                        {...register("units")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Monthly Rent / Unit ($)</Label>
                      <Input
                        type="number"
                        placeholder="1400"
                        {...register("monthlyRentPerUnit")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mortgage Interest / Year ($)</Label>
                      <Input
                        type="number"
                        placeholder="18000"
                        {...register("mortgageInterestAnnual")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Property Tax / Year ($)</Label>
                      <Input
                        type="number"
                        placeholder="4500"
                        {...register("propertyTaxAnnual")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Insurance / Year ($)</Label>
                      <Input
                        type="number"
                        placeholder="2400"
                        {...register("insuranceAnnual")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Maintenance / Year ($)</Label>
                      <Input
                        type="number"
                        placeholder="3000"
                        {...register("maintenanceAnnual")}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
                >
                  Add Property
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add property button */}
      {!showForm && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Continue to Life Events →
        </Button>
      </div>
    </div>
  );
}
