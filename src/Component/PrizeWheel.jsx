// src/Components/PrizeWheel.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Gift,
  Ticket,
  Sparkles,
  Percent,
  Smile,
  X,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";

// Configurable Prize Items
const PRIZES = [
  { id: 1, label: "10% OFF", type: "discount", color: "#6366F1", icon: Percent, code: "SAVE10" },
  { id: 2, label: "Free Shipping", type: "perk", color: "#8B5CF6", icon: Sparkles, code: "FREESHIP" },
  { id: 3, label: "$20 Voucher", type: "voucher", color: "#EC4899", icon: Ticket, code: "VOUCHER20" },
  { id: 4, label: "Try Again", type: "none", color: "#64748B", icon: Smile, code: null },
  { id: 5, label: "25% OFF", type: "discount", color: "#10B981", icon: Percent, code: "MEGA25" },
  { id: 6, label: "Free Gift", type: "gift", color: "#F59E0B", icon: Gift, code: "MYSTERYGIFT" },
  { id: 7, label: "$5 Voucher", type: "voucher", color: "#3B82F6", icon: Ticket, code: "TAKE5" },
  { id: 8, label: "Hard Luck", type: "none", color: "#475569", icon: Smile, code: null },
];

const LOCAL_STORAGE_KEY = "ecommerce_prize_wheel_last_spin";

const PrizeWheel = ({ isOpen = true, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningPrize, setWinningPrize] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinDate, setNextSpinDate] = useState(null);
  const [copied, setCopied] = useState(false);

  // Check 1-Spin-Per-Month Lock Status
  useEffect(() => {
    const lastSpinTimestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastSpinTimestamp) {
      const lastDate = new Date(parseInt(lastSpinTimestamp, 10));
      const now = new Date();

      // Lock if spun during the same calendar month & year
      const isSameMonth =
        lastDate.getMonth() === now.getMonth() &&
        lastDate.getFullYear() === now.getFullYear();

      if (isSameMonth) {
        setCanSpin(false);
        // Set next spin date to 1st day of next month
        const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        setNextSpinDate(firstOfNextMonth);
      }
    }
  }, []);

  // Trigger celebration particle effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
    });
  };

  // Wheel Spin Logic
  const handleSpin = () => {
    if (!canSpin || spinning) return;

    setSpinning(true);

    // Pick a random prize index
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];

    // Math calculations: Slice angle = 360 / items count
    const numSlices = PRIZES.length;
    const sliceAngle = 360 / numSlices;

    // Calculate rotation to align the slice center with top pointer (270deg offset)
    const extraRotations = 5 * 360; // 5 full rotational loops
    const prizeCenterAngle = prizeIndex * sliceAngle + sliceAngle / 2;
    const targetDegree = extraRotations + (360 - prizeCenterAngle);

    setRotation(targetDegree);

    // Handle spin completion state
    setTimeout(() => {
      setSpinning(false);
      setWinningPrize(prize);

      // Lock user for the current month
      const now = new Date();
      localStorage.setItem(LOCAL_STORAGE_KEY, now.getTime().toString());
      setCanSpin(false);

      const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      setNextSpinDate(firstOfNextMonth);

      if (prize.type !== "none") {
        triggerConfetti();
      }
    }, 5000); // Duration matches CSS transition (5 seconds)
  };

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="relative flex min-h-[calc(100vh-192px)] w-full flex-1 items-center justify-center bg-gray-950 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-white text-center"
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/50 hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Monthly Reward Pool
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">Spin & Win Rewards</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Test your luck to win exclusive discounts, gifts, and promo vouchers!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
          {/* Top Wheel Pointer/Indicator */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />

          {/* Glowing Wheel Backdrop Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />

          {/* Rotating SVG Wheel */}
          <div
            className="w-full h-full rounded-full shadow-2xl relative overflow-hidden border-4 border-gray-800"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 5s cubic-bezier(0.15, 0.9, 0.2, 1)" : "none",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {PRIZES.map((prize, i) => {
                const sliceAngle = 360 / PRIZES.length;
                const startAngle = i * sliceAngle;
                const endAngle = (i + 1) * sliceAngle;

                // SVG Path Math for Pie Slices
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                // Calculate angle position for prize label text
                const textAngle = startAngle + sliceAngle / 2;
                const textRad = (Math.PI * textAngle) / 180;
                const textX = 50 + 32 * Math.cos(textRad);
                const textY = 50 + 32 * Math.sin(textRad);

                return (
                  <g key={prize.id}>
                    <path d={pathData} fill={prize.color} opacity={0.9} />
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <button
            onClick={handleSpin}
            disabled={!canSpin || spinning}
            className="absolute z-10 w-16 h-16 rounded-full bg-gray-900 border-4 border-gray-700 shadow-xl flex items-center justify-center font-black text-xs text-white uppercase tracking-wider hover:scale-105 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed transition"
          >
            {spinning ? (
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            ) : canSpin ? (
              "SPIN"
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Lock Banner / Countdown Notice */}
        {!canSpin && !spinning && !winningPrize && (
          <div className="mt-6 p-3 rounded-xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-center gap-2 text-xs text-amber-400">
            <Clock className="w-4 h-4" />
            <span>
              You've used your spin for this month! Next spin unlocks on{" "}
              <strong className="text-white">
                {nextSpinDate?.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </strong>
            </span>
          </div>
        )}

        {/* Result Winner Modal Overlay */}
        <AnimatePresence>
          {winningPrize && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 rounded-2xl bg-gray-800 border border-gray-700 text-center"
            >
              {winningPrize.type !== "none" ? (
                <>
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                    Congratulations! You won:
                  </p>
                  <h3 className="text-xl font-black text-white mt-1">
                    {winningPrize.label}
                  </h3>

                  {winningPrize.code && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <code className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 font-mono text-amber-400 text-sm font-bold">
                        {winningPrize.code}
                      </code>
                      <button
                        onClick={() => copyCode(winningPrize.code)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1"
                      >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-300">
                    Better luck next time!
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Come back next month to try again.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PrizeWheel;