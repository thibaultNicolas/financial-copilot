"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Separator } from "@/components/ui/separator";
import { useProfileStore } from "@/store/profile";
import { provinceEnum, filingStatusEnum } from "@/lib/validation/profileSchema";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  age: z.coerce.number().min(18).max(100),
  province: provinceEnum,
  filingStatus: filingStatusEnum,
  hasPartner: z.boolean(),
  partnerIncome: z.coerce.number().min(0).optional(),
  grossAnnualSalary: z.coerce.number().min(0, "Required"),
  employerName: z.string().min(1, "Required"),
  hasFreelance: z.boolean(),
  freelanceRevenue: z.coerce.number().min(0).optional(),
  hasGSTQST: z.boolean().optional(),
  expenseEquipment: z.coerce.number().min(0).optional(),
  expenseSoftware: z.coerce.number().min(0).optional(),
  expenseVehicle: z.coerce.number().min(0).optional(),
  expensePhone: z.coerce.number().min(0).optional(),
  expenseOther: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onNext: () => void;
};

export function Step1Income({ onNext }: Props) {
  const { profile, updateProfile } = useProfileStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      firstName: profile?.firstName ?? "",
      age: profile?.age ?? undefined,
      province: profile?.province ?? "QC",
      filingStatus: profile?.filingStatus ?? "SINGLE",
      hasPartner: profile?.hasPartner ?? false,
      partnerIncome: profile?.partnerIncome ?? 0,
      grossAnnualSalary:
        profile?.income?.employment?.grossAnnualSalary ?? undefined,
      employerName: profile?.income?.employment?.employerName ?? "",
      hasFreelance: !!profile?.income?.freelance,
      freelanceRevenue: profile?.income?.freelance?.estimatedAnnualRevenue ?? 0,
      hasGSTQST: profile?.income?.freelance?.hasGSTQSTRegistration ?? false,
      expenseEquipment:
        profile?.income?.freelance?.deductibleExpenses?.equipment ?? 0,
      expenseSoftware:
        profile?.income?.freelance?.deductibleExpenses?.software ?? 0,
      expenseVehicle:
        profile?.income?.freelance?.deductibleExpenses?.vehicle ?? 0,
      expensePhone: profile?.income?.freelance?.deductibleExpenses?.phone ?? 0,
      expenseOther: profile?.income?.freelance?.deductibleExpenses?.other ?? 0,
    },
  });

  const hasFreelance = watch("hasFreelance");
  const hasPartner = watch("hasPartner");

  const onSubmit = (data: FormData) => {
    updateProfile({
      firstName: data.firstName,
      age: data.age,
      province: data.province,
      filingStatus: data.filingStatus,
      hasPartner: data.hasPartner,
      partnerIncome: data.partnerIncome,
      income: {
        employment: {
          grossAnnualSalary: data.grossAnnualSalary,
          employerName: data.employerName,
          province: data.province,
        },
        freelance: data.hasFreelance
          ? {
              estimatedAnnualRevenue: data.freelanceRevenue ?? 0,
              hasGSTQSTRegistration: data.hasGSTQST ?? false,
              deductibleExpenses: {
                homeOffice: true,
                equipment: data.expenseEquipment ?? 0,
                software: data.expenseSoftware ?? 0,
                vehicle: data.expenseVehicle ?? 0,
                phone: data.expensePhone ?? 0,
                other: data.expenseOther ?? 0,
              },
            }
          : undefined,
      },
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input placeholder="Nicolas" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-xs text-red-400">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Age</Label>
            <Input type="number" placeholder="30" {...register("age")} />
            {errors.age && (
              <p className="text-xs text-red-400">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Province</Label>
            <Select
              defaultValue="QC"
              onValueChange={(v) => setValue("province", v as "QC")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Filing Status</Label>
            <Select
              defaultValue="SINGLE"
              onValueChange={(v) => setValue("filingStatus", v as "SINGLE")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Single</SelectItem>
                <SelectItem value="COMMON_LAW">Common Law</SelectItem>
                <SelectItem value="MARRIED">Married</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="hasPartner"
              className="w-4 h-4 accent-emerald-500"
              {...register("hasPartner")}
            />
            <Label htmlFor="hasPartner">I have a partner / spouse</Label>
          </div>

          {hasPartner && (
            <div className="col-span-2 space-y-2">
              <Label>Partner Annual Income ($)</Label>
              <Input
                type="number"
                placeholder="75000"
                {...register("partnerIncome")}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employment Income */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Employment Income</CardTitle>
          <CardDescription>Your T4 employment details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Employer Name</Label>
            <Input placeholder="Acme Corp" {...register("employerName")} />
            {errors.employerName && (
              <p className="text-xs text-red-400">
                {errors.employerName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gross Annual Salary ($)</Label>
            <Input
              type="number"
              placeholder="95000"
              {...register("grossAnnualSalary")}
            />
            {errors.grossAnnualSalary && (
              <p className="text-xs text-red-400">
                {errors.grossAnnualSalary.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Freelance Income */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">
            Freelance / Self-Employed Income
          </CardTitle>
          <CardDescription>
            Side contracts and self-employment revenue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasFreelance"
              className="w-4 h-4 accent-emerald-500"
              {...register("hasFreelance")}
            />
            <Label htmlFor="hasFreelance">
              I have freelance / self-employed income
            </Label>
          </div>

          {hasFreelance && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estimated Annual Revenue ($)</Label>
                  <Input
                    type="number"
                    placeholder="30000"
                    {...register("freelanceRevenue")}
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="hasGSTQST"
                    className="w-4 h-4 accent-emerald-500"
                    {...register("hasGSTQST")}
                  />
                  <Label htmlFor="hasGSTQST">GST/QST registered</Label>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                    Annual Deductible Expenses
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Equipment ($)", field: "expenseEquipment" },
                      { label: "Software ($)", field: "expenseSoftware" },
                      { label: "Vehicle ($)", field: "expenseVehicle" },
                      { label: "Phone ($)", field: "expensePhone" },
                      { label: "Other ($)", field: "expenseOther" },
                    ].map(({ label, field }) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-xs">{label}</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          {...register(field as keyof FormData)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        Continue to Accounts →
      </Button>
    </form>
  );
}
