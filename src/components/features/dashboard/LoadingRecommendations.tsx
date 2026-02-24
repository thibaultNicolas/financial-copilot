"use client";

import { motion } from "framer-motion";

const STEPS = [
  "Analyzing your income sources...",
  "Calculating tax optimization opportunities...",
  "Evaluating contribution room across accounts...",
  "Assessing life event impact on cash flow...",
  "Generating prioritized recommendations...",
];

export function LoadingRecommendations() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      {/* Hero loading block */}
      <div className="flex flex-col items-center justify-center py-8">
        {/* Animated orb + ring */}
        <div className="relative mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "var(--ws-green)",
              borderRightColor: "var(--ws-green-light)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: "var(--ws-green)",
              borderLeftColor: "var(--ws-green-light)",
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--ws-green-light) 0%, white 50%, var(--ws-green-light) 100%)",
              boxShadow:
                "0 0 0 1px rgba(0,208,148,0.1), 0 8px 24px rgba(0,208,148,0.12)",
            }}
            animate={{
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 0 0 1px rgba(0,208,148,0.1), 0 8px 24px rgba(0,208,148,0.12)",
                "0 0 0 2px rgba(0,208,148,0.15), 0 12px 32px rgba(0,208,148,0.18)",
                "0 0 0 1px rgba(0,208,148,0.1), 0 8px 24px rgba(0,208,148,0.12)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-3xl" aria-hidden>
              🧠
            </span>
          </motion.div>
        </div>

        <motion.h2
          className="text-xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Analyzing your financial profile
        </motion.h2>
        <motion.p
          className="text-sm text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          GPT-4o is reviewing your complete situation
        </motion.p>

        {/* Step list with stagger */}
        <ul className="mt-8 space-y-3 w-full max-w-sm">
          {STEPS.map((step, index) => (
            <motion.li
              key={step}
              className="flex items-center gap-3 text-sm text-gray-500"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.5 + index * 0.12,
                duration: 0.35,
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "var(--ws-green)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
              {step}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Skeleton cards — mimic RecommendationCard layout */}
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-6 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6 + i * 0.15,
              duration: 0.4,
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 max-w-[200px] rounded-md bg-gray-100 animate-shimmer" />
                  <div className="h-3 w-20 rounded-full bg-gray-100 animate-shimmer" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-md bg-gray-100 animate-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-100 animate-shimmer" />
              <div className="h-3 w-4/5 rounded bg-gray-100 animate-shimmer" />
              <div className="h-3 w-2/3 rounded bg-gray-100 animate-shimmer" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-24 rounded-full bg-gray-100 animate-shimmer" />
              <div className="h-6 w-20 rounded-full bg-gray-100 animate-shimmer" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
