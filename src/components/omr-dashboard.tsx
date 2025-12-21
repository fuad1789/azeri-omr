"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Upload,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Key,
  Search,
  Settings,
  Plus,
  X,
  GripVertical,
  FileText,
  Loader2,
  FileDown,
} from "lucide-react";
import {
  ParsedStudent,
  SubjectConfig,
  DEFAULT_SUBJECT_CONFIG,
  CLASS_CONFIGS,
} from "@/lib/omr-parser";
import { GradedStudent, SubjectScore } from "@/lib/grading";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  generateCombinedPDF,
  downloadCombinedPDF,
  downloadPDF,
} from "@/lib/pdf-utils";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Sortable Item Component
function SortableSubjectItem(props: {
  id: string;
  configActiveTab: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("outline-none", isDragging && "z-50")}
    >
      <div
        className={cn(
          "relative",
          isDragging && "opacity-80 shadow-xl scale-105"
        )}
      >
        {React.cloneElement(
          props.children as React.ReactElement<{ dragListeners?: any }>,
          { dragListeners: listeners }
        )}
      </div>
    </div>
  );
}

// Internal component for the subject row
const SubjectRow = React.memo(
  ({
    subject,
    index,
    handleUpdateSubject,
    handleRemoveSubject,
    dragListeners,
  }: {
    subject: SubjectConfig;
    index: number;
    handleUpdateSubject: (
      idx: number,
      field: keyof SubjectConfig,
      val: any
    ) => void;
    handleRemoveSubject: (idx: number) => void;
    dragListeners?: any;
  }) => {
    return (
      <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors bg-white shadow-sm">
        <span
          className="w-8 text-slate-400 flex justify-center cursor-grab active:cursor-grabbing hover:text-indigo-500 outline-none"
          {...dragListeners}
        >
          <GripVertical className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={subject.name}
          onChange={(e) => handleUpdateSubject(index, "name", e.target.value)}
          placeholder="Fənn adı"
          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              Sual
            </span>
            <input
              type="number"
              value={subject.length}
              onChange={(e) =>
                handleUpdateSubject(
                  index,
                  "length",
                  parseInt(e.target.value) || 0
                )
              }
              className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              Bal
            </span>
            <input
              type="number"
              value={subject.points !== undefined ? subject.points : 5}
              onChange={(e) =>
                handleUpdateSubject(
                  index,
                  "points",
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-indigo-600"
            />
          </div>
        </div>
        <button
          onClick={() => handleRemoveSubject(index)}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }
);

SubjectRow.displayName = "SubjectRow";

const SubjectKeyInputs = ({
  variant,
  value,
  onChange,
  config,
}: {
  variant: string;
  value: string;
  onChange: (val: string) => void;
  config: SubjectConfig[];
}) => {
  const handleSubjectChange = (subjectIndex: number, newValue: string) => {
    let currentIndex = 0;
    let newValueFull = value || "";

    const totalLength = config.reduce((acc, s) => acc + s.length, 0);
    if (newValueFull.length < totalLength) {
      newValueFull = newValueFull.padEnd(totalLength, " ");
    }

    let result = "";

    config.forEach((subj, idx) => {
      const segLen = subj.length;
      const oldSeg = newValueFull.slice(currentIndex, currentIndex + segLen);

      if (idx === subjectIndex) {
        result += newValue.padEnd(segLen, " ").slice(0, segLen);
      } else {
        result += oldSeg.padEnd(segLen, " ").slice(0, segLen);
      }
      currentIndex += segLen;
    });

    onChange(result);
  };

  let currentReadIndex = 0;

  return (
    <div className="flex flex-col gap-3 w-full p-4 bg-slate-50/50 rounded-xl border border-slate-100">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
          {variant}
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Variantı
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        {config.map((subject, idx) => {
          const start = currentReadIndex;
          const end = currentReadIndex + subject.length;
          const subjectValue = (value || "").slice(start, end).trim();
          currentReadIndex += subject.length;

          return (
            <div
              key={subject.id || idx}
              className="flex flex-col items-start gap-1.5"
              style={{ width: `${Math.max(subject.length + 10, 14)}ch` }}
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    subject.color.split(" ")[0]
                  )}
                ></div>
                <label
                  className="text-xs font-semibold text-slate-700 truncate"
                  title={subject.name}
                >
                  {subject.name}
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  value={subjectValue}
                  maxLength={subject.length}
                  onChange={(e) =>
                    handleSubjectChange(idx, e.target.value.toUpperCase())
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none uppercase transition-all shadow-sm"
                  placeholder="Cavab..."
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono pointer-events-none">
                  {subjectValue.length}/{subject.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Row Component for Virtualized Table
const TableRow = React.memo(
  ({
    item,
    configMap,
    allUniqueSubjects,
    onGeneratePDF,
  }: {
    item: GradedStudent;
    configMap: Record<string, SubjectConfig[]>;
    allUniqueSubjects: SubjectConfig[];
    onGeneratePDF: (student: GradedStudent) => void;
  }) => {
    const totalScore = item.scores ? item.scores.totalNetScore : 0;
    const config = configMap[item.sinif] || configMap["default"];
    const maxScore = config.reduce(
      (acc, curr) => acc + curr.length * (curr.points || 0),
      0
    );

    return (
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-3 py-3 font-mono font-medium text-slate-600 text-xs w-[80px]">
          {item.isNomresi}
        </td>
        <td className="px-3 py-3 font-medium text-slate-900 whitespace-nowrap text-xs w-[200px]">
          <div className="flex items-center gap-2">
            <span>
              {item.ad} {item.soyad}
            </span>
            {item.scores && (
              <button
                onClick={() => onGeneratePDF(item)}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1 rounded transition-colors"
                title="PDF yüklə"
              >
                <FileDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </td>
        <td className="px-2 py-3 text-slate-500 whitespace-nowrap text-xs w-[150px]">
          {item.sinif}
          {item.sinfinAdi} <span className="text-slate-300">/</span>{" "}
          {item.bolme}
        </td>
        <td className="px-2 py-3 text-slate-900 font-bold font-mono text-center w-[50px]">
          {item.variant}
        </td>
        <td className="px-3 py-3 font-bold text-center text-indigo-600 bg-blue-50/30 w-[100px]">
          {item.scores ? totalScore.toFixed(0) : "-"}
          <span className="text-[10px] text-slate-400 block font-normal">
            / {maxScore}
          </span>
        </td>

        {allUniqueSubjects.map((subject) => {
          const score = item.scores
            ? (item.scores[subject.id] as SubjectScore)
            : null;
          const width = Math.max(100, subject.length * 15);

          return (
            <td
              key={subject.id}
              className="px-3 py-2 text-right border-l border-slate-50"
              style={{ minWidth: `${width}px`, width: `${width}px` }}
            >
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm font-medium text-slate-700">
                  {score ? score.netScore.toFixed(2) : "-"}
                </span>
                {score && score.studentAnswerString && (
                  <div className="flex flex-col mt-1 select-none">
                    <div className="flex font-mono text-[10px] leading-tight tracking-wider">
                      {score.studentAnswerString.split("").map((char, i) => {
                        const keyChar = score.correctAnswerString[i] || " ";
                        let color = "text-slate-300";

                        if (keyChar === "*") {
                          color = "text-green-600 font-bold";
                        } else if (char === " ") {
                          color = "text-slate-300";
                        } else if (char === keyChar) {
                          color = "text-green-600 font-bold";
                        } else {
                          color = "text-red-500 font-bold";
                        }

                        return (
                          <span
                            key={i}
                            className={cn("w-[10px] text-center", color)}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </td>
          );
        })}
      </tr>
    );
  }
);
TableRow.displayName = "TableRow";

export default function OMRDashboard() {
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedStudent[] | null>(null);
  const [gradedData, setGradedData] = useState<GradedStudent[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const [configMap, setConfigMap] = useState<Record<string, SubjectConfig[]>>({
    default: DEFAULT_SUBJECT_CONFIG,
    ...CLASS_CONFIGS,
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configActiveTab, setConfigActiveTab] = useState<string>("01");

  const [neededKeys, setNeededKeys] = useState<Record<string, string[]>>({});
  const [activeClass, setActiveClass] = useState<string>("");

  const [examName, setExamName] = useState<string>("");
  const [examDate, setExamDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const [includeRank, setIncludeRank] = useState(true);

  const [answerKeys, setAnswerKeys] = useState<
    Record<string, Record<string, string>>
  >(() => {
    const initial: Record<string, Record<string, string>> = {};
    for (let i = 1; i <= 11; i++) {
      initial[i.toString()] = { A: "", B: "", C: "", D: "" };
    }
    return initial;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/omr.worker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      const { type, data, error } = event.data;
      if (type === "PARSE_COMPLETE") {
        handleParseComplete(data);
        setIsProcessing(false);
      } else if (type === "GRADE_COMPLETE") {
        setGradedData(data);
        setIsProcessing(false); // Only if we blocked parsing, but for grading we might want silent update or small indicator
      } else if (type === "ERROR") {
        console.error("Worker Error:", error);
        setIsProcessing(false);
        alert("An error occurred during processing: " + error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Async Parsing Trigger
  const handleParse = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    workerRef.current?.postMessage({ type: "PARSE", rawText, configMap });
  };

  const handleParseComplete = (results: ParsedStudent[]) => {
    setParsedData(results);
    // Initialize graded data with raw results until real grading happens
    // Actually simpler to just wait for grading, but let's set it to sync valid/invalid counts early if needed.
    // However, logic below relies on PARSING completing first to detect classes.

    const detected: Record<string, Set<string>> = {};
    const detectedClassesSet = new Set<string>();

    results.forEach((student) => {
      if (student.isValid) {
        if (!detected[student.sinif]) {
          detected[student.sinif] = new Set();
        }
        detected[student.sinif].add(student.variant);
        detectedClassesSet.add(student.sinif);
      }
    });

    const newConfigMap = { ...configMap };
    let configUpdated = false;
    detectedClassesSet.forEach((cls) => {
      if (!newConfigMap[cls]) {
        newConfigMap[cls] = newConfigMap["default"].map((s) => ({ ...s }));
        configUpdated = true;
      }
    });
    if (configUpdated) {
      setConfigMap(newConfigMap);
    }

    const finalNeeded: Record<string, string[]> = {};
    Object.keys(detected)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((cls) => {
        finalNeeded[cls] = Array.from(detected[cls]).sort();
      });

    setNeededKeys(finalNeeded);

    const detectedClasses = Object.keys(finalNeeded);
    if (detectedClasses.length > 0) {
      setActiveClass(detectedClasses[0]);
    }

    setShowResults(false);
  };

  // Trigger Grading when dependencies change
  useEffect(() => {
    if (parsedData && workerRef.current) {
      // Debounce grading to prevent UI stutter while typing keys
      const timer = setTimeout(() => {
        workerRef.current?.postMessage({
          type: "GRADE",
          parsedData,
          answerKeys,
          configMap,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [parsedData, answerKeys, configMap]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentConfig = [...(configMap[configActiveTab] || [])];
      const oldIndex = currentConfig.findIndex((item) => item.id === active.id);
      const newIndex = currentConfig.findIndex((item) => item.id === over.id);

      const newConfig = arrayMove(currentConfig, oldIndex, newIndex);

      setConfigMap({
        ...configMap,
        [configActiveTab]: newConfig,
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRawText(text);
      setParsedData(null);
      setGradedData(null);
      setNeededKeys({});
      setShowResults(false);
      setActiveClass("");
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setRawText("");
    setParsedData(null);
    setGradedData(null);
    setFileName(null);
    setNeededKeys({});
    setShowResults(false);
    setActiveClass("");
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  // Download logic - using ref to latest gradedData if needed, or just dep
  const handleDownloadJSON = () => {
    if (!gradedData) return;
    const validRecords = gradedData.filter((d) => d.isValid);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(validRecords, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "omr-results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.remove();
  };

  const handleGenerateAllPDFs = async () => {
    if (!gradedData || !examName.trim()) {
      alert("Zəhmət olmasa imtahan adını daxil edin.");
      return;
    }

    setIsGeneratingPDFs(true);
    try {
      const validStudents = gradedData.filter((d) => d.isValid && d.scores);
      if (validStudents.length === 0) {
        alert("PDF yaratmaq üçün etibarlı tələbə məlumatı yoxdur.");
        setIsGeneratingPDFs(false);
        return;
      }

      const combinedBlob = await generateCombinedPDF(validStudents, configMap, {
        examName: examName.trim(),
        examDate: examDate,
        includeRank: includeRank,
      });

      await downloadCombinedPDF(combinedBlob, examName.trim());
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(
        "PDF yaratma zamanı xəta baş verdi: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsGeneratingPDFs(false);
    }
  };

  const handleGenerateSinglePDF = async (student: GradedStudent) => {
    if (!examName.trim()) {
      alert("Zəhmət olmasa imtahan adını daxil edin.");
      return;
    }

    if (!student.scores) {
      alert("Bu tələbə üçün nəticə yoxdur.");
      return;
    }

    try {
      const config = configMap[student.sinif] || configMap["default"] || [];

      // Calculate rank if needed
      let rank: number | undefined;
      if (includeRank && gradedData) {
        const studentsWithScores = gradedData
          .filter((s) => s.isValid && s.scores)
          .map((s) => ({
            id: s.id,
            score: s.scores!.totalNetScore,
          }))
          .sort((a, b) => b.score - a.score);

        const rankIndex = studentsWithScores.findIndex(
          (s) => s.id === student.id
        );
        if (rankIndex !== -1) {
          let currentRank = 1;
          let previousScore = Infinity;
          for (let i = 0; i <= rankIndex; i++) {
            if (studentsWithScores[i].score < previousScore) {
              currentRank = i + 1;
              previousScore = studentsWithScores[i].score;
            }
          }
          rank = currentRank;
        }
      }

      const blob = await (
        await import("@/lib/pdf-utils")
      ).generateStudentPDF(
        student,
        config,
        {
          examName: examName.trim(),
          examDate: examDate,
          includeRank: includeRank,
        },
        rank,
        gradedData?.filter((s) => s.isValid && s.scores).length
      );

      const filename =
        `${student.isNomresi}_${student.ad}_${student.soyad}_nəticə.pdf`
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

      downloadPDF(blob, filename);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(
        "PDF yaratma zamanı xəta baş verdi: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setRawText(text); // Helper will trigger parse via useEffect if we wanted, but we require manual button press for parse usually.
        // Here we just set text.
        setParsedData(null);
        setGradedData(null);
        setNeededKeys({});
        setShowResults(false);
        setActiveClass("");
      };
      reader.readAsText(file);
    }
  }, []);

  // Filter valid data for display
  const allValidData = useMemo(
    () => gradedData?.filter((d) => d.isValid) || [],
    [gradedData]
  );

  // Virtualization
  const rowVirtualizer = useVirtualizer({
    count: allValidData.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 53, // Approximate row height
    overscan: 20,
  });

  const validCount = gradedData?.filter((d) => d.isValid).length ?? 0;
  const invalidCount = gradedData?.filter((d) => !d.isValid).length ?? 0;

  const allNeededKeysFilled = useMemo(() => {
    if (Object.keys(neededKeys).length === 0) return false;
    return Object.entries(neededKeys).some(([cls, variants]) => {
      return variants.some((variant) => {
        const key = answerKeys[cls]?.[variant] || "";
        return key.length > 0;
      });
    });
  }, [neededKeys, answerKeys]);

  const detectedClasses = Object.keys(neededKeys);

  // Configuration Handlers
  const handleUpdateSubject = useCallback(
    (index: number, field: keyof SubjectConfig, value: string | number) => {
      setConfigMap((prev) => {
        const newMap = { ...prev };
        const currentConfig = [...(newMap[configActiveTab] || [])];
        currentConfig[index] = { ...currentConfig[index], [field]: value };
        if (field === "name") {
          currentConfig[index].id = (value as string)
            .toLowerCase()
            .replace(/\s+/g, "");
        }
        newMap[configActiveTab] = currentConfig;
        return newMap;
      });
    },
    [configActiveTab]
  );

  const handleAddSubject = () => {
    setConfigMap((prev) => {
      const newMap = { ...prev };
      const currentConfig = [...(newMap[configActiveTab] || [])];
      const newSubject = {
        id: `subject-${Date.now()}`,
        name: "Yeni Fənn",
        length: 10,
        points: 5,
        color: "bg-slate-100 text-slate-900",
      };
      newMap[configActiveTab] = [...currentConfig, newSubject];
      return newMap;
    });
  };

  const handleRemoveSubject = (index: number) => {
    setConfigMap((prev) => {
      const newMap = { ...prev };
      const currentConfig = newMap[configActiveTab].filter(
        (_, i) => i !== index
      );
      newMap[configActiveTab] = currentConfig;
      return newMap;
    });
  };

  const handleAddClassConfig = () => {
    const className = prompt("Sinif nömrəsini daxil edin (məsələn: 9):");
    if (className && !configMap[className]) {
      setConfigMap((prev) => ({
        ...prev,
        [className]: DEFAULT_SUBJECT_CONFIG.map((s) => ({ ...s })),
      }));
      setConfigActiveTab(className);
    }
  };

  const allUniqueSubjects = useMemo(() => {
    const subjectsMap = new Map<string, SubjectConfig>();
    Object.values(configMap).forEach((config) => {
      config.forEach((subj) => {
        if (!subjectsMap.has(subj.id)) {
          subjectsMap.set(subj.id, { ...subj });
        } else {
          // Update with max length found to ensure column fits all variants
          const existing = subjectsMap.get(subj.id)!;
          if (subj.length > existing.length) {
            existing.length = subj.length;
          }
          subjectsMap.set(subj.id, existing);
        }
      });
    });
    return Array.from(subjectsMap.values());
  }, [configMap]);

  const activeConfigTotalLength = (configMap[configActiveTab] || []).reduce(
    (acc, curr) => acc + curr.length,
    0
  );
  const activeConfigTotalScore = (configMap[configActiveTab] || []).reduce(
    (acc, curr) => acc + curr.length * (curr.points || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              OMR Məlumat Analizi
            </h1>
            <p className="text-slate-500 mt-1">
              Optik skanerdən gələn məlumatları JSON və cədvəl halına gətirin.
            </p>
          </div>
          <div className="flex gap-3">
            {showResults && gradedData && (
              <>
                <button
                  onClick={handleGenerateAllPDFs}
                  disabled={isGeneratingPDFs || !examName.trim()}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                  {isGeneratingPDFs ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      PDF yaradılır...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      Birləşdirilmiş PDF Yüklə
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  JSON Yüklə
                </button>
              </>
            )}
            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Fənnlər
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Təmizlə
            </button>
          </div>
        </div>

        {/* Configuration Modal */}
        {isConfigOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Fənn Konfiqurasiyası
                  </h2>
                  <p className="text-sm text-slate-500">
                    Hər sinif üçün ayrı fənn bölgüsü təyin edin.
                  </p>
                </div>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Class List */}
                <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 block">
                      Siniflər
                    </label>
                    {Object.keys(neededKeys)
                      .sort((a, b) => Number(a) - Number(b))
                      .map((cls) => (
                        <button
                          key={cls}
                          onClick={() => setConfigActiveTab(cls)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                            configActiveTab === cls
                              ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                              : "text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          {cls === "default"
                            ? "Standart (Default)"
                            : `${cls}-ci Sinif`}
                        </button>
                      ))}
                    <button
                      onClick={handleAddClassConfig}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 border border-dashed border-slate-300 hover:bg-slate-100 hover:text-slate-700 transition-all mt-4"
                    >
                      <Plus className="w-4 h-4" />
                      Sinif Əlavə Et
                    </button>
                  </div>
                </div>

                {/* Main: Subject List for Active Class */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800 text-lg">
                        {configActiveTab === "default"
                          ? "Standart"
                          : `${configActiveTab}-ci Sinif`}{" "}
                        Tənzimləmələri
                      </h3>
                      <div className="flex items-center gap-4 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">
                            Sual:
                          </span>
                          <span
                            className={cn(
                              "font-bold",
                              activeConfigTotalLength === 70
                                ? "text-emerald-600"
                                : "text-amber-500"
                            )}
                          >
                            {activeConfigTotalLength}
                          </span>
                        </div>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">
                            Max Bal:
                          </span>
                          <span className="font-bold text-indigo-600">
                            {activeConfigTotalScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm font-medium text-slate-500 px-2 pb-2 border-b border-slate-100 mt-6">
                      <span className="w-8">#</span>
                      <span className="flex-1">Fənn Adı</span>
                      <span className="w-32 text-center">Tənzimləmələr</span>
                      <span className="w-10"></span>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={(configMap[configActiveTab] || []).map(
                          (s) => s.id
                        )}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {configMap[configActiveTab]?.map((subject, index) => (
                            <SortableSubjectItem
                              key={subject.id}
                              id={subject.id}
                              configActiveTab={configActiveTab}
                            >
                              <SubjectRow
                                subject={subject}
                                index={index}
                                handleUpdateSubject={handleUpdateSubject}
                                handleRemoveSubject={handleRemoveSubject}
                              />
                            </SortableSubjectItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    <button
                      onClick={handleAddSubject}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Yeni Fənn Əlavə Et
                    </button>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center">
                    <button
                      onClick={() => setIsConfigOpen(false)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                      Təsdiqlə
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout */}
        <div className="flex flex-col gap-8">
          {/* Exam Info Section */}
          {showResults && gradedData && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                      İmtahan Adı *
                    </label>
                    <input
                      type="text"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      placeholder="Məs: 14DEKB25_BILIK_YAR1_S3"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                      Tarix
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-6 md:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeRank}
                      onChange={(e) => setIncludeRank(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      Yer göstər
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Top Section: controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
            {/* File Upload Section */}
            <div className="lg:col-span-1 space-y-4">
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-white hover:border-indigo-400 hover:bg-indigo-50/10 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-900">
                  Faylı bura atın
                </p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {fileName && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium max-w-full truncate">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                )}
              </div>

              {!parsedData && (
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Mətn yapışdırın..."
                  className="w-full h-32 p-3 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm"
                />
              )}

              {!parsedData && (
                <button
                  onClick={handleParse}
                  disabled={!rawText || isProcessing}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-colors shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analiz edilir...
                    </>
                  ) : (
                    "Analiz Et (Parse)"
                  )}
                </button>
              )}

              {parsedData && detectedClasses.length === 0 && (
                <div className="p-6 bg-orange-50/50 border border-orange-100 text-orange-800 text-center text-sm rounded-2xl flex flex-col items-center gap-2">
                  <AlertTriangle className="w-8 h-8 text-orange-400 opacity-50 mb-1" />
                  <p className="font-semibold">Sinif tapılmadı</p>
                  <p className="text-orange-600/80 text-xs">
                    Faylda heç bir etibarlı sinif və ya variant məlumatı aşkar
                    edilmədi.
                  </p>
                </div>
              )}
            </div>

            {/* Answer Keys Section */}
            <div className="lg:col-span-3">
              {parsedData && detectedClasses.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-full flex flex-col">
                  {/* Header & Tabs */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                          <Key className="w-4 h-4" />
                        </div>
                        Doğru Cavablar
                      </h3>
                      <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                        {detectedClasses.length} Sinif tapıldı
                      </span>
                    </div>

                    {/* Modern Class Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                      {detectedClasses.map((cls) => {
                        const variants = neededKeys[cls] || [];
                        const config = configMap[cls] || configMap["default"];
                        const requiredLength = config.reduce(
                          (acc, curr) => acc + curr.length,
                          0
                        );

                        const isComplete = variants.every(
                          (v) =>
                            (answerKeys[cls]?.[v] || "").length >=
                              requiredLength && requiredLength > 0
                        );

                        return (
                          <button
                            key={cls}
                            onClick={() => setActiveClass(cls)}
                            className={cn(
                              "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
                              activeClass === cls
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <span>{cls}-ci sinif</span>
                            {isComplete && (
                              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inputs Area */}
                  <div className="p-6 overflow-y-auto flex-1 bg-white">
                    {activeClass && (
                      <div className="flex flex-col gap-6">
                        {(neededKeys[activeClass] || []).map((variant) => (
                          <SubjectKeyInputs
                            key={variant}
                            variant={variant}
                            config={
                              configMap[activeClass] || configMap["default"]
                            }
                            value={answerKeys[activeClass]?.[variant] || ""}
                            onChange={(newValue) => {
                              setAnswerKeys((prev) => ({
                                ...prev,
                                [activeClass]: {
                                  ...(prev[activeClass] || {}),
                                  [variant]: newValue,
                                },
                              }));
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {!activeClass && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Key className="w-12 h-12 mb-3 opacity-20" />
                        <p>Cavabları daxil etmək üçün sinif seçin</p>
                      </div>
                    )}
                  </div>

                  {/* Action Area */}
                  <div className="pt-6 mt-auto">
                    <button
                      onClick={handleCheckAnswers}
                      disabled={!allNeededKeysFilled}
                      className={cn(
                        "w-full relative overflow-hidden py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg active:scale-[0.98]",
                        allNeededKeysFilled
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:brightness-110"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      )}
                    >
                      {allNeededKeysFilled ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          NƏTİCƏLƏRİ YOXLA
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Ən azı bir cavab daxil edin
                        </span>
                      )}
                    </button>
                    {!allNeededKeysFilled && (
                      <p className="text-[10px] text-center mt-3 text-slate-400 font-medium">
                        Cavabları yoxlamaq üçün variantlardan heç olmasa birini
                        doldurun.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Results Table - Visible ONLY after Check Answers */}
          <div className="w-full">
            {showResults && parsedData ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[800px]">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Correct:{" "}
                      <span className="font-semibold text-slate-900">
                        {validCount}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      Errors:{" "}
                      <span className="font-semibold text-slate-900">
                        {invalidCount}
                      </span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Total: {validCount} student(s)
                  </div>
                </div>

                {/* Detached Header for Virtualization */}
                <div className="flex-none border-b border-slate-200 bg-slate-50 relative z-20 shadow-sm">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-3 font-semibold w-[80px]">
                          İş №
                        </th>
                        <th className="px-3 py-3 font-semibold w-[200px]">
                          Ad Soyad
                        </th>
                        <th className="px-2 py-3 font-semibold w-[150px]">
                          Sinif
                        </th>
                        <th className="px-2 py-3 font-semibold w-[50px] text-center">
                          Var
                        </th>
                        <th className="px-3 py-3 font-semibold w-[100px] text-center bg-blue-50/50 text-indigo-600">
                          Yekun
                        </th>
                        {allUniqueSubjects.map((subject) => {
                          const width = Math.max(100, subject.length * 15);
                          return (
                            <th
                              key={subject.id}
                              className="px-3 py-3 font-semibold text-right whitespace-nowrap"
                              style={{
                                minWidth: `${width}px`,
                                width: `${width}px`,
                              }}
                            >
                              {subject.name.slice(0, 5).toUpperCase()}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                  </table>
                </div>

                {/* Virtualized Body */}
                <div
                  ref={scrollRef}
                  className="overflow-auto flex-1 w-full relative bg-white"
                >
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <table
                      className="w-full text-left border-collapse table-fixed"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transform: `translateY(${
                          rowVirtualizer.getVirtualItems()[0]?.start ?? 0
                        }px)`,
                      }}
                    >
                      <tbody className="divide-y divide-slate-100">
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                          const item = allValidData[virtualRow.index];
                          return (
                            <TableRow
                              key={item.id}
                              item={item}
                              configMap={configMap}
                              allUniqueSubjects={allUniqueSubjects}
                              onGeneratePDF={handleGenerateSinglePDF}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : parsedData ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border border-slate-200 border-dashed rounded-xl bg-slate-50/50 min-h-[400px]">
                <Search className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-500">
                  Nəticələr gözlənilir...
                </p>
                <p className="text-sm">
                  Zəhmət olmasa soldakı paneldə cavabları daxil edib "Cavabları
                  Yoxla" düyməsini sıxın.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border border-slate-200 border-dashed rounded-xl bg-slate-50/50 min-h-[400px]">
                <FileText className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-500">
                  Məlumat yoxdur
                </p>
                <p className="text-sm">
                  Analiz etmək üçün fayl yükləyin və ya mətn daxil edin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
