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
import { useProfileStore } from "@/store/profile";
import { provinceEnum, filingStatusEnum } from "@/lib/validation/profileSchema";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";
const selectTriggerClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all h-auto min-h-[44px]";
const cardClass = "p-6 rounded-2xl border border-gray-100 bg-white space-y-4";
const sectionTitleClass = "text-base font-semibold text-gray-900";
const sectionSubtitleClass = "text-sm text-gray-400 mt-0.5";

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
      partnerIncome: profile?.partnerIncome ?? undefined,
      grossAnnualSalary:
        profile?.income?.employment?.grossAnnualSalary != null
          ? profile.income.employment.grossAnnualSalary
          : ("" as unknown as number),
      employerName: profile?.income?.employment?.employerName ?? "",
      hasFreelance: !!profile?.income?.freelance,
      freelanceRevenue: profile?.income?.freelance?.estimatedAnnualRevenue ?? undefined,
      hasGSTQST: profile?.income?.freelance?.hasGSTQSTRegistration ?? false,
      expenseEquipment:
        profile?.income?.freelance?.deductibleExpenses?.equipment ?? undefined,
      expenseSoftware:
        profile?.income?.freelance?.deductibleExpenses?.software ?? undefined,
      expenseVehicle:
        profile?.income?.freelance?.deductibleExpenses?.vehicle ?? undefined,
      expensePhone: profile?.income?.freelance?.deductibleExpenses?.phone ?? undefined,
      expenseOther: profile?.income?.freelance?.deductibleExpenses?.other ?? undefined,
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
      partnerIncome: Number(data.partnerIncome) || 0,
      income: {
        employment: {
          grossAnnualSalary: Number(data.grossAnnualSalary) || 0,
          employerName: data.employerName,
          province: data.province,
        },
        freelance: data.hasFreelance
          ? {
              estimatedAnnualRevenue: Number(data.freelanceRevenue) ?? 0,
              hasGSTQSTRegistration: data.hasGSTQST ?? false,
              deductibleExpenses: {
                homeOffice: true,
                equipment: Number(data.expenseEquipment) ?? 0,
                software: Number(data.expenseSoftware) ?? 0,
                vehicle: Number(data.expenseVehicle) ?? 0,
                phone: Number(data.expensePhone) ?? 0,
                other: Number(data.expenseOther) ?? 0,
              },
            }
          : undefined,
      },
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Personal Info */}
      <div className={cardClass}>
        <div>
          <h3 className={sectionTitleClass}>Personal Information</h3>
          <p className={sectionSubtitleClass}>Basic profile details</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className={labelClass}>First Name</Label>
            <Input
              placeholder="Nicolas"
              className={inputClass}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-400">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className={labelClass}>Age</Label>
            <Input
              type="number"
              placeholder="30"
              className={inputClass}
              {...register("age")}
            />
            {errors.age && (
              <p className="text-xs text-red-400">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className={labelClass}>Province</Label>
            <Select
              defaultValue="QC"
              onValueChange={(v) => setValue("province", v as "QC")}
            >
              <SelectTrigger className={selectTriggerClass}>
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

          <div className="space-y-1">
            <Label className={labelClass}>Filing Status</Label>
            <Select
              defaultValue="SINGLE"
              onValueChange={(v) => setValue("filingStatus", v as "SINGLE")}
            >
              <SelectTrigger className={selectTriggerClass}>
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
              className="w-4 h-4 accent-[var(--ws-green)]"
              {...register("hasPartner")}
            />
            <Label htmlFor="hasPartner" className="text-sm font-medium text-gray-700">
              I have a partner / spouse
            </Label>
          </div>

          {hasPartner && (
            <div className="col-span-2 space-y-1">
              <Label className={labelClass}>Partner Annual Income ($)</Label>
              <Input
                type="number"
                placeholder="75000"
                className={inputClass}
                {...register("partnerIncome")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Employment Income */}
      <div className={cardClass}>
        <div>
          <h3 className={sectionTitleClass}>Employment Income</h3>
          <p className={sectionSubtitleClass}>Your T4 employment details</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className={labelClass}>Employer Name</Label>
            <Input
              placeholder="Acme Corp"
              className={inputClass}
              {...register("employerName")}
            />
            {errors.employerName && (
              <p className="text-xs text-red-400">
                {errors.employerName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className={labelClass}>Gross Annual Salary ($)</Label>
            <Input
              type="number"
              placeholder="95000"
              className={inputClass}
              {...register("grossAnnualSalary")}
            />
            {errors.grossAnnualSalary && (
              <p className="text-xs text-red-400">
                {errors.grossAnnualSalary.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Freelance Income */}
      <div className={cardClass}>
        <div>
          <h3 className={sectionTitleClass}>
            Freelance / Self-Employed Income
          </h3>
          <p className={sectionSubtitleClass}>
            Side contracts and self-employment revenue
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasFreelance"
              className="w-4 h-4 accent-[var(--ws-green)]"
              {...register("hasFreelance")}
            />
            <Label htmlFor="hasFreelance" className="text-sm font-medium text-gray-700">
              I have freelance / self-employed income
            </Label>
          </div>

          {hasFreelance && (
            <>
              <div className="border-t border-gray-100 pt-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className={labelClass}>Estimated Annual Revenue ($)</Label>
                  <Input
                    type="number"
                    placeholder="30000"
                    className={inputClass}
                    {...register("freelanceRevenue")}
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="hasGSTQST"
                    className="w-4 h-4 accent-[var(--ws-green)]"
                    {...register("hasGSTQST")}
                  />
                  <Label htmlFor="hasGSTQST" className="text-sm font-medium text-gray-700">
                    GST/QST registered
                  </Label>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
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
                        <Label className={labelClass}>{label}</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className={inputClass}
                          {...register(field as keyof FormData)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-full py-4 font-semibold text-white hover:opacity-90 transition-all"
        style={{ background: "var(--ws-green)" }}
      >
        Continue to Accounts →
      </Button>
    </form>
  );
}
