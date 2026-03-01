"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
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
import type { Account } from "@/types";
import { accountTypeEnum } from "@/lib/validation/profileSchema";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";
const selectTriggerClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[var(--ws-green)] focus:bg-white transition-all h-auto min-h-[44px]";

const ACCOUNT_CONFIG: Record<
  Account["type"],
  { label: string; color: string; hasRoom: boolean }
> = {
  CELI: {
    label: "TFSA (CELI)",
    color: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    hasRoom: true,
  },
  REER: {
    label: "RRSP (REER)",
    color: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
    hasRoom: true,
  },
  CRI: {
    label: "LIRA (CRI)",
    color: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    hasRoom: false,
  },
  FHSA: {
    label: "FHSA",
    color: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    hasRoom: true,
  },
  NON_REGISTERED: {
    label: "Non-Registered",
    color: "bg-gray-500/10 text-gray-600 border border-gray-500/20",
    hasRoom: false,
  },
  CRYPTO: {
    label: "Crypto",
    color: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
    hasRoom: false,
  },
};

const accountFormSchema = z.object({
  type: accountTypeEnum,
  currentBalance: z.coerce.number().min(0, "Required"),
  contributionRoom: z.coerce.number().min(0).optional(),
  institution: z.string().optional(),
});

type AccountForm = z.infer<typeof accountFormSchema>;

function generateAccountId(): string {
  return `account-${Date.now()}`;
}

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function Step2Accounts({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useProfileStore();

  const [accounts, setAccounts] = useState<Account[]>(profile?.accounts ?? []);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<Account["type"]>("CELI");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountForm>({
    resolver: zodResolver(accountFormSchema) as Resolver<AccountForm>,
    defaultValues: { type: "CELI", currentBalance: 0, contributionRoom: 0 },
  });

  const hasRoom = ACCOUNT_CONFIG[selectedType].hasRoom;

  const onAddAccount = (data: AccountForm) => {
    const newAccount: Account = {
      id: generateAccountId(),
      type: selectedType,
      currentBalance: data.currentBalance,
      contributionRoom: hasRoom ? data.contributionRoom : undefined,
      institution: data.institution || undefined,
    };
    setAccounts((prev) => [...prev, newAccount]);
    reset();
    setShowForm(false);
  };

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleContinue = () => {
    updateProfile({ accounts });
    onNext();
  };

  return (
    <div className="space-y-4">
      {accounts.length > 0 && (
        <div className="space-y-3">
          {accounts.map((account) => {
            const config = ACCOUNT_CONFIG[account.type];
            return (
              <div
                key={account.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${config.color}`}
                  >
                    {config.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      ${account.currentBalance.toLocaleString()}
                    </p>
                    {account.contributionRoom !== undefined && (
                      <p className="text-xs text-gray-500">
                        Room: ${account.contributionRoom.toLocaleString()}
                      </p>
                    )}
                    {account.institution && (
                      <p className="text-xs text-gray-400">
                        {account.institution}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAccount(account.id)}
                  className="shrink-0 text-gray-400 hover:border-gray-200 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {accounts.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-sm text-gray-500">
            No accounts added yet. Add your registered and non-registered
            accounts.
          </p>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-base font-semibold text-gray-900 mb-0.5">
            Add Account
          </p>
          <p className="text-sm text-gray-400 mb-4">Enter your account details</p>
          <form onSubmit={handleSubmit(onAddAccount)} className="space-y-4">
            <div className="space-y-1">
              <Label className={labelClass}>Account Type</Label>
              <Select
                defaultValue="CELI"
                onValueChange={(v) => setSelectedType(v as Account["type"])}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_CONFIG).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className={labelClass}>Current Balance ($)</Label>
                <Input
                  type="number"
                  placeholder="25000"
                  className={inputClass}
                  {...register("currentBalance")}
                />
                {errors.currentBalance && (
                  <p className="text-xs text-red-400">
                    {errors.currentBalance.message}
                  </p>
                )}
              </div>

              {hasRoom && (
                <div className="space-y-1">
                  <Label className={labelClass}>Contribution Room ($)</Label>
                  <Input
                    type="number"
                    placeholder="7000"
                    className={inputClass}
                    {...register("contributionRoom")}
                  />
                </div>
              )}

              <div className={hasRoom ? "col-span-2" : "col-span-1"}>
                <div className="space-y-1">
                  <Label className={labelClass}>Institution (optional)</Label>
                  <Input
                    placeholder="Wealthsimple, Desjardins..."
                    className={inputClass}
                    {...register("institution")}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 rounded-full py-4 font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: "var(--ws-green)" }}
              >
                Add Account
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
          Add Account
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
          disabled={accounts.length === 0}
          className="flex-1 rounded-full py-4 font-semibold text-white hover:opacity-90 transition-all disabled:opacity-40"
          style={{ background: "var(--ws-green)" }}
        >
          Continue to Real Estate →
        </Button>
      </div>
    </div>
  );
}
