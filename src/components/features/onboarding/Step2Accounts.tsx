"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/store/profile";
import type { Account } from "@/types";

// ============================================
// ACCOUNT TYPE CONFIG
// ============================================

const ACCOUNT_CONFIG: Record<
  Account["type"],
  { label: string; color: string; hasRoom: boolean }
> = {
  CELI: {
    label: "TFSA (CELI)",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    hasRoom: true,
  },
  REER: {
    label: "RRSP (REER)",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    hasRoom: true,
  },
  CRI: {
    label: "LIRA (CRI)",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    hasRoom: false,
  },
  FHSA: {
    label: "FHSA",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    hasRoom: true,
  },
  NON_REGISTERED: {
    label: "Non-Registered",
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    hasRoom: false,
  },
  CRYPTO: {
    label: "Crypto",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    hasRoom: false,
  },
};

// ============================================
// SCHEMA
// ============================================

const accountSchema = z.object({
  type: z.enum(["CELI", "REER", "CRI", "FHSA", "NON_REGISTERED", "CRYPTO"]),
  currentBalance: z.coerce.number().min(0, "Required"),
  contributionRoom: z.coerce.number().min(0).optional(),
  institution: z.string().optional(),
});

type AccountForm = z.infer<typeof accountSchema>;

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
    resolver: zodResolver(accountSchema),
    defaultValues: { type: "CELI", currentBalance: 0, contributionRoom: 0 },
  });

  const hasRoom = ACCOUNT_CONFIG[selectedType].hasRoom;

  // Add account to list
  const onAddAccount = (data: AccountForm) => {
    const newAccount: Account = {
      id: `account-${Date.now()}`,
      type: selectedType,
      currentBalance: data.currentBalance,
      contributionRoom: hasRoom ? data.contributionRoom : undefined,
      institution: data.institution || undefined,
    };
    setAccounts((prev) => [...prev, newAccount]);
    reset();
    setShowForm(false);
  };

  // Remove account from list
  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Save and go to next step
  const handleContinue = () => {
    updateProfile({ accounts });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Existing accounts list */}
      {accounts.length > 0 && (
        <div className="space-y-3">
          {accounts.map((account) => {
            const config = ACCOUNT_CONFIG[account.type];
            return (
              <Card key={account.id} className="border-border bg-card">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Badge className={config.color}>{config.label}</Badge>
                    <div>
                      <p className="text-sm font-semibold">
                        ${account.currentBalance.toLocaleString()}
                      </p>
                      {account.contributionRoom !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Room: ${account.contributionRoom.toLocaleString()}
                        </p>
                      )}
                      {account.institution && (
                        <p className="text-xs text-muted-foreground">
                          {account.institution}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAccount(account.id)}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {accounts.length === 0 && !showForm && (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              No accounts added yet. Add your registered and non-registered
              accounts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add account form */}
      {showForm && (
        <Card className="border-emerald-500/30 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Add Account</CardTitle>
            <CardDescription>Enter your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onAddAccount)} className="space-y-4">
              {/* Account type */}
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select
                  defaultValue="CELI"
                  onValueChange={(v) => setSelectedType(v as Account["type"])}
                >
                  <SelectTrigger>
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
                {/* Balance */}
                <div className="space-y-2">
                  <Label>Current Balance ($)</Label>
                  <Input
                    type="number"
                    placeholder="25000"
                    {...register("currentBalance")}
                  />
                  {errors.currentBalance && (
                    <p className="text-xs text-red-400">
                      {errors.currentBalance.message}
                    </p>
                  )}
                </div>

                {/* Contribution room */}
                {hasRoom && (
                  <div className="space-y-2">
                    <Label>Contribution Room ($)</Label>
                    <Input
                      type="number"
                      placeholder="7000"
                      {...register("contributionRoom")}
                    />
                  </div>
                )}

                {/* Institution */}
                <div className={hasRoom ? "col-span-2" : "col-span-1"}>
                  <div className="space-y-2">
                    <Label>Institution (optional)</Label>
                    <Input
                      placeholder="Wealthsimple, Desjardins..."
                      {...register("institution")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
                >
                  Add Account
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

      {/* Add account button */}
      {!showForm && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={accounts.length === 0}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40"
        >
          Continue to Real Estate →
        </Button>
      </div>
    </div>
  );
}
