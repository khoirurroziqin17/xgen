"use client";

import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SimulationType,
  TraitInput,
  generateAllelePool,
  GeneratedAlleles,
  normalizeGenotype,
  getValidGametesFromParent,
  combineGametes,
} from "@/lib/geneticsEngine";
import {
  Dna,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  GripVertical,
  BarChart3,
} from "lucide-react";

// Animation Pental saat Drop SALAH
const snapBackAnimation: DropAnimation = {
  duration: 250,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

// ==========================================
// HELPER LOGIKA FENOTIPE & RASIO
// ==========================================
function getPhenotypeName(
  genotype: string,
  simType: SimulationType,
  traits: TraitInput,
  symbols: {
    s1: { dom: string; rec: string };
    s2?: { dom: string; rec: string };
  },
): string {
  if (!genotype) return "";

  if (simType === "monohybrid") {
    // Memiliki setidaknya 1 huruf Kapital -> Dominan
    const hasDominant = genotype.includes(symbols.s1.dom);
    return hasDominant ? traits.dom1 : traits.rec1;
  } else {
    // Dihibrid (4 huruf)
    const gene1 = genotype.slice(0, 2);
    const gene2 = genotype.slice(2, 4);

    const trait1 = gene1.includes(symbols.s1.dom) ? traits.dom1 : traits.rec1;
    const trait2 =
      symbols.s2 && gene2.includes(symbols.s2.dom) ? traits.dom2 : traits.rec2;

    return `${trait1} - ${trait2}`;
  }
}

// ==========================================
// KOMPONEN DRAGGABLE (Kepingan Alel)
// ==========================================
interface DraggableAlleleProps {
  id: string;
  value: string;
  colorClass: string;
  onClick?: () => void;
}

function DraggableAllele({
  id,
  value,
  colorClass,
  onClick,
}: DraggableAlleleProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { value },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`px-3 py-2 rounded-xl font-mono font-bold text-sm border shadow-sm cursor-grab active:cursor-grabbing select-none flex items-center gap-1.5 transition transform active:scale-95 touch-pan-x ${colorClass} ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 opacity-50" />
      <span>{value}</span>
    </div>
  );
}

// ==========================================
// KOMPONEN DROPPABLE (Kotak Target Drop)
// ==========================================
interface DroppableSlotProps {
  id: string;
  value: string;
  label: string;
  phenotype?: string;
  isLocked?: boolean;
  colorTheme?: "emerald" | "blue" | "purple";
  onClick?: () => void;
}

function DroppableSlot({
  id,
  value,
  label,
  phenotype,
  isLocked,
  colorTheme = "emerald",
  onClick,
}: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: isLocked,
  });

  const themeStyles = {
    emerald: {
      active:
        "bg-emerald-100 border-emerald-500 text-emerald-900 scale-105 shadow-inner",
      hover: "border-emerald-400 bg-emerald-50/50",
      filled:
        "bg-emerald-100 border-emerald-600 text-emerald-900 border-solid shadow-sm",
    },
    blue: {
      active:
        "bg-blue-100 border-blue-500 text-blue-900 scale-105 shadow-inner",
      hover: "border-blue-400 bg-blue-50/50",
      filled:
        "bg-blue-100 border-blue-600 text-blue-900 border-solid shadow-sm",
    },
    purple: {
      active:
        "bg-purple-100 border-purple-500 text-purple-900 scale-105 shadow-inner",
      hover: "border-purple-400 bg-purple-50/50",
      filled:
        "bg-purple-100 border-purple-600 text-purple-900 border-solid shadow-sm",
    },
  }[colorTheme];

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`min-h-[52px] py-1.5 px-2 rounded-xl border-2 ${
        value ? "border-solid" : "border-dashed"
      } flex flex-col items-center justify-center cursor-pointer transition-all duration-150 ${
        value
          ? themeStyles.filled
          : isOver
            ? themeStyles.active
            : `border-slate-300 bg-white ${themeStyles.hover}`
      }`}
    >
      {value ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center gap-1 font-mono font-bold text-sm md:text-base">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{value}</span>
          </div>
          {phenotype && (
            <span className="text-[10px] md:text-xs font-semibold text-purple-700 bg-purple-200/60 px-1.5 py-0.5 rounded mt-0.5">
              {phenotype}
            </span>
          )}
        </div>
      ) : (
        <span className="font-mono text-xs md:text-sm text-slate-400 font-medium">
          {label}
        </span>
      )}
    </div>
  );
}

// ==========================================
// HALAMAN UTAMA SIMULASI
// ==========================================
export default function SimulationPage() {
  const [simType, setSimType] = useState<SimulationType>("monohybrid");
  const [traits, setTraits] = useState<TraitInput>({
    dom1: "Ungu",
    rec1: "Putih",
    dom2: "Bulat",
    rec2: "Keriput",
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [allelePool, setAllelePool] = useState<GeneratedAlleles | null>(null);

  // Drop Zone States
  const [p1, setP1] = useState<string>("");
  const [p2, setP2] = useState<string>("");
  const [p1Gametes, setP1Gametes] = useState<string[]>([]);
  const [p2Gametes, setP2Gametes] = useState<string[]>([]);
  const [filialGrid, setFilialGrid] = useState<Record<string, string>>({});

  // Interaction & Drag States
  const [selectedAllele, setSelectedAllele] = useState<string | null>(null);
  const [draggedValue, setDraggedValue] = useState<string | null>(null);
  const [isDropValid, setIsDropValid] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"parental" | "gamet" | "filial">(
    "parental",
  );
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Konfigurasi Sensor Pembeda Arah Usapan (Directional Touch Sensing)
  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // Harus ditarik setidaknya 5px baru dianggap drag (mencegah salah klik)
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      // Sensitivitas jarak sebelum drag aktif
      distance: 8,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const pool = generateAllelePool(simType, traits);
    setAllelePool(pool);
    setIsConfigured(true);
    resetBoard();
  };

  const resetBoard = () => {
    setP1("");
    setP2("");
    setP1Gametes([]);
    setP2Gametes([]);
    setFilialGrid({});
    setSelectedAllele(null);
    setFeedback(null);
  };

  const requiredP1Gametes = getValidGametesFromParent(p1);
  const requiredP2Gametes = getValidGametesFromParent(p2);

  const isParentalComplete = p1 !== "" && p2 !== "";
  const isGametesComplete =
    isParentalComplete &&
    p1Gametes.length === requiredP1Gametes.length &&
    p2Gametes.length === requiredP2Gametes.length &&
    p1Gametes.every((g) => g !== "") &&
    p2Gametes.every((g) => g !== "");

  const totalFilialCells = p1Gametes.length * p2Gametes.length;
  const isFilialComplete =
    isGametesComplete &&
    totalFilialCells > 0 &&
    Object.keys(filialGrid).length === totalFilialCells;

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  // CALCULATE RATIOS
  const calculateResults = () => {
    if (!isFilialComplete || !allelePool) return null;

    const genotypesCount: Record<string, number> = {};
    const phenotypesCount: Record<string, number> = {};
    const total = Object.values(filialGrid).length;

    Object.values(filialGrid).forEach((gt) => {
      // Genotype Count
      genotypesCount[gt] = (genotypesCount[gt] || 0) + 1;

      // Phenotype Count
      const pt = getPhenotypeName(gt, simType, traits, {
        s1: allelePool.symbol1,
        s2: allelePool.symbol2,
      });
      phenotypesCount[pt] = (phenotypesCount[pt] || 0) + 1;
    });

    return {
      total,
      genotypesCount,
      phenotypesCount,
    };
  };

  const results = calculateResults();

  // LOGIKA VALIDASI DROP
  const processDropLogic = (alleleValue: string, slotId: string): boolean => {
    // 1. PARENTAL DROP
    if (slotId === "slot-p1" || slotId === "slot-p2") {
      if (!allelePool?.parental.includes(alleleValue)) {
        showFeedback("error", "Kepingan ini bukan pasangan alel parental!");
        return false;
      }
      if (slotId === "slot-p1") {
        setP1(alleleValue);
        setP1Gametes([]);
        setFilialGrid({});
      } else {
        setP2(alleleValue);
        setP2Gametes([]);
        setFilialGrid({});
      }
      showFeedback("success", `Berhasil memasang Induk ${alleleValue}`);
      return true;
    }

    // 2. GAMETE DROP
    if (slotId.startsWith("slot-g1-") || slotId.startsWith("slot-g2-")) {
      if (!isParentalComplete) {
        showFeedback("error", "Isi kedua genotipe induk terlebih dahulu!");
        return false;
      }

      const isP1 = slotId.startsWith("slot-g1-");
      const idx = parseInt(slotId.split("-")[2]);
      const targetParent = isP1 ? p1 : p2;
      const validGametes = getValidGametesFromParent(targetParent);

      if (!validGametes.includes(alleleValue)) {
        showFeedback(
          "error",
          `Gamet "${alleleValue}" tidak sesuai dari induk ${targetParent}!`,
        );
        return false;
      }

      if (validGametes[idx] !== alleleValue) {
        showFeedback("error", `Gamet "${alleleValue}" bukan untuk slot ini!`);
        return false;
      }

      if (isP1) {
        const nextG = [...p1Gametes];
        nextG[idx] = alleleValue;
        setP1Gametes(nextG);
      } else {
        const nextG = [...p2Gametes];
        nextG[idx] = alleleValue;
        setP2Gametes(nextG);
      }
      setFilialGrid({});
      showFeedback("success", `Gamet ${alleleValue} Tepat!`);
      return true;
    }

    // 3. FILIAL DROP
    if (slotId.startsWith("slot-f-")) {
      if (!isGametesComplete) {
        showFeedback("error", "Lengkapi seluruh gamet terlebih dahulu!");
        return false;
      }

      const [, , cIdxStr, rIdxStr] = slotId.split("-");
      const cIdx = parseInt(cIdxStr);
      const rIdx = parseInt(rIdxStr);

      const expectedCombo = combineGametes(
        p1Gametes[cIdx],
        p2Gametes[rIdx],
        simType,
      );
      const userCombo = normalizeGenotype(alleleValue);

      if (expectedCombo !== userCombo) {
        showFeedback(
          "error",
          `Salah! Genotipe alel "${userCombo}" tidak cocok!`,
        );
        return false;
      }

      const gridKey = `${cIdx}-${rIdx}`;
      setFilialGrid((prev) => ({ ...prev, [gridKey]: userCombo }));
      showFeedback("success", `Keturunan ${userCombo} Tepat!`);
      return true;
    }

    return false;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active) {
      const alleleValue = active.data.current?.value as string;
      const slotId = over.id as string;
      const isSuccess = processDropLogic(alleleValue, slotId);

      setIsDropValid(isSuccess);
      if (isSuccess) {
        setDraggedValue(null);
        return;
      }
    } else {
      showFeedback("error", "Kepingan harus diletakkan pada slot target!");
      setIsDropValid(false);
    }

    setDraggedValue(null);
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedAllele) {
      showFeedback("error", "Pilih kepingan alel terlebih dahulu!");
      return;
    }
    const isSuccess = processDropLogic(selectedAllele, slotId);
    if (isSuccess) {
      setSelectedAllele(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => {
        setDraggedValue(e.active.data.current?.value as string);
        setIsDropValid(false);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-32">
        {/* Header */}
        <header className="bg-emerald-700 text-white py-4 px-6 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Dna className="w-8 h-8 text-emerald-300 animate-pulse" />
              <h1 className="text-xl font-bold">Simulasi Genetika Mendel</h1>
            </div>
            {isConfigured && (
              <button
                onClick={() => setIsConfigured(false)}
                className="text-xs bg-emerald-800 hover:bg-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-500 transition"
              >
                Ubah Sifat / Mode
              </button>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-6">
          {feedback && (
            <div
              className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center space-x-2 text-sm font-semibold transition ${
                feedback.type === "success"
                  ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                  : "bg-rose-100 border-rose-400 text-rose-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span>{feedback.msg}</span>
            </div>
          )}

          {!isConfigured ? (
            /* FORM SETUP SIFAT */
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mt-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6 text-emerald-600" /> Pengaturan
                Simulasi
              </h2>

              <form onSubmit={handleStartSimulation} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pilih Jenis Persilangan
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSimType("monohybrid")}
                      className={`p-3 rounded-xl border text-center font-semibold text-sm transition ${
                        simType === "monohybrid"
                          ? "bg-emerald-50 border-emerald-600 text-emerald-700 ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Monohibrid (1 Sifat Beda)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimType("dihybrid")}
                      className={`p-3 rounded-xl border text-center font-semibold text-sm transition ${
                        simType === "dihybrid"
                          ? "bg-emerald-50 border-emerald-600 text-emerald-700 ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Dihibrid (2 Sifat Beda)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-700">
                    {simType === "monohybrid"
                      ? "Sifat yang Disilangkan"
                      : "Sifat Pertama (Sifat 1)"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Sifat Dominan
                      </label>
                      <input
                        type="text"
                        required
                        value={traits.dom1}
                        onChange={(e) =>
                          setTraits({ ...traits, dom1: e.target.value })
                        }
                        placeholder="Contoh: Ungu"
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Sifat Resesif
                      </label>
                      <input
                        type="text"
                        required
                        value={traits.rec1}
                        onChange={(e) =>
                          setTraits({ ...traits, rec1: e.target.value })
                        }
                        placeholder="Contoh: Putih"
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {simType === "dihybrid" && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="font-semibold text-sm text-slate-700">
                      Sifat Kedua (Sifat 2)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">
                          Sifat Dominan
                        </label>
                        <input
                          type="text"
                          required
                          value={traits.dom2}
                          onChange={(e) =>
                            setTraits({ ...traits, dom2: e.target.value })
                          }
                          placeholder="Contoh: Bulat"
                          className="w-full p-2 border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">
                          Sifat Resesif
                        </label>
                        <input
                          type="text"
                          required
                          value={traits.rec2}
                          onChange={(e) =>
                            setTraits({ ...traits, rec2: e.target.value })
                          }
                          placeholder="Contoh: Keriput"
                          className="w-full p-2 border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" /> Generate Kepingan & Mulai
                </button>
              </form>
            </div>
          ) : (
            /* BOARD SIMULASI */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
              {/* DESKTOP PANEL ALEL */}
              <div className="hidden lg:block lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-6 h-fit space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" /> Kepingan
                    Alel
                  </h3>
                  <button
                    onClick={resetBoard}
                    className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Board
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    1. Parental (P)
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {allelePool?.parental.map((a, i) => (
                      <DraggableAllele
                        key={`p-${i}`}
                        id={`drag-p-${i}`}
                        value={a}
                        colorClass="bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                        onClick={() => setSelectedAllele(a)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    2. Gamet (G)
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {allelePool?.gametes.map((a, i) => (
                      <DraggableAllele
                        key={`g-${i}`}
                        id={`drag-g-${i}`}
                        value={a}
                        colorClass="bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100"
                        onClick={() => setSelectedAllele(a)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                    3. Filial / Keturunan (F1)
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
                    {allelePool?.filial.map((a, i) => (
                      <DraggableAllele
                        key={`f-${i}`}
                        id={`drag-f-${i}`}
                        value={a}
                        colorClass="bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100"
                        onClick={() => setSelectedAllele(a)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* DROP ZONES */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. PARENTAL */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                    <span>1. Persilangan Induk (Parental / P1)</span>
                    {isParentalComplete && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border text-center space-y-2">
                      <span className="text-xs text-slate-500 font-medium">
                        Induk Jantan (♂)
                      </span>
                      <DroppableSlot
                        id="slot-p1"
                        value={p1}
                        label="Drop Induk P1"
                        phenotype={
                          p1 && allelePool
                            ? getPhenotypeName(p1, simType, traits, {
                                s1: allelePool.symbol1,
                                s2: allelePool.symbol2,
                              })
                            : undefined
                        }
                        colorTheme="emerald"
                        onClick={() => handleSlotClick("slot-p1")}
                      />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border text-center space-y-2">
                      <span className="text-xs text-slate-500 font-medium">
                        Induk Betina (♀)
                      </span>
                      <DroppableSlot
                        id="slot-p2"
                        value={p2}
                        label="Drop Induk P2"
                        phenotype={
                          p2 && allelePool
                            ? getPhenotypeName(p2, simType, traits, {
                                s1: allelePool.symbol1,
                                s2: allelePool.symbol2,
                              })
                            : undefined
                        }
                        colorTheme="emerald"
                        onClick={() => handleSlotClick("slot-p2")}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. GAMETS */}
                <div
                  className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 transition ${
                    !isParentalComplete ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <h3 className="font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                    <span>2. Pembentukan Gamet</span>
                    {isGametesComplete && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                      <span className="text-xs text-blue-700 font-semibold block">
                        Gamet P1 ({p1 || "?"}) - {requiredP1Gametes.length}{" "}
                        Jenis
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {requiredP1Gametes.length > 0 ? (
                          requiredP1Gametes.map((_, idx) => (
                            <div
                              key={`g1-wrap-${idx}`}
                              className="flex-1 min-w-[60px]"
                            >
                              <DroppableSlot
                                id={`slot-g1-${idx}`}
                                value={p1Gametes[idx] || ""}
                                label={`Drop G${idx + 1}`}
                                colorTheme="blue"
                                isLocked={!isParentalComplete}
                                onClick={() =>
                                  handleSlotClick(`slot-g1-${idx}`)
                                }
                              />
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic py-2">
                            Isi P1 terlebih dahulu
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                      <span className="text-xs text-blue-700 font-semibold block">
                        Gamet P2 ({p2 || "?"}) - {requiredP2Gametes.length}{" "}
                        Jenis
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {requiredP2Gametes.length > 0 ? (
                          requiredP2Gametes.map((_, idx) => (
                            <div
                              key={`g2-wrap-${idx}`}
                              className="flex-1 min-w-[60px]"
                            >
                              <DroppableSlot
                                id={`slot-g2-${idx}`}
                                value={p2Gametes[idx] || ""}
                                label={`Drop G${idx + 1}`}
                                colorTheme="blue"
                                isLocked={!isParentalComplete}
                                onClick={() =>
                                  handleSlotClick(`slot-g2-${idx}`)
                                }
                              />
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic py-2">
                            Isi P2 terlebih dahulu
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PUNNETT SQUARE */}
                <div
                  className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 transition ${
                    !isGametesComplete ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <h3 className="font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                    <span>3. Papan Catur Persilangan (Filial / F1)</span>
                    {isFilialComplete && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="mx-auto border-collapse border-2 border-purple-600 text-center font-mono">
                      <thead>
                        <tr>
                          <th className="p-2 border-2 border-purple-600 bg-purple-100 text-purple-900 text-xs">
                            ♀ \ ♂
                          </th>
                          {p1Gametes.map((g, idx) => (
                            <th
                              key={`th-${idx}`}
                              className="p-3 border-2 border-purple-600 bg-purple-200 text-purple-900 font-bold text-sm"
                            >
                              {g || `G1_${idx + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {p2Gametes.map((g2Val, rIdx) => (
                          <tr key={`tr-${rIdx}`}>
                            <td className="p-3 border-2 border-purple-600 bg-purple-200 text-purple-900 font-bold text-sm">
                              {g2Val || `G2_${rIdx + 1}`}
                            </td>
                            {p1Gametes.map((_, cIdx) => {
                              const gridKey = `${cIdx}-${rIdx}`;
                              const val = filialGrid[gridKey];
                              const slotId = `slot-f-${cIdx}-${rIdx}`;
                              const ptName =
                                val && allelePool
                                  ? getPhenotypeName(val, simType, traits, {
                                      s1: allelePool.symbol1,
                                      s2: allelePool.symbol2,
                                    })
                                  : undefined;

                              return (
                                <td
                                  key={`td-${cIdx}-${rIdx}`}
                                  className="p-2 border-2 border-purple-600 min-w-[100px]"
                                >
                                  <DroppableSlot
                                    id={slotId}
                                    value={val || ""}
                                    label="Drop F1"
                                    phenotype={ptName}
                                    colorTheme="purple"
                                    isLocked={!isGametesComplete}
                                    onClick={() => handleSlotClick(slotId)}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. HASIL PERBANDINGAN / RASIO FILIAL (VERSI TERANG & KEREN) */}
                {isFilialComplete && results && (
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-200 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                    {/* Header Ringkasan */}
                    <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                      <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          Hasil Perbandingan Keturunan (Filial F1)
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Total Keturunan:{" "}
                          <span className="font-mono font-bold text-emerald-700">
                            {results.total} Kombinasi
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Rasio Genotipe (Background Hijau Terang) */}
                      <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
                        <h4 className="font-bold text-sm text-emerald-900 border-b border-emerald-200/80 pb-2 flex justify-between items-center">
                          <span>Perbandingan Rasio Genotipe</span>
                          <span className="text-[11px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                            {Object.keys(results.genotypesCount).length} Variasi
                          </span>
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(results.genotypesCount).map(
                            ([gt, count]) => {
                              const pct = (
                                (count / results.total) *
                                100
                              ).toFixed(1);
                              return (
                                <div
                                  key={`res-gt-${gt}`}
                                  className="flex justify-between items-center text-sm font-mono bg-white px-3.5 py-2 rounded-lg border border-emerald-200/60 shadow-sm"
                                >
                                  <span className="font-bold text-emerald-950 text-base">
                                    {gt}
                                  </span>
                                  <div className="text-right">
                                    <span className="font-bold text-emerald-700 text-sm">
                                      {count}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {" "}
                                      / {results.total}{" "}
                                    </span>
                                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded ml-1">
                                      {pct}%
                                    </span>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Rasio Fenotipe (Background Teal Terang) */}
                      <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 space-y-3">
                        <h4 className="font-bold text-sm text-teal-900 border-b border-teal-200/80 pb-2 flex justify-between items-center">
                          <span>Perbandingan Rasio Fenotipe</span>
                          <span className="text-[11px] bg-teal-200/60 text-teal-800 px-2 py-0.5 rounded-full">
                            {Object.keys(results.phenotypesCount).length} Sifat
                          </span>
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(results.phenotypesCount).map(
                            ([pt, count]) => {
                              const pct = (
                                (count / results.total) *
                                100
                              ).toFixed(1);
                              return (
                                <div
                                  key={`res-pt-${pt}`}
                                  className="flex justify-between items-center text-sm bg-white px-3.5 py-2 rounded-lg border border-teal-200/60 shadow-sm"
                                >
                                  <span className="font-semibold text-slate-800">
                                    {pt}
                                  </span>
                                  <div className="text-right font-mono">
                                    <span className="font-bold text-teal-700 text-sm">
                                      {count}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {" "}
                                      / {results.total}{" "}
                                    </span>
                                    <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded ml-1">
                                      {pct}%
                                    </span>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* MOBILE FLOATING SHEET (Dock Style Canva) */}
        {isConfigured && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40 p-3 rounded-t-2xl">
            <div className="flex justify-between items-center mb-2 px-1 text-xs">
              <span className="text-slate-500">
                Terpilih:{" "}
                <strong className="text-emerald-700 font-mono text-sm">
                  {selectedAllele || "Belum ada (Bisa Drag/Tap)"}
                </strong>
              </span>
              <button
                onClick={resetBoard}
                className="text-slate-400 hover:text-slate-600"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("parental")}
                className={`py-1.5 rounded-lg text-center ${
                  activeTab === "parental"
                    ? "bg-white shadow text-emerald-800"
                    : "text-slate-500"
                }`}
              >
                Parental
              </button>
              <button
                onClick={() => setActiveTab("gamet")}
                className={`py-1.5 rounded-lg text-center ${
                  activeTab === "gamet"
                    ? "bg-white shadow text-blue-800"
                    : "text-slate-500"
                }`}
              >
                Gamet
              </button>
              <button
                onClick={() => setActiveTab("filial")}
                className={`py-1.5 rounded-lg text-center ${
                  activeTab === "filial"
                    ? "bg-white shadow text-purple-800"
                    : "text-slate-500"
                }`}
              >
                Filial
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 min-h-[50px] items-center touch-pan-x scroll-smooth">
              {activeTab === "parental" &&
                allelePool?.parental.map((a, i) => (
                  <DraggableAllele
                    key={`m-p-${i}`}
                    id={`drag-m-p-${i}`}
                    value={a}
                    colorClass={
                      selectedAllele === a
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-emerald-50 text-emerald-900 border-emerald-300"
                    }
                    onClick={() => setSelectedAllele(a)}
                  />
                ))}

              {activeTab === "gamet" &&
                allelePool?.gametes.map((a, i) => (
                  <DraggableAllele
                    key={`m-g-${i}`}
                    id={`drag-m-g-${i}`}
                    value={a}
                    colorClass={
                      selectedAllele === a
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-blue-50 text-blue-900 border-blue-300"
                    }
                    onClick={() => setSelectedAllele(a)}
                  />
                ))}

              {activeTab === "filial" &&
                allelePool?.filial.map((a, i) => (
                  <DraggableAllele
                    key={`m-f-${i}`}
                    id={`drag-m-f-${i}`}
                    value={a}
                    colorClass={
                      selectedAllele === a
                        ? "bg-purple-600 text-white border-purple-700"
                        : "bg-purple-50 text-purple-900 border-purple-300"
                    }
                    onClick={() => setSelectedAllele(a)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={isDropValid ? null : snapBackAnimation}>
          {draggedValue ? (
            <div className="px-4 py-2.5 bg-emerald-600 text-white font-mono font-bold text-base rounded-xl shadow-2xl border-2 border-white scale-105 pointer-events-none">
              {draggedValue}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
