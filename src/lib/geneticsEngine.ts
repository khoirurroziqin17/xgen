export type SimulationType = "monohybrid" | "dihybrid";

export interface TraitInput {
  dom1: string; // Sifat Dominan 1 (misal: Ungu / Bulat)
  rec1: string; // Sifat Resesif 1 (misal: Putih / Keriput)
  dom2?: string; // Sifat Dominan 2 (misal: Kuning)
  rec2?: string; // Sifat Resesif 2 (misal: Hijau)
}

export interface GeneratedAlleles {
  symbol1: { dom: string; rec: string };
  symbol2?: { dom: string; rec: string };
  parental: string[];
  gametes: string[];
  filial: string[];
}

// Ekstraksi huruf pertama
function getSymbol(
  text: string,
  defaultChar: string,
): { dom: string; rec: string } {
  const clean = text.trim();
  const char = clean ? clean.charAt(0).toUpperCase() : defaultChar;
  return { dom: char, rec: char.toLowerCase() };
}

// Helper untuk mengurutkan 2 huruf gen agar Kapital di depan (misal: "uU" -> "Uu")
export function sortSingleGene(geneStr: string): string {
  if (geneStr.length !== 2) return geneStr;
  const chars = geneStr.split("");
  chars.sort((a, b) => {
    // Jika salah satu kapital dan satu kecil dari huruf yang sama, kapital di depan
    if (a.toUpperCase() === b.toUpperCase()) {
      if (a === a.toUpperCase() && b === b.toLowerCase()) return -1;
      if (a === a.toLowerCase() && b === b.toUpperCase()) return 1;
    }
    return a.localeCompare(b);
  });
  return chars.join("");
}

/**
 * Normalisasi Kombinasi Alel Dihibrid & Monohibrid
 * Contoh Monohibrid: "u" + "U" -> "Uu"
 * Contoh Dihibrid: Gamet 1 "UB" + Gamet 2 "uB"
 *                  Sifat 1: U + u -> Uu
 *                  Sifat 2: B + B -> BB
 *                  Hasil Akhir: "UuBB"
 */
export function combineGametes(
  g1: string,
  g2: string,
  simType: "monohybrid" | "dihybrid",
): string {
  if (simType === "monohybrid") {
    return sortSingleGene(g1 + g2);
  } else {
    // Dihibrid (g1 = "UB", g2 = "uB")
    // Char 0 dari masing-masing gamet adalah Gen Sifat 1 (U/u)
    // Char 1 dari masing-masing gamet adalah Gen Sifat 2 (B/b)
    const gene1 = sortSingleGene(g1[0] + g2[0]);
    const gene2 = sortSingleGene(g1[1] + g2[1]);
    return gene1 + gene2;
  }
}

// Tetap pertahankan fungsi normalizeGenotype untuk validasi string input
export function normalizeGenotype(genotype: string): string {
  if (genotype.length === 2) {
    return sortSingleGene(genotype);
  }
  if (genotype.length === 4) {
    // Jika bentuknya "UuBB" atau "uUBB"
    const gene1 = sortSingleGene(genotype.slice(0, 2));
    const gene2 = sortSingleGene(genotype.slice(2, 4));
    return gene1 + gene2;
  }
  return genotype;
}

// Generator Pool Kepingan Alel
export function generateAllelePool(
  type: SimulationType,
  traits: TraitInput,
): GeneratedAlleles {
  const s1 = getSymbol(traits.dom1, "U");

  if (type === "monohybrid") {
    const P = s1.dom;
    const p = s1.rec;
    return {
      symbol1: s1,
      parental: [`${P}${P}`, `${P}${p}`, `${p}${p}`],
      gametes: [P, p],
      filial: [`${P}${P}`, `${P}${p}`, `${p}${p}`],
    };
  } else {
    const s2 = getSymbol(traits.dom2 || "", "K");
    const A = s1.dom;
    const a = s1.rec;
    const B = s2.dom;
    const b = s2.rec;

    const gene1Combos = [`${A}${A}`, `${A}${a}`, `${a}${a}`];
    const gene2Combos = [`${B}${B}`, `${B}${b}`, `${b}${b}`];
    const dihybridCombos: string[] = [];

    gene1Combos.forEach((g1) => {
      gene2Combos.forEach((g2) => {
        dihybridCombos.push(`${g1}${g2}`);
      });
    });

    const gametes = [`${A}${B}`, `${A}${b}`, `${a}${B}`, `${a}${b}`];

    return {
      symbol1: s1,
      symbol2: s2,
      parental: dihybridCombos,
      gametes: gametes,
      filial: dihybridCombos,
    };
  }
}

/**
 * ATURAN GAMET MENDEL:
 * - UU  -> ['U'] (1 gamet)
 * - uu  -> ['u'] (1 gamet)
 * - Uu  -> ['U', 'u'] (2 gamet)
 * - BBKK -> ['BK'] (1 gamet)
 * - BbKk -> ['BK', 'Bk', 'bK', 'bk'] (4 gamet)
 */
export function getValidGametesFromParent(parentGenotype: string): string[] {
  if (!parentGenotype) return [];

  if (parentGenotype.length === 2) {
    // Monohibrid
    const g1 = parentGenotype[0];
    const g2 = parentGenotype[1];
    if (g1 === g2) {
      return [g1]; // Cukup 1 gamet jika homozigot
    }
    return [g1, g2]; // 2 gamet jika heterozigot
  } else if (parentGenotype.length === 4) {
    // Dihibrid
    const g1 = Array.from(new Set([parentGenotype[0], parentGenotype[1]]));
    const g2 = Array.from(new Set([parentGenotype[2], parentGenotype[3]]));
    const res: string[] = [];
    g1.forEach((a1) => {
      g2.forEach((a2) => {
        res.push(`${a1}${a2}`);
      });
    });
    return res;
  }
  return [];
}
