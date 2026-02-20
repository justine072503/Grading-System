"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Save, Calculator, Trophy, ChevronDown, UserCheck, UserPlus, Download, FileSpreadsheet } from "lucide-react";

// --- Types ---
interface FashionScores {
  carriage: number;
  stylishness: number;
  presentation: number;
  audience: number;
}

interface TalentScores {
  choreography: number;
  originality: number;
  performance: number;
  audience: number;
}

interface QAScores {
  relevance: number;
  delivery: number;
  articulation: number;
  audience: number;
}

interface ProductionScores {
  mastery: number;
  bearing: number;
  presentation: number;
  audience: number;
}

interface Contestant {
  id: string;
  name: string;
  scores: {
    casualwear: FashionScores | null;
    shortswear: FashionScores | null;
    longgown: FashionScores | null;
    talent: TalentScores | null;
    qa: QAScores | null;
    production: ProductionScores | null;
  };
  totals: {
    casualwear: number | null;
    shortswear: number | null;
    longgown: number | null;
    talent: number | null;
    qa: number | null;
    production: number | null;
  };
  grandTotal: number;
  grade: string;
  completedCategories: number;
}

// --- Constants ---
const MAIN_CRITERIA = [
  { key: "casualwear" as const, label: "Casualwear", fullLabel: "Best in Casualwear", weight: 0.10, icon: "👚", type: "fashion" as const },
  { key: "shortswear" as const, label: "Shortswear", fullLabel: "Best in Shortswear", weight: 0.15, icon: "🩳", type: "fashion" as const },
  { key: "longgown" as const, label: "Long Gown", fullLabel: "Best in Long Gown", weight: 0.20, icon: "👗", type: "fashion" as const },
  { key: "talent" as const, label: "Talent", fullLabel: "Best in Talent", weight: 0.20, icon: "🎤", type: "talent" as const },
  { key: "qa" as const, label: "Q&A", fullLabel: "Best in Q&A", weight: 0.25, icon: "💬", type: "qa" as const },
  { key: "production" as const, label: "Production #", fullLabel: "Best in Production Number", weight: 0.10, icon: "🎭", type: "production" as const },
] as const;

const FASHION_SUBCRITERIA = [
  { key: "carriage", label: "Carriage", weight: 0.30, hint: "Posture, confidence, walk, elegance" },
  { key: "stylishness", label: "Stylishness of Outfit", weight: 0.30, hint: "Fashion sense, fit, coordination, appropriateness" },
  { key: "presentation", label: "Overall Presentation", weight: 0.25, hint: "Stage presence, poise, charisma, confidence" },
  { key: "audience", label: "Audience Response", weight: 0.15, hint: "Crowd engagement, applause, reaction" },
];

const TALENT_SUBCRITERIA = [
  { key: "choreography", label: "Choreography", weight: 0.30, hint: "Including entrance & exit, flow, transitions" },
  { key: "originality", label: "Originality", weight: 0.25, hint: "Creativity, uniqueness, innovation" },
  { key: "performance", label: "Overall Performance", weight: 0.30, hint: "Execution, skill, technique, energy" },
  { key: "audience", label: "Audience Response", weight: 0.15, hint: "Crowd engagement, applause, reaction" },
];

const QA_SUBCRITERIA = [
  { key: "relevance", label: "Relevance, Content, Wit & Impact", weight: 0.35, hint: "Answer relevance, substance, cleverness, impact" },
  { key: "delivery", label: "Delivery & Choice of Words", weight: 0.25, hint: "Confidence, pacing, word selection, clarity" },
  { key: "articulation", label: "Articulation, Diction & Grammar", weight: 0.25, hint: "Pronunciation, enunciation, proper grammar" },
  { key: "audience", label: "Audience Response", weight: 0.15, hint: "Crowd engagement, applause, reaction" },
];

const PRODUCTION_SUBCRITERIA = [
  { key: "mastery", label: "Mastery Performance", weight: 0.30, hint: "Skill level, technique, precision, control" },
  { key: "bearing", label: "Personal Bearing", weight: 0.25, hint: "Confidence, stage presence, professionalism" },
  { key: "presentation", label: "Overall Presentation", weight: 0.30, hint: "Costume, props, staging, visual impact" },
  { key: "audience", label: "Audience Response", weight: 0.15, hint: "Crowd engagement, applause, reaction" },
];

const getLetterGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case "A": return "bg-green-100 text-green-800 border-green-200";
    case "B": return "bg-blue-100 text-blue-800 border-blue-200";
    case "C": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "D": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-red-100 text-red-800 border-red-200";
  }
};

// Calculate weighted totals for each category type
const calculateFashionTotal = (scores: FashionScores): number => {
  return FASHION_SUBCRITERIA.reduce((sum, { key, weight }) => {
    return sum + ((scores[key] || 0) * weight);
  }, 0);
};

const calculateTalentTotal = (scores: TalentScores): number => {
  return TALENT_SUBCRITERIA.reduce((sum, { key, weight }) => {
    return sum + ((scores[key] || 0) * weight);
  }, 0);
};

const calculateQATotal = (scores: QAScores): number => {
  return QA_SUBCRITERIA.reduce((sum, { key, weight }) => {
    return sum + ((scores[key] || 0) * weight);
  }, 0);
};

const calculateProductionTotal = (scores: ProductionScores): number => {
  return PRODUCTION_SUBCRITERIA.reduce((sum, { key, weight }) => {
    return sum + ((scores[key] || 0) * weight);
  }, 0);
};

// Default empty scores
const DEFAULT_FASHION_SCORES: FashionScores = {
  carriage: 0,
  stylishness: 0,
  presentation: 0,
  audience: 0,
};

const DEFAULT_TALENT_SCORES: TalentScores = {
  choreography: 0,
  originality: 0,
  performance: 0,
  audience: 0,
};

const DEFAULT_QA_SCORES: QAScores = {
  relevance: 0,
  delivery: 0,
  articulation: 0,
  audience: 0,
};

const DEFAULT_PRODUCTION_SCORES: ProductionScores = {
  mastery: 0,
  bearing: 0,
  presentation: 0,
  audience: 0,
};

export default function GradingSystem() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof MAIN_CRITERIA)[number]["key"]>("casualwear");
  
  // Form State
  const [name, setName] = useState("");
  const [fashionScores, setFashionScores] = useState<Record<"casualwear" | "shortswear" | "longgown", FashionScores>>({
    casualwear: { ...DEFAULT_FASHION_SCORES },
    shortswear: { ...DEFAULT_FASHION_SCORES },
    longgown: { ...DEFAULT_FASHION_SCORES },
  });
  const [talentScores, setTalentScores] = useState<TalentScores>({ ...DEFAULT_TALENT_SCORES });
  const [qaScores, setQAScores] = useState<QAScores>({ ...DEFAULT_QA_SCORES });
  const [productionScores, setProductionScores] = useState<ProductionScores>({ ...DEFAULT_PRODUCTION_SCORES });

  // Track if current name matches existing contestant
  const [existingContestant, setExistingContestant] = useState<Contestant | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fiesta-contestants");
    if (saved) {
      setContestants(JSON.parse(saved));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("fiesta-contestants", JSON.stringify(contestants));
  }, [contestants]);

  // Check for existing contestant when name changes
  useEffect(() => {
    if (name.trim()) {
      const found = contestants.find(
        c => c.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      setExistingContestant(found || null);
      setIsUpdating(!!found);
    } else {
      setExistingContestant(null);
      setIsUpdating(false);
    }
  }, [name, contestants]);

  const handleFashionScoreChange = (category: "casualwear" | "shortswear" | "longgown", subKey: keyof FashionScores, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFashionScores(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subKey]: numValue
      }
    }));
  };

  const handleTalentScoreChange = (subKey: keyof TalentScores, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTalentScores(prev => ({
      ...prev,
      [subKey]: numValue
    }));
  };

  const handleQAScoreChange = (subKey: keyof QAScores, value: string) => {
    const numValue = parseFloat(value) || 0;
    setQAScores(prev => ({
      ...prev,
      [subKey]: numValue
    }));
  };

  const handleProductionScoreChange = (subKey: keyof ProductionScores, value: string) => {
    const numValue = parseFloat(value) || 0;
    setProductionScores(prev => ({
      ...prev,
      [subKey]: numValue
    }));
  };

  const handleAddContestant = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate weighted totals for each category
    const newTotals = {
      casualwear: activeTab === "casualwear" ? calculateFashionTotal(fashionScores.casualwear) * 0.10 : null,
      shortswear: activeTab === "shortswear" ? calculateFashionTotal(fashionScores.shortswear) * 0.15 : null,
      longgown: activeTab === "longgown" ? calculateFashionTotal(fashionScores.longgown) * 0.20 : null,
      talent: activeTab === "talent" ? calculateTalentTotal(talentScores) * 0.20 : null,
      qa: activeTab === "qa" ? calculateQATotal(qaScores) * 0.25 : null,
      production: activeTab === "production" ? calculateProductionTotal(productionScores) * 0.10 : null,
    };

    const newScores = {
      casualwear: activeTab === "casualwear" ? { ...fashionScores.casualwear } : null,
      shortswear: activeTab === "shortswear" ? { ...fashionScores.shortswear } : null,
      longgown: activeTab === "longgown" ? { ...fashionScores.longgown } : null,
      talent: activeTab === "talent" ? { ...talentScores } : null,
      qa: activeTab === "qa" ? { ...qaScores } : null,
      production: activeTab === "production" ? { ...productionScores } : null,
    };

    if (existingContestant && isUpdating) {
      // UPDATE existing contestant
      const updatedContestant: Contestant = {
        ...existingContestant,
        scores: {
          ...existingContestant.scores,
          [activeTab]: newScores[activeTab],
        },
        totals: {
          ...existingContestant.totals,
          [activeTab]: newTotals[activeTab],
        },
      };

      // Recalculate grand total
      const grandTotal = Object.values(updatedContestant.totals).reduce((sum, val) => sum + (val || 0), 0);
      updatedContestant.grandTotal = parseFloat(grandTotal.toFixed(2));
      updatedContestant.grade = getLetterGrade(grandTotal);
      updatedContestant.completedCategories = Object.values(updatedContestant.scores).filter(s => s !== null).length;

      setContestants(contestants.map(c => c.id === existingContestant.id ? updatedContestant : c));
    } else {
      // CREATE new contestant
      const grandTotal = Object.values(newTotals).reduce((sum, val) => sum + (val || 0), 0);
      
      const newContestant: Contestant = {
        id: crypto.randomUUID(),
        name: name || "Unknown Contestant",
        scores: {
          casualwear: null,
          shortswear: null,
          longgown: null,
          talent: null,
          qa: null,
          production: null,
        },
        totals: {
          casualwear: null,
          shortswear: null,
          longgown: null,
          talent: null,
          qa: null,
          production: null,
        },
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        grade: getLetterGrade(grandTotal),
        completedCategories: 1,
      };

      // Set the current category scores
      newContestant.scores[activeTab] = newScores[activeTab] as any;
      newContestant.totals[activeTab] = newTotals[activeTab];

      setContestants([...contestants, newContestant]);
    }
    
    // Reset Form
    setName("");
    setFashionScores({
      casualwear: { ...DEFAULT_FASHION_SCORES },
      shortswear: { ...DEFAULT_FASHION_SCORES },
      longgown: { ...DEFAULT_FASHION_SCORES },
    });
    setTalentScores({ ...DEFAULT_TALENT_SCORES });
    setQAScores({ ...DEFAULT_QA_SCORES });
    setProductionScores({ ...DEFAULT_PRODUCTION_SCORES });
    setExistingContestant(null);
    setIsUpdating(false);
  };

  const handleDelete = (id: string) => {
    setContestants(contestants.filter((c) => c.id !== id));
  };

  const handleClearAll = () => {
    if(confirm("Are you sure you want to clear all contestant data?")) {
      setContestants([]);
    }
  };

  // CSV Export Function
  const handleExportCSV = () => {
    if (contestants.length === 0) {
      alert("No contestants to export!");
      return;
    }

    // CSV Header Row
    const headers = [
      "Rank",
      "Contestant Name",
      "Grade",
      "Grand Total",
      "Completed Categories",
      // Casualwear Sub-criteria
      "Casualwear - Carriage",
      "Casualwear - Stylishness",
      "Casualwear - Presentation",
      "Casualwear - Audience",
      "Casualwear - Weighted Total",
      // Shortswear Sub-criteria
      "Shortswear - Carriage",
      "Shortswear - Stylishness",
      "Shortswear - Presentation",
      "Shortswear - Audience",
      "Shortswear - Weighted Total",
      // Long Gown Sub-criteria
      "Long Gown - Carriage",
      "Long Gown - Stylishness",
      "Long Gown - Presentation",
      "Long Gown - Audience",
      "Long Gown - Weighted Total",
      // Talent Sub-criteria
      "Talent - Choreography",
      "Talent - Originality",
      "Talent - Performance",
      "Talent - Audience",
      "Talent - Weighted Total",
      // Q&A Sub-criteria
      "Q&A - Relevance",
      "Q&A - Delivery",
      "Q&A - Articulation",
      "Q&A - Audience",
      "Q&A - Weighted Total",
      // Production Number Sub-criteria
      "Production - Mastery",
      "Production - Bearing",
      "Production - Presentation",
      "Production - Audience",
      "Production - Weighted Total",
    ];

    // CSV Data Rows
    const sortedContestants = [...contestants].sort((a, b) => b.grandTotal - a.grandTotal);
    
    const rows = sortedContestants.map((contestant, index) => {
      const rank = index + 1;
      
      // Helper to get score or empty
      const getScore = (score: number | null) => score !== null ? score.toFixed(2) : "";
      
      // Helper to get sub-criteria scores
      const getFashionScores = (scores: FashionScores | null) => {
        if (!scores) return ["", "", "", ""];
        return [
          scores.carriage.toFixed(2),
          scores.stylishness.toFixed(2),
          scores.presentation.toFixed(2),
          scores.audience.toFixed(2),
        ];
      };

      const getTalentScores = (scores: TalentScores | null) => {
        if (!scores) return ["", "", "", ""];
        return [
          scores.choreography.toFixed(2),
          scores.originality.toFixed(2),
          scores.performance.toFixed(2),
          scores.audience.toFixed(2),
        ];
      };

      const getQAScores = (scores: QAScores | null) => {
        if (!scores) return ["", "", "", ""];
        return [
          scores.relevance.toFixed(2),
          scores.delivery.toFixed(2),
          scores.articulation.toFixed(2),
          scores.audience.toFixed(2),
        ];
      };

      const getProductionScores = (scores: ProductionScores | null) => {
        if (!scores) return ["", "", "", ""];
        return [
          scores.mastery.toFixed(2),
          scores.bearing.toFixed(2),
          scores.presentation.toFixed(2),
          scores.audience.toFixed(2),
        ];
      };

      return [
        rank,
        `"${contestant.name.replace(/"/g, '""')}"`, // Escape quotes in names
        contestant.grade,
        contestant.grandTotal > 0 ? contestant.grandTotal.toFixed(2) : "",
        `${contestant.completedCategories}/6`,
        // Casualwear
        ...getFashionScores(contestant.scores.casualwear),
        getScore(contestant.totals.casualwear),
        // Shortswear
        ...getFashionScores(contestant.scores.shortswear),
        getScore(contestant.totals.shortswear),
        // Long Gown
        ...getFashionScores(contestant.scores.longgown),
        getScore(contestant.totals.longgown),
        // Talent
        ...getTalentScores(contestant.scores.talent),
        getScore(contestant.totals.talent),
        // Q&A
        ...getQAScores(contestant.scores.qa),
        getScore(contestant.totals.qa),
        // Production
        ...getProductionScores(contestant.scores.production),
        getScore(contestant.totals.production),
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ransohan-fiesta-results-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeCriterion = MAIN_CRITERIA.find(c => c.key === activeTab)!;

  // Get completion status for existing contestant
  const getCompletionStatus = (contestant: Contestant) => {
    return MAIN_CRITERIA.map(c => ({
      key: c.key,
      icon: c.icon,
      completed: contestant.scores[c.key] !== null,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 flex items-center gap-2">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-amber-500" />
              Ransohan Fiesta Pageant
            </h1>
            <p className="text-gray-600 mt-1 text-sm">All criteria recorded per contestant. Enter same name to update scores.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleExportCSV}
              disabled={contestants.length === 0}
              className="text-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export all contestant data to CSV"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Reset All Data
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-indigo-100 p-2">
          <nav className="flex overflow-x-auto gap-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {MAIN_CRITERIA.map((criterion) => (
              <button
                key={criterion.key}
                onClick={() => setActiveTab(criterion.key)}
                className={`flex items-center gap-2 px-3 md:px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === criterion.key
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                <span>{criterion.icon}</span>
                <span className="hidden lg:inline">{criterion.fullLabel}</span>
                <span className="lg:hidden">{criterion.label}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === criterion.key ? "bg-white/20" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {Math.round(criterion.weight * 100)}%
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* --- Input Form Section --- */}
          <div className="xl:col-span-1">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-indigo-100 sticky top-4">
              <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-800">
                {isUpdating ? <UserCheck className="w-5 h-5 text-green-600" /> : <Plus className="w-5 h-5" />}
                Score: {activeCriterion.icon} {activeCriterion.fullLabel}
              </h2>
              
              {/* Existing Contestant Alert */}
              {existingContestant && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-green-800">Updating Existing Contestant</p>
                    <p className="text-green-700">{existingContestant.name}</p>
                    <p className="text-green-600 text-xs mt-1">
                      {existingContestant.completedCategories}/6 categories completed
                    </p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleAddContestant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contestant Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      existingContestant ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Maria Santos"
                  />
                  {existingContestant && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Found existing contestant - scores will be updated
                    </p>
                  )}
                </div>

                {/* Fashion Criteria Inputs */}
                {activeCriterion.type === "fashion" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Fashion Evaluation Criteria
                    </p>
                    {FASHION_SUBCRITERIA.map((sub) => (
                      <div key={sub.key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            {sub.label}
                            <span className="ml-2 text-xs text-indigo-600 font-normal">
                              ({Math.round(sub.weight * 100)}%)
                            </span>
                          </label>
                          <span className="text-[10px] text-gray-400 hidden sm:inline">{sub.hint}</span>
                        </div>
                        <input
                          type="number"
                          min="0" 
                          max="100"
                          step="0.01"
                          value={fashionScores[activeTab as keyof typeof fashionScores][sub.key as keyof FashionScores]}
                          onChange={(e) => handleFashionScoreChange(
                            activeTab as "casualwear" | "shortswear" | "longgown",
                            sub.key as keyof FashionScores,
                            e.target.value
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          placeholder="0-100"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Talent Criteria Inputs */}
                {activeCriterion.type === "talent" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Talent Evaluation Criteria
                    </p>
                    {TALENT_SUBCRITERIA.map((sub) => (
                      <div key={sub.key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            {sub.label}
                            <span className="ml-2 text-xs text-indigo-600 font-normal">
                              ({Math.round(sub.weight * 100)}%)
                            </span>
                          </label>
                          <span className="text-[10px] text-gray-400 hidden sm:inline">{sub.hint}</span>
                        </div>
                        <input
                          type="number"
                          min="0" 
                          max="100"
                          step="0.01"
                          value={talentScores[sub.key as keyof TalentScores]}
                          onChange={(e) => handleTalentScoreChange(
                            sub.key as keyof TalentScores,
                            e.target.value
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          placeholder="0-100"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Q&A Criteria Inputs */}
                {activeCriterion.type === "qa" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Q&A Evaluation Criteria
                    </p>
                    {QA_SUBCRITERIA.map((sub) => (
                      <div key={sub.key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            {sub.label}
                            <span className="ml-2 text-xs text-indigo-600 font-normal">
                              ({Math.round(sub.weight * 100)}%)
                            </span>
                          </label>
                          <span className="text-[10px] text-gray-400 hidden sm:inline">{sub.hint}</span>
                        </div>
                        <input
                          type="number"
                          min="0" 
                          max="100"
                          step="0.01"
                          value={qaScores[sub.key as keyof QAScores]}
                          onChange={(e) => handleQAScoreChange(
                            sub.key as keyof QAScores,
                            e.target.value
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          placeholder="0-100"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Production Number Criteria Inputs */}
                {activeCriterion.type === "production" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Production Number Evaluation Criteria
                    </p>
                    {PRODUCTION_SUBCRITERIA.map((sub) => (
                      <div key={sub.key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            {sub.label}
                            <span className="ml-2 text-xs text-indigo-600 font-normal">
                              ({Math.round(sub.weight * 100)}%)
                            </span>
                          </label>
                          <span className="text-[10px] text-gray-400 hidden sm:inline">{sub.hint}</span>
                        </div>
                        <input
                          type="number"
                          min="0" 
                          max="100"
                          step="0.01"
                          value={productionScores[sub.key as keyof ProductionScores]}
                          onChange={(e) => handleProductionScoreChange(
                            sub.key as keyof ProductionScores,
                            e.target.value
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          placeholder="0-100"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Live Preview */}
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category Contribution:</span>
                    <span className="font-semibold text-indigo-700">
                      {(() => {
                        let categoryScore = 0;
                        if (activeCriterion.type === "fashion") {
                          categoryScore = calculateFashionTotal(fashionScores[activeTab as keyof typeof fashionScores]);
                        } else if (activeCriterion.type === "talent") {
                          categoryScore = calculateTalentTotal(talentScores);
                        } else if (activeCriterion.type === "qa") {
                          categoryScore = calculateQATotal(qaScores);
                        } else if (activeCriterion.type === "production") {
                          categoryScore = calculateProductionTotal(productionScores);
                        }
                        const weighted = categoryScore * activeCriterion.weight;
                        return `${weighted.toFixed(2)} pts (${Math.round(activeCriterion.weight * 100)}% weight)`;
                      })()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow ${
                    isUpdating 
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  {isUpdating ? <UserCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {isUpdating ? "Update Contestant" : "Add to Rankings"}
                </button>
              </form>

              {/* Criteria Info Panel */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-xs text-indigo-800 border border-indigo-100">
                <p className="font-semibold mb-2 flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  Complete Scoring System:
                </p>
                <ul className="space-y-1.5">
                  {MAIN_CRITERIA.map(({ icon, fullLabel, weight }) => (
                    <li key={fullLabel} className="flex justify-between">
                      <span>{icon} {fullLabel}</span>
                      <span className="font-medium">{Math.round(weight * 100)}%</span>
                    </li>
                  ))}
                </ul>
                
                {activeCriterion.type === "fashion" && (
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="font-semibold mb-1">Fashion Criteria (4 sub-criteria):</p>
                    <ul className="space-y-1">
                      {FASHION_SUBCRITERIA.map(({ label, weight }) => (
                        <li key={label} className="flex justify-between">
                          <span className="truncate mr-2">{label}</span>
                          <span className="font-medium whitespace-nowrap">{Math.round(weight * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeCriterion.type === "talent" && (
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="font-semibold mb-1">Talent Criteria (4 sub-criteria):</p>
                    <ul className="space-y-1">
                      {TALENT_SUBCRITERIA.map(({ label, weight }) => (
                        <li key={label} className="flex justify-between">
                          <span className="truncate mr-2">{label}</span>
                          <span className="font-medium whitespace-nowrap">{Math.round(weight * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeCriterion.type === "qa" && (
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="font-semibold mb-1">Q&A Criteria (4 sub-criteria):</p>
                    <ul className="space-y-1">
                      {QA_SUBCRITERIA.map(({ label, weight }) => (
                        <li key={label} className="flex justify-between">
                          <span className="truncate mr-2">{label}</span>
                          <span className="font-medium whitespace-nowrap">{Math.round(weight * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeCriterion.type === "production" && (
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="font-semibold mb-1">Production # Criteria (4 sub-criteria):</p>
                    <ul className="space-y-1">
                      {PRODUCTION_SUBCRITERIA.map(({ label, weight }) => (
                        <li key={label} className="flex justify-between">
                          <span className="truncate mr-2">{label}</span>
                          <span className="font-medium whitespace-nowrap">{Math.round(weight * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-indigo-200">
                  <p className="font-semibold mb-1">Grade Scale:</p>
                  <ul className="grid grid-cols-2 gap-1">
                    <li>🥇 A: 90-100</li>
                    <li>🥈 B: 80-89</li>
                    <li>🥉 C: 70-79</li>
                    <li>D: 60-69</li>
                    <li className="col-span-2">F: 0-59</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* --- Results Table Section --- */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-indigo-50 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                <h2 className="text-lg md:text-xl font-semibold text-indigo-900">Contestant Rankings</h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 md:px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {contestants.length} Entries
                </span>
              </div>

              {contestants.length === 0 ? (
                <div className="p-8 md:p-12 text-center text-gray-400">
                  <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-20 text-amber-400" />
                  <p className="text-base md:text-lg font-medium text-gray-600">No contestants added yet</p>
                  <p className="text-sm">Enter a name and start scoring!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm text-gray-600">
                    <thead className="bg-indigo-50 text-indigo-900 font-semibold border-b border-indigo-100">
                      <tr>
                        <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4">Contestant</th>
                        <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">Progress</th>
                        {MAIN_CRITERIA.map((c) => (
                          <th key={c.key} className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-center whitespace-nowrap">
                            <span className="hidden xl:inline">{c.icon} {c.label}</span>
                            <span className="xl:hidden">{c.icon}</span>
                            <span className="block text-[10px] font-normal text-indigo-600">{Math.round(c.weight * 100)}%</span>
                          </th>
                        ))}
                        <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">Total</th>
                        <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">Grade</th>
                        <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-50">
                      {contestants
                        .sort((a, b) => b.grandTotal - a.grandTotal)
                        .map((contestant, index) => {
                          const completion = getCompletionStatus(contestant);
                          const completedCount = completion.filter(c => c.completed).length;
                          const isComplete = completedCount === 6;
                          
                          return (
                            <tr 
                              key={contestant.id} 
                              className={`hover:bg-indigo-25 transition-colors ${index < 3 ? 'bg-amber-50/50' : ''} ${!isComplete ? 'opacity-90' : ''}`}
                            >
                              <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                                <div className="flex items-center gap-2 md:gap-3">
                                  {index < 3 && (
                                    <span className={`text-base md:text-lg ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                    </span>
                                  )}
                                  <div>
                                    <span className="font-medium text-gray-900 truncate max-w-[100px] md:max-w-[150px] block">{contestant.name}</span>
                                    {!isComplete && (
                                      <span className="text-[10px] text-orange-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                                        Incomplete ({completedCount}/6)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">
                                <div className="flex justify-center gap-1">
                                  {completion.map((c) => (
                                    <span 
                                      key={c.key}
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        c.completed 
                                          ? 'bg-green-500 text-white' 
                                          : 'bg-gray-200 text-gray-400'
                                      }`}
                                      title={`${c.icon} ${MAIN_CRITERIA.find(m => m.key === c.key)?.label} - ${c.completed ? 'Completed' : 'Pending'}`}
                                    >
                                      {c.icon}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              {MAIN_CRITERIA.map((c) => (
                                <td key={c.key} className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-center font-mono text-xs md:text-sm">
                                  {contestant.scores[c.key] ? (
                                    <div className="space-y-1">
                                      <div className="font-semibold text-indigo-700">{contestant.totals[c.key]?.toFixed(2)}</div>
                                      <details className="text-[10px] text-gray-500 group">
                                        <summary className="cursor-pointer hover:text-indigo-600 list-none flex items-center justify-center gap-1">
                                          Details <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="mt-2 text-left bg-gray-50 p-2 rounded border">
                                          {c.type === "fashion" && FASHION_SUBCRITERIA.map((sub) => {
                                            const rawScore = contestant.scores[c.key] as FashionScores;
                                            return (
                                              <div key={sub.key} className="flex justify-between py-0.5">
                                                <span className="truncate mr-2">{sub.label}:</span>
                                                <span className="font-mono">{rawScore[sub.key as keyof FashionScores]}</span>
                                              </div>
                                            );
                                          })}
                                          {c.type === "talent" && TALENT_SUBCRITERIA.map((sub) => {
                                            const rawScore = contestant.scores.talent as TalentScores;
                                            return (
                                              <div key={sub.key} className="flex justify-between py-0.5">
                                                <span className="truncate mr-2">{sub.label}:</span>
                                                <span className="font-mono">{rawScore[sub.key as keyof TalentScores]}</span>
                                              </div>
                                            );
                                          })}
                                          {c.type === "qa" && QA_SUBCRITERIA.map((sub) => {
                                            const rawScore = contestant.scores.qa as QAScores;
                                            return (
                                              <div key={sub.key} className="flex justify-between py-0.5">
                                                <span className="truncate mr-2">{sub.label}:</span>
                                                <span className="font-mono">{rawScore[sub.key as keyof QAScores]}</span>
                                              </div>
                                            );
                                          })}
                                          {c.type === "production" && PRODUCTION_SUBCRITERIA.map((sub) => {
                                            const rawScore = contestant.scores.production as ProductionScores;
                                            return (
                                              <div key={sub.key} className="flex justify-between py-0.5">
                                                <span className="truncate mr-2">{sub.label}:</span>
                                                <span className="font-mono">{rawScore[sub.key as keyof ProductionScores]}</span>
                                              </div>
                                            );
                                          })}
                                          <div className="pt-1 mt-1 border-t text-[10px] text-gray-400">
                                            Weighted × {Math.round(c.weight * 100)}%
                                          </div>
                                        </div>
                                      </details>
                                    </div>
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                              ))}
                              <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center font-bold text-indigo-900 text-sm md:text-base">
                                {contestant.grandTotal > 0 ? contestant.grandTotal : '—'}
                              </td>
                              <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">
                                {contestant.grandTotal > 0 ? (
                                  <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${getGradeColor(contestant.grade)}`}>
                                    {contestant.grade}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                              <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-right">
                                <button
                                  onClick={() => handleDelete(contestant.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1.5 md:p-2 hover:bg-red-50 rounded-lg"
                                  title="Remove Contestant"
                                >
                                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Podium Highlight */}
            {contestants.filter(c => c.grandTotal > 0).length >= 3 && (
              <div className="mt-4 md:mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Current Top 3
                </h3>
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                  {contestants
                    .filter(c => c.grandTotal > 0)
                    .sort((a, b) => b.grandTotal - a.grandTotal)
                    .slice(0, 3)
                    .map((c, i) => (
                      <div key={c.id} className={`p-2 md:p-3 rounded-lg ${i === 0 ? 'bg-amber-100 border-2 border-amber-300' : 'bg-white border'}`}>
                        <div className="text-xl md:text-2xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                        <div className="font-medium text-xs md:text-sm truncate">{c.name}</div>
                        <div className="text-indigo-700 font-bold text-sm md:text-base">{c.grandTotal} pts</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}