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
  ChevronDown,
  ChevronUp,
  Database,
} from "lucide-react";
import {
  ParsedStudent,
  SubjectConfig,
  SubjectSegment,
  DEFAULT_SUBJECT_CONFIG,
  CLASS_CONFIGS,
  BURAXILIS_CONFIGS,
  parseOMRData,
} from "@/lib/omr-parser";
import { ParsingDebugger } from "./parsing-debugger";
import { gradeStudent, GradedStudent, SubjectScore } from "@/lib/grading";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  generateCombinedPDF,
  downloadCombinedPDF,
  downloadPDF,
} from "@/lib/pdf-utils";
import { useSession, signOut } from "next-auth/react";

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
// Internal component for the subject row
const SubjectRow = React.memo(
  ({
    subject,
    index,
    handleUpdateSubject,
    handleSegmentConfigUpdate,
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
    handleSegmentConfigUpdate: (
      subjectIdx: number,
      segmentIdx: number,
      field: keyof SubjectSegment,
      val: number
    ) => void;
    handleRemoveSubject: (idx: number) => void;
    dragListeners?: any;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="flex flex-col bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 p-3">
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
                <div className="relative">
                    <input
                      type="text"
                      value={subject.segments ? `${subject.segments.reduce((acc, s) => acc + s.count, 0)} sual` : subject.length}
                      disabled={true}
                      readOnly
                      className={cn(
                          "w-20 bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center",
                           "bg-slate-50 text-slate-500"
                      )}
                    />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium ml-1">
                  Bal
                </span>
                <input
                  type="number"
                  value={subject.points !== undefined ? Number(subject.points).toFixed(0) : 0}
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
            
            {subject.segments && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                </button>
            )}

            <button
              onClick={() => handleRemoveSubject(index)}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
        </div>
        
        {/* Expanded Segment Editor */}
        {isExpanded && subject.segments && (
            <div className="bg-slate-50 p-4 border-t border-slate-100 grid gap-3 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-slate-400 px-2">
                    <div className="col-span-4">Sual Tipi</div>
                    <div className="col-span-4 text-center">Sual Sayı</div>
                    <div className="col-span-4 text-center">1 Sualın Balı</div>
                </div>
                {subject.segments.map((seg, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <div className="col-span-4 text-xs font-semibold text-slate-700 px-2 capitalize">
                           {seg.type === 'closed' ? 'Qapalı' : seg.type === 'open' ? 'Açıq' : 'Yazı'}
                        </div>
                        <div className="col-span-4 flex justify-center">
                            <input
                                type="number"
                                min={0}
                                value={seg.count}
                                onChange={(e) => handleSegmentConfigUpdate(index, i, 'count', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-center border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="col-span-4 flex justify-center">
                            <input
                                type="number"
                                min={0}
                                step={0.1}
                                value={seg.points}
                                disabled={seg.type === 'written'} // Disable for Written
                                onChange={(e) => handleSegmentConfigUpdate(index, i, 'points', parseFloat(e.target.value) || 0)}
                                className={cn(
                                    "w-16 px-2 py-1 text-center border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none font-mono text-indigo-600",
                                    seg.type === 'written' && "bg-slate-100 text-slate-400 cursor-not-allowed"
                                )}
                            />
                        </div>
                    </div>
                ))}
                <div className="text-center text-xs text-slate-400 mt-2 font-medium">
                    Toplam Sual: {subject.segments.reduce((acc, s) => acc + s.count, 0)} | 
                    Təxmini Toplam Bal: {subject.segments.reduce((acc, s) => acc + (s.count * s.points), 0).toFixed(1)}
                </div>
            </div>
        )}
      </div>
    );
  }
);
SubjectRow.displayName = "SubjectRow"; // Re-add display name


const SubjectKeyInputs = ({
  variant,
  languages,
  values,
  onChange,
  config,
  openWeights,
  onOpenWeightsChange,
}: {
  variant: string;
  languages: string[];
  values: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  config: SubjectConfig[];
  openWeights?: Record<string, number[]>;
  onOpenWeightsChange?: (subjectId: string, weights: number[]) => void;
}) => {
  // Helper to calculate actual char length of a subject
  const getSubjectLength = (s: SubjectConfig) => {
      if (s.segments && s.segments.length > 0) {
          return s.segments.reduce((acc, seg) => acc + (seg.count * seg.lengthPerItem), 0);
      }
      return s.length || 0;
  };

  const handleSubjectChange = (subjectIndex: number, newValue: string, optLang?: string) => {
    const totalLength = config.reduce((acc, s) => acc + getSubjectLength(s), 0);
    const updates: Record<string, string> = {};

    languages.forEach(lang => {
       if (optLang !== undefined && lang !== optLang) return; // Only update specific lang if specified

       let currentIndex = 0;
       let newValueFull = values[lang] || "";
       if (newValueFull.length < totalLength) newValueFull = newValueFull.padEnd(totalLength, " ");

       let result = "";
       config.forEach((subj, idx) => {
         const segLen = getSubjectLength(subj);
         const oldSeg = newValueFull.slice(currentIndex, currentIndex + segLen);

         if (idx === subjectIndex) {
           result += newValue.padEnd(segLen, " ").slice(0, segLen);
         } else {
           result += oldSeg.padEnd(segLen, " ").slice(0, segLen);
         }
         currentIndex += segLen;
       });
       updates[lang] = result;
    });

    onChange(updates);
  };

  const handleSegmentChange = (
    subjectIndex: number,
    segmentIndex: number,
    newValue: string,
    optLang: string
  ) => {
    const subject = config[subjectIndex];
    if (!subject) return;
    
    let subjectGlobalStart = 0;
    for(let i=0; i<subjectIndex; i++) {
        subjectGlobalStart += getSubjectLength(config[i]);
    }
    
    const subjectLength = getSubjectLength(subject);
    const effectiveLang = optLang === "ALL" ? (languages[0] || "") : optLang;
    const valFull = values[effectiveLang] || "";
    const currentSubjectValue = valFull.slice(subjectGlobalStart, subjectGlobalStart + subjectLength).padEnd(subjectLength, " ");

    if (!subject.segments) {
        handleSubjectChange(subjectIndex, newValue, optLang === "ALL" ? undefined : optLang);
        return;
    }

    let segStart = 0;
    let newSubjectString = "";
    
    subject.segments.forEach((seg, idx) => {
        const segLen = seg.count * seg.lengthPerItem;
        const currentSegValue = currentSubjectValue.slice(segStart, segStart + segLen);
        
        if (idx === segmentIndex) {
            newSubjectString += newValue.padEnd(segLen, " ").slice(0, segLen);
        } else {
            newSubjectString += currentSegValue;
        }
        segStart += segLen;
    });

    handleSubjectChange(subjectIndex, newSubjectString, optLang === "ALL" ? undefined : optLang);
  }

  const [editingSegment, setEditingSegment] = useState<{subjectIndex: number, segmentIndex: number, lang: string} | null>(null);

  let currentReadIndex = 0;

  return (
    <div className="flex flex-col gap-3 w-full p-4 bg-slate-50/50 rounded-xl border border-slate-100 relative">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
          {variant}
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Variantı
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        {config.map((subject, subjectIdx) => {
          const subjLen = getSubjectLength(subject);
          const start = currentReadIndex;
          const end = currentReadIndex + subjLen;
          
          currentReadIndex += subjLen;

          const isLanguageDependent = subject.id === 'xariciDil' && languages.length > 1 && languages.some(l => l !== "");
          const langsToRender = isLanguageDependent ? languages : [languages[0] || ""];

          return (
            <div
              key={subject.id || subjectIdx}
              className="flex flex-col items-start gap-3"
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    (subject.color || "").split(" ")[0]
                  )}
                ></div>
                <label
                  className="text-xs font-semibold text-slate-700 truncate"
                  title={subject.name}
                >
                  {subject.name}
                </label>
              </div>

              <div className="flex flex-col gap-2 relative">
                  {langsToRender.map(lang => {
                      const valFull = values[lang] || "";
                      const rawSubjectValue = valFull.slice(start, end).padEnd(subjLen, " ");

                      return (
                          <div key={lang || "default"} className="flex flex-col gap-1">
                              {isLanguageDependent && (
                                  <div className="text-[10px] font-bold text-slate-400">
                                      {lang} DİLİ
                                  </div>
                              )}
                              {!subject.segments ? (
                                <div className="relative" style={{ width: `${Math.max((subject.length || 0) + 4, 14)}ch` }}>
                                    <input
                                    type="text"
                                    value={rawSubjectValue.trim()}
                                    maxLength={subject.length}
                                    onChange={(e) =>
                                        handleSubjectChange(subjectIdx, e.target.value.toUpperCase(), isLanguageDependent ? lang : undefined)
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none uppercase transition-all shadow-sm"
                                    placeholder="Cavab..."
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono pointer-events-none">
                                    {rawSubjectValue.trim().length}/{subject.length}
                                    </span>
                                </div>
                              ) : (
                                  <div className="flex items-start gap-2">
                                       {subject.segments.map((seg, segIdx) => {
                                           let segStart = 0;
                                           for(let k=0; k<segIdx; k++) {
                                               const s = subject.segments![k];
                                               if (s) segStart += s.count * s.lengthPerItem;
                                           }
                                           
                                           const segLen = seg.count * seg.lengthPerItem;
                                           const segVal = rawSubjectValue.slice(segStart, segStart + segLen);
                                           
                                           const label = seg.type === 'closed' ? 'Qapalı' : seg.type === 'open' ? 'Açıq' : 'Yazı';
                                           const showLabel = subject.segments!.length > 1;
                                           const inputWidth = Math.max(segLen + 2, 8); // ch

                                           if (seg.type === 'open' || seg.type === 'written') {
                                                return (
                                                    <div key={segIdx} className="flex flex-col gap-1 w-full flex-1 min-w-[120px]">
                                                        {showLabel && <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{label}</span>}
                                                        <button
                                                            onClick={() => setEditingSegment({ subjectIndex: subjectIdx, segmentIndex: segIdx, lang: isLanguageDependent ? lang : "ALL" })}
                                                            className={cn("w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 h-[38px]",
                                                                seg.type === 'written' ? "text-amber-600 bg-amber-50 hover:bg-amber-100 hover:border-amber-300" : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300"
                                                            )}
                                                        >
                                                            <Key className="w-3 h-3" />
                                                            Daxil et
                                                        </button>
                                                         <span className="text-[8px] text-slate-300 font-mono text-right px-1">
                                                            {seg.count} sual
                                                        </span>
                                                    </div>
                                                );
                                            }

                                           return (
                                               <div key={segIdx} className="flex flex-col gap-1">
                                                    {showLabel && <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{label}</span>}
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={segVal.trim()}
                                                            maxLength={segLen}
                                                            onChange={(e) => handleSegmentChange(subjectIdx, segIdx, e.target.value.toUpperCase(), isLanguageDependent ? lang : "ALL")}
                                                            className={cn(
                                                                "bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-mono tracking-widest text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:outline-none uppercase transition-all shadow-sm",
                                                            )}
                                                            style={{ width: `${inputWidth}ch`, minWidth: '60px' }}
                                                            placeholder="..."
                                                        />
                                                         <span className="absolute right-1 bottom-0.5 text-[8px] text-slate-300 font-mono pointer-events-none">
                                                            {seg.count}
                                                        </span>
                                                    </div>
                                               </div>
                                           )
                                       })}
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Detail Editor Modal */}
      {editingSegment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                   <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        {(() => {
                            const { subjectIndex, segmentIndex } = editingSegment;
                            const subject = config[subjectIndex];
                            const seg = subject.segments![segmentIndex];
                            
                            let localOpenStart = 0;
                            for(let k=0; k<segmentIndex; k++) {
                                const s = subject.segments![k];
                                if (s && (s.type === 'open' || s.type === 'written')) localOpenStart += s.count;
                            }
                            
                            // Smart Validator Logic
                            if (seg.type === 'written') {
                                const currentWeights = (openWeights && openWeights[subject.id]) ? openWeights[subject.id] : [];
                                const segmentWeights = currentWeights.slice(localOpenStart, localOpenStart + seg.count);
                                
                                // Calculate Fixed Score (Closed + Numeric)
                                console.log('segments', subject.segments);
                                const fixedScore = subject.segments!.reduce((acc, s) => {
                                    if(s.type === 'closed' || s.type === 'open') {
                                        return acc + (s.count * s.points);
                                    }
                                    return acc;
                                }, 0);
                                
                                const totalTarget = 100; // Assumed Standard
                                const remainingForOpen = totalTarget - fixedScore;
                                
                                // Calculate Current Explicit Total
                                const currentOpenTotal = Array.from({ length: seg.count }).reduce((acc, _, i) => {
                                    return (acc as number) + (segmentWeights[i] !== undefined ? segmentWeights[i] : seg.points);
                                }, 0) as number;
                                const finalTotal = fixedScore + currentOpenTotal;
                                const isOver = finalTotal > totalTarget;
                                
                                return (
                                    <div className="flex flex-col gap-1 w-full mr-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-slate-700">Yazı Sual Əmsalları</h3>
                                            <div className={cn("px-2 py-1 rounded text-xs font-bold border", isOver ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200")}>
                                                Total: {finalTotal.toFixed(1)} / {totalTarget}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-[10px] text-slate-500 gap-3">
                                            <span>Qapalı/Açıq: <b>{fixedScore}</b></span>
                                            <span>Yazı Limit: <b>{remainingForOpen}</b></span>
                                            <span className={isOver ? "text-red-600 font-bold" : "text-slate-700 font-bold"}>
                                                Siz: {currentOpenTotal.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                            
                            return <h3 className="font-bold text-slate-700">Açıq Suallar</h3>
                        })()}
                      <button onClick={() => setEditingSegment(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5"/>
                      </button>
                  </div>
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-4">
                          {(() => {
                              const { subjectIndex, segmentIndex, lang } = editingSegment;
                              const actLang = lang === "ALL" ? (languages[0] || "") : lang;
                              const valFull = values[actLang] || "";

                              const subject = config[subjectIndex];
                              const seg = subject.segments![segmentIndex];
                              
                              let localOpenStart = 0;
                              for(let k=0; k<segmentIndex; k++) {
                                  const s = subject.segments![k];
                                  if (s && (s.type === 'open' || s.type === 'written')) localOpenStart += s.count;
                              }
                              
                              if (seg.type === 'open' && openWeights && onOpenWeightsChange) {
                                  // Open Question Mode (Weight Input AND Answer Key)
                                  const currentWeights = openWeights[subject.id] || [];
                                  const segmentWeights = currentWeights.slice(localOpenStart, localOpenStart + seg.count);
                                  
                                  // Calculate Total Score for Header
                                  const fixedScore = subject.segments!.reduce((acc, s) => {
                                    if(s.type === 'closed') {
                                        return acc + (s.count * s.points);
                                    }
                                    return acc;
                                  }, 0);

                                  const totalTarget = 100; 
                                  const currentOpenTotal = Array.from({ length: seg.count }).reduce((acc, _, i) => {
                                      return (acc as number) + (segmentWeights[i] !== undefined ? segmentWeights[i] : seg.points);
                                  }, 0) as number;
                                  
                                  const effectiveOpenTotal = currentOpenTotal;

                                   const finalTotal = fixedScore + effectiveOpenTotal;
                                  
                                  const isOver = finalTotal > totalTarget + 0.5;

                                  // Calculate Offsets Inline
                                  let subjectStart = 0;
                                  for(let i=0; i<subjectIndex; i++) {
                                      const s = config[i];
                                      if (s.segments) {
                                          subjectStart += s.segments.reduce((acc, seg) => acc + (seg.count * seg.lengthPerItem), 0);
                                      } else {
                                          subjectStart += (s.length || 0);
                                      }
                                  }
                                  
                                  let segmentStart = 0;
                                  for(let k=0; k<segmentIndex; k++) {
                                       const s = subject.segments![k];
                                       if (s) segmentStart += s.count * s.lengthPerItem;
                                  }
                                  const segmentGlobalStart = subjectStart + segmentStart;

                                  const renderList = [];
                                  for(let i=0; i<seg.count; i++) {
                                      const globalQIndex = localOpenStart + i;
                                      const itemGlobalStart = segmentGlobalStart + (i * seg.lengthPerItem);
                                      const itemVal = valFull.slice(itemGlobalStart, itemGlobalStart + seg.lengthPerItem).trim();
                                      const weight = currentWeights[globalQIndex] !== undefined ? currentWeights[globalQIndex] : seg.points;

                                      renderList.push(
                                         <div key={i} className="flex items-center gap-2 mb-2 p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                                             <span className="w-20 text-xs font-bold text-slate-400">SUAL {i+1}</span>
                                             
                                             <input
                                                 type="text"
                                                 maxLength={seg.lengthPerItem}
                                                 value={itemVal}
                                                 onChange={(e) => {
                                                     const newVal = e.target.value.padEnd(seg.lengthPerItem, ' ').slice(0, seg.lengthPerItem); 
                                                     const currentFull = valFull.padEnd(segmentGlobalStart + (seg.count * seg.lengthPerItem), ' ');
                                                     const pre = currentFull.slice(0, itemGlobalStart);
                                                     const post = currentFull.slice(itemGlobalStart + seg.lengthPerItem);
                                                     
                                                     const newFullStr = pre + newVal + post;
                                                     const updates = { ...values };
                                                     if (lang === "ALL") {
                                                         languages.forEach(l => updates[l] = newFullStr);
                                                     } else {
                                                         updates[lang] = newFullStr;
                                                     }
                                                     onChange(updates);
                                                 }}
                                                 className="flex-1 px-3 py-2 border border-slate-200 rounded text-sm font-mono tracking-widest focus:border-indigo-500 outline-none uppercase"
                                                 placeholder="_____"
                                             />
                                             
                                              {openWeights && onOpenWeightsChange && (
                                                 <div className="flex items-center gap-1 relative group">
                                                     <span className="text-[9px] text-slate-300 absolute -top-2 left-0 w-full text-center">Bal</span>
                                                     <input
                                                         type="number"
                                                         step={0.1}
                                                         min={0}
                                                         value={weight}
                                                         onChange={(e) => {
                                                             const val = parseFloat(e.target.value);
                                                             if (isNaN(val)) return;
                                                             const newWeights = [...currentWeights];
                                                             newWeights[globalQIndex] = val;
                                                             onOpenWeightsChange(subject.id, newWeights);
                                                         }}
                                                         className="w-20 px-2 py-2 border border-amber-200 bg-amber-50 text-amber-700 rounded text-sm font-bold text-center focus:border-amber-500 outline-none"
                                                     />
                                                 </div>
                                              )}
                                         </div>
                                      );
                                  }

                                  return (
                                      <div className="flex flex-col gap-4">
                                          <div className="flex flex-col gap-1 w-full mr-8">
                                              <div className="flex items-center justify-between">
                                                  <h3 className="font-bold text-slate-700">Açıq Sual Əmsalları</h3>
                                                  <div className={cn("px-2 py-1 rounded text-xs font-bold border", isOver ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200")}>
                                                      Total: {finalTotal.toFixed(1)} / {totalTarget}
                                                  </div>
                                              </div>
                                              <div className="flex items-center text-[10px] text-slate-500 gap-3">
                                                  <span>Qapalı: <b>{fixedScore}</b></span>
                                                  <span>Açıq Limit: <b>{totalTarget - fixedScore}</b></span>
                                                  <span className={isOver ? "text-red-600 font-bold" : "text-slate-700 font-bold"}>
                                                      Siz: {currentOpenTotal.toFixed(1)}
                                                  </span>
                                              </div>
                                          </div>
                                          <div>
                                            {renderList}
                                          </div>
                                      </div>
                                  )
                              }
                              
                              if (seg.type === 'written' && openWeights && onOpenWeightsChange) {
                                  // Open Question Mode (Weight Input)
                                  const currentWeights = openWeights[subject.id] || [];
                                  
                                  return Array.from({ length: seg.count }).map((_, qIdx) => {
                                      const globalQIndex = localOpenStart + qIdx;
                                      return (
                                          <div key={qIdx} className="flex items-center gap-4">
                                              <span className="w-16 text-xs font-bold text-slate-500 uppercase">Sual {qIdx + 1}</span>
                                              <input
                                                  type="number"
                                                  step="0.01"
                                                  value={currentWeights[globalQIndex] === undefined ? seg.points : currentWeights[globalQIndex] === 0 ? "0" : currentWeights[globalQIndex]}
                                                  onFocus={(e) => e.target.select()}
                                                  placeholder={`Əmsal (məs: ${seg.points})`}
                                                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-lg font-mono text-center focus:ring-2 focus:ring-amber-500 outline-none text-amber-700 font-bold"
                                                  onChange={(e) => {
                                                      let val = e.target.value;
                                                      
                                                      // UX: If value is "01", "05" etc, remove leading zero
                                                      if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
                                                          val = val.substring(1);
                                                      }

                                                      const numVal = parseFloat(val);
                                                      const newWeights = [...currentWeights];
                                                      
                                                      // If empty string or NaN, store as 0 but maybe we want to allow empty?
                                                      // Let's store 0 for logic, but UI handles empty.
                                                      newWeights[globalQIndex] = isNaN(numVal) ? 0 : numVal;
                                                      onOpenWeightsChange(subject.id, newWeights);
                                                  }}
                                              />
                                          </div>
                                      )
                                  });
                              }
                              
                              // Numeric Question Mode (String Input)
                              // Calculate start index
                              let start = 0;
                              for(let i=0; i<subjectIndex; i++) {
                                  const s = config[i];
                                  if (s.segments) {
                                      start += s.segments.reduce((acc, seg) => acc + (seg.count * seg.lengthPerItem), 0);
                                  } else {
                                      start += (s.length || 0);
                                  }
                              }
                              const segmentStart = subject.segments!.slice(0, segmentIndex).reduce((acc, s) => acc + (s.count * s.lengthPerItem), 0);
                              const globalStart = start + segmentStart;
                              const segmentValue = valFull.slice(globalStart, globalStart + (seg.count * seg.lengthPerItem)).padEnd(seg.count * seg.lengthPerItem, " ");
                              
                              return Array.from({ length: seg.count }).map((_, qIdx) => {
                                  const qStart = qIdx * seg.lengthPerItem;
                                  const qVal = segmentValue.slice(qStart, qStart + seg.lengthPerItem);
                                  
                                  return (
                                      <div key={qIdx} className="flex items-center gap-4">
                                          <span className="w-16 text-xs font-bold text-slate-500 uppercase">Sual {qIdx + 1}</span>
                                          <input
                                              type="text"
                                              value={qVal.trim()}
                                              maxLength={seg.lengthPerItem}
                                              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-lg font-mono tracking-[0.5em] text-center uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                                              placeholder="....."
                                              onChange={(e) => {
                                                  // Construct new full segment string
                                                  const newVal = e.target.value.slice(0, seg.lengthPerItem);
                                                  const newSegmentValue = 
                                                      segmentValue.slice(0, qStart) + 
                                                      newVal.padEnd(seg.lengthPerItem, " ") + 
                                                      segmentValue.slice(qStart + seg.lengthPerItem);
                                                  
                                                  handleSegmentChange(subjectIndex, segmentIndex, newSegmentValue, lang);
                                              }}
                                          />
                                      </div>
                                  );
                              });
                          })()}
                      </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button 
                          onClick={() => setEditingSegment(null)}
                          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                          Təsdiqlə
                      </button>
                  </div>
              </div>
          </div>
      )}
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
      (acc, curr) => {
          if (curr.segments) return acc + curr.segments.reduce((sAcc, s) => sAcc + (s.count * s.points), 0);
          return acc + (curr.length || 0) * (curr.points || 0);
      },
      0
    );

    return (
      <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100">
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
          {item.scores ? Number(totalScore.toFixed(2)) : "-"}
          <span className="text-[10px] text-slate-400 block font-normal">
            / {Math.round(maxScore)}
          </span>
        </td>

        {allUniqueSubjects.map((subject) => {
          const score = item.scores
            ? (item.scores[subject.id] as SubjectScore)
            : null;
            
          // Find actual config for this student's class to get segments
          const studentSubjectConfig = config.find(s => s.id === subject.id);
          const segments = studentSubjectConfig?.segments || [{ type: 'closed', count: subject.length || 0, points: 0, lengthPerItem: 1 }];

          const width = Math.max(120, (subject.length || 10) * 12);

          return (
            <td
              key={subject.id}
              className="px-3 py-2 text-left border-l border-slate-50 align-top"
              style={{ minWidth: `${width}px`, width: `${width}px` }}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {score ? Number(score.netScore.toFixed(2)) : "-"}
                </span>
                
                {score && score.studentAnswerString && (
                  <div className="flex flex-wrap gap-1 mt-1 select-none">
                     {(() => {
                         let currentIndex = 0;
                         return segments.map((seg, segIdx) => {
                             const segLen = seg.count * seg.lengthPerItem;
                             const sSegment = score.studentAnswerString.slice(currentIndex, currentIndex + segLen);
                             const kSegment = score.correctAnswerString.slice(currentIndex, currentIndex + segLen);
                             currentIndex += segLen;
                             
                             if (seg.type === 'closed') {
                                 return sSegment.split('').map((char, i) => {
                                     const keyChar = kSegment[i] || ' ';
                                     let color = "bg-slate-100 text-slate-400"; // Default/Empty
                                     
                                     if (keyChar === '*') {
                                        color = "bg-green-100 text-green-700 border-green-200";
                                     } else if (char === ' ') {
                                        color = "bg-slate-50 text-slate-300 border-slate-100";
                                     } else if (char === keyChar) {
                                        color = "bg-green-100 text-green-700 border-green-200 font-bold";
                                     } else {
                                        color = "bg-red-50 text-red-600 border-red-100 font-bold";
                                     }
                                     return (
                                         <span key={`c-${segIdx}-${i}`} className={cn("w-4 h-4 text-[10px] flex items-center justify-center rounded border", color)}>
                                             {char}
                                         </span>
                                     )
                                 });
                             } 
                             else if (seg.type === 'open') {
                                 // Render chunks of 5
                                 const answers: React.ReactNode[] = [];
                                 for(let i=0; i<seg.count; i++) {
                                     const start = i * seg.lengthPerItem;
                                     const sVal = sSegment.slice(start, start + seg.lengthPerItem).trim();
                                     const kVal = kSegment.slice(start, start + seg.lengthPerItem).trim();
                                     
                                     const isCorrect = sVal && kVal && sVal === kVal;
                                     const color = isCorrect ? "bg-green-50 text-green-700 border-green-200" : sVal ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-300";
                                     
                                     answers.push(
                                         <span key={`n-${segIdx}-${i}`} className={cn("px-1.5 py-0.5 text-[9px] font-mono rounded border whitespace-nowrap", color)} title={`Correct: ${kVal}`}>
                                             {sVal || "-"}
                                         </span>
                                     );
                                 }
                                 return answers;
                             }
                             else if (seg.type === 'written') {
                                 // Render scores
                                 const answers: React.ReactNode[] = [];
                                 for(let i=0; i<seg.count; i++) {
                                     const sVal = sSegment[i]; // Char 0, 1, 2
                                     const scoreVal = parseInt(sVal) || 0;
                                     const color = scoreVal > 0 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-300 border-slate-200";
                                     
                                     answers.push(
                                         <span key={`o-${segIdx}-${i}`} className={cn("w-4 h-4 text-[10px] flex items-center justify-center rounded border font-bold", color)} title={`Score: ${sVal}`}>
                                             {sVal}
                                         </span>
                                     )
                                 }
                                  return (
                                      <div key={`g-${segIdx}`} className="flex gap-0.5 ml-1 pl-1 border-l border-slate-200">
                                          {answers}
                                      </div>
                                  );
                             }
                         })
                     })()}
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
  const { data: session } = useSession();
  const [examType, setExamType] = useState<'standard' | 'buraxilis'>('standard');
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedStudent[] | null>(null);
  const [gradedData, setGradedData] = useState<GradedStudent[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [configMap, setConfigMap] = useState<Record<string, SubjectConfig[]>>({
    ...CLASS_CONFIGS,
    ...BURAXILIS_CONFIGS, // Merge Buraxilis configs
    default: DEFAULT_SUBJECT_CONFIG,
  });

  useEffect(() => {
    if (examType === 'buraxilis') {
        setConfigMap({
            default: BURAXILIS_CONFIGS['09'] || DEFAULT_SUBJECT_CONFIG, 
            ...BURAXILIS_CONFIGS
        });
      setActiveClass("09");
      
    } else {
      setConfigMap({
        default: DEFAULT_SUBJECT_CONFIG,
        ...CLASS_CONFIGS,
      });
      setConfigActiveTab("01");
      setActiveClass("01");
    }
    // Only clear parsed results, KEEP the raw text/file input so user doesn't lose it if they switch modes.
    // This also fixes the issue where inputs might be freezing if this effect runs too often.
    setParsedData(null);
    setGradedData(null);
    setNeededKeys({});
    setShowResults(false);
  }, [examType]);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configActiveTab, setConfigActiveTab] = useState<string>("01");

  const [neededKeys, setNeededKeys] = useState<Record<string, string[]>>({});
  const [detectedLangs, setDetectedLangs] = useState<Record<string, Record<string, string[]>>>({});
  const [activeClass, setActiveClass] = useState<string>("");

  const [examName, setExamName] = useState<string>("");
  const [examDate, setExamDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const [includeRank, setIncludeRank] = useState(true);
  const [isSavingToDB, setIsSavingToDB] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
  const headerScrollRef = useRef<HTMLDivElement>(null);

  // 1. Worker Lifecycle (Mount/Unmount)
  const [openWeights, setOpenWeights] = useState<Record<string, Record<string, number[]>>>({}); // {class: {subjectId: [w1, w2]}}

  const handleParse = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    
    // Slight timeout allows UI to render the loading state
    setTimeout(() => {
      try {
        const parseMode = examType === 'buraxilis' ? 'buraxilis' : 'legacy';
        const results = parseOMRData(rawText, configMap, parseMode);
        handleParseComplete(results);
      } catch (error: any) {
        console.error("Parse Error:", error);
        alert("An error occurred during parsing: " + error.message);
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  };

  const handleParseComplete = (results: ParsedStudent[]) => {
    setParsedData(results);

    const detected: Record<string, Set<string>> = {};
    const detectedLangsBuild: Record<string, Record<string, Set<string>>> = {};
    const detectedClassesSet = new Set<string>();

    results.forEach((student) => {
      if (student.isValid) {
        if (!detected[student.sinif]) detected[student.sinif] = new Set();
        detected[student.sinif].add(student.variant);

        if (!detectedLangsBuild[student.sinif]) detectedLangsBuild[student.sinif] = {};
        if (!detectedLangsBuild[student.sinif][student.variant]) detectedLangsBuild[student.sinif][student.variant] = new Set();
        
        if (examType === 'buraxilis' && student.dil && student.dil.trim() !== '') {
            detectedLangsBuild[student.sinif][student.variant].add(student.dil.toUpperCase());
        }
        
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

    const finalLangs: Record<string, Record<string, string[]>> = {};
    Object.keys(detectedLangsBuild).forEach(cls => {
       finalLangs[cls] = {};
       Object.keys(detectedLangsBuild[cls]).forEach(v => {
          finalLangs[cls][v] = Array.from(detectedLangsBuild[cls][v]).sort();
       });
    });
    setDetectedLangs(finalLangs);

    const detectedClasses = Object.keys(finalNeeded);
    if (detectedClasses.length > 0) {
      setActiveClass(detectedClasses[0]);
    }

    setShowResults(false);
  };

  useEffect(() => {
    if (parsedData && parsedData.length > 0) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        try {
          const gradedResults = parsedData.map(student => {
            if (!student.isValid) return student;
            const classKeys = answerKeys[student.sinif];
            let key = '';
            if (classKeys) {
                const complexKey = `${student.variant}-${(student.dil || '').toUpperCase().trim()}`;
                if (classKeys[complexKey]) {
                    key = classKeys[complexKey];
                } else if (classKeys[student.variant]) {
                    key = classKeys[student.variant];
                }
            }
            const config = configMap[student.sinif] || configMap['default'];
            const classWeights = openWeights ? openWeights[student.sinif] : undefined;
            return gradeStudent(student, key || '', config, classWeights);
          });
          setGradedData(gradedResults);
        } catch (error) {
          console.error("Grade Error:", error);
          alert("Qrammatik/Qymətləndirmə xətası: " + (error as Error).message);
        } finally {
          setIsProcessing(false);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [parsedData, answerKeys, configMap, openWeights]);

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
    setOpenWeights({});
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

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
        examType: examType,
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
          examType: examType,
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

  const handleSaveToDatabase = async () => {
    if (!gradedData || gradedData.length === 0) return;
    if (!examName.trim()) {
      alert('Zəhmət olmasa imtahan adını daxil edin.');
      return;
    }

    setIsSavingToDB(true);
    setSaveStatus('idle');

    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName: examName.trim(),
          examDate,
          examType,
          students: gradedData,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Naməlum xəta');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err: any) {
      console.error('[handleSaveToDatabase]', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } finally {
      setIsSavingToDB(false);
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
        setRawText(text);
        setParsedData(null);
        setGradedData(null);
        setNeededKeys({});
        setShowResults(false);
        setActiveClass("");
      };
      reader.readAsText(file);
    }
  }, []);

  const allValidData = useMemo(
    () => gradedData?.filter((d) => d.isValid) || [],
    [gradedData]
  );

  const rowVirtualizer = useVirtualizer({
    count: allValidData.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 53,
    overscan: 20,
  });

  const validCount = gradedData?.filter((d) => d.isValid).length ?? 0;
  const invalidCount = gradedData?.filter((d) => !d.isValid).length ?? 0;

  const allNeededKeysFilled = useMemo(() => {
    if (Object.keys(neededKeys).length === 0) return false;
    return Object.entries(neededKeys).some(([cls, variants]) => {
      return variants.some((variant) => {
        // Check direct key first
        const directKey = answerKeys[cls]?.[variant] || "";
        if (directKey.length > 0) return true;
        // Check language-specific keys (e.g. A-I, A-R)
        const langs = detectedLangs[cls]?.[variant] || [];
        if (langs.length > 0) {
          return langs.some(l => (answerKeys[cls]?.[`${variant}-${l}`] || "").length > 0);
        }
        return false;
      });
    });
  }, [neededKeys, answerKeys, detectedLangs]);

  const detectedClasses = Object.keys(neededKeys);

  const handleUpdateSubject = useCallback(
    (index: number, field: keyof SubjectConfig, value: string | number) => {
      setConfigMap((prev) => {
        const newMap = { ...prev };
        const currentConfig = [...(newMap[configActiveTab] || [])];
        const oldSubject = currentConfig[index];
        const newSubject = { ...oldSubject, [field]: value };
        
        // Handle name change ID update
        if (field === "name") {
          newSubject.id = (value as string)
            .toLowerCase()
            .replace(/\s+/g, "");
        }
        
        // Handle Points Update for Segmented Subjects (Scale proportionally)
        if (field === 'points' && oldSubject.segments && oldSubject.segments.length > 0) {
             const oldTotal = oldSubject.points || 0;
             const newTotal = Number(value);
             
             if (oldTotal > 0 && newTotal > 0) {
                 const multiplier = newTotal / oldTotal;
                 newSubject.segments = oldSubject.segments.map(s => ({
                     ...s,
                     points: Number((s.points * multiplier).toFixed(3))
                 }));
             }
        }
        
        // Prevent length update if segmented (length is derived/fixed by structure)
        if (field === 'length' && oldSubject.segments) {
             // Do nothing or ignore
             return prev; 
        }

        currentConfig[index] = newSubject;
        newMap[configActiveTab] = currentConfig;
        return newMap;
      });
    },
    [configActiveTab]
  );

  const handleSegmentConfigUpdate = useCallback(
    (subjectIndex: number, segmentIndex: number, field: keyof SubjectSegment, value: number) => {
      setConfigMap((prev) => {
        const newMap = { ...prev };
        const currentConfig = [...(newMap[configActiveTab] || [])];
        const oldSubject = currentConfig[subjectIndex];
        const oldLength = oldSubject.length || 0;
        
        const newSegments = [...(oldSubject.segments || [])];

        newSegments[segmentIndex] = {
          ...newSegments[segmentIndex],
          [field]: value,
        };

        const newTotalLength = newSegments.reduce(
          (acc, s) => acc + s.count * s.lengthPerItem,
          0
        );
        const newTotalPoints = newSegments.reduce(
          (acc, s) => acc + s.count * s.points,
          0
        );

        currentConfig[subjectIndex] = {
          ...oldSubject,
          segments: newSegments,
          length: newTotalLength,
          points: Number(newTotalPoints.toFixed(1)),
        };

        newMap[configActiveTab] = currentConfig;
        
        // --- SYNC ANSWER KEYS ---
        // If length changed, we need to adjust the answer keys for this class to prevent alignment issues
        if (newTotalLength !== oldLength) {
             const classKeys = answerKeys[configActiveTab];
             if (classKeys) {
                 const newKeys = { ...classKeys };
                 Object.keys(newKeys).forEach(variant => {
                     let key = newKeys[variant] || "";
                     
                     // 1. Calculate Start Index of this subject
                     let subjectStart = 0;
                     for(let i=0; i<subjectIndex; i++) {
                         subjectStart += (currentConfig[i].length || 0); // Use CURRENT config for previous subjects
                     }
                     
                     // 2. Extract parts
                     const beforeSubject = key.slice(0, subjectStart);
                     const subjectPart = key.slice(subjectStart, subjectStart + oldLength);
                     const afterSubject = key.slice(subjectStart + oldLength);
                     
                     // 3. Resize subject part
                     let newSubjectPart = subjectPart;
                     if (newTotalLength > oldLength) {
                         newSubjectPart = subjectPart.padEnd(newTotalLength, ' ');
                     } else {
                         newSubjectPart = subjectPart.slice(0, newTotalLength);
                     }
                     
                     // 4. Reconstruct
                     newKeys[variant] = beforeSubject + newSubjectPart + afterSubject;
                 });
                 // Update Answer Keys State
                 setAnswerKeys(prevKeys => ({
                     ...prevKeys,
                     [configActiveTab]: newKeys
                 }));
             }
        }

        return newMap;
      });
    },
    [configActiveTab, answerKeys] 
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
      const currentConfig = [...(newMap[configActiveTab] || [])];
      newMap[configActiveTab] = currentConfig.filter((_, i) => i !== index);
      return newMap;
    });
  };

  const handleAddClassConfig = () => {
    const classNum = prompt("Sinif rəqəmini daxil edin (məs: 5):");
    if (!classNum) return;
    const formatted = classNum.padStart(2, "0");
    if (configMap[formatted]) {
      alert("Bu sinif artıq mövcuddur!");
      return;
    }
    setConfigMap((prev) => ({
      ...prev,
      [formatted]: prev["default"].map((s) => ({ ...s })),
    }));
    setConfigActiveTab(formatted);
  };

  const activeConfig = configMap[configActiveTab] || [];
  const activeConfigTotalLength = activeConfig.reduce(
    (acc, curr) => {
        if (curr.segments) {
            return acc + curr.segments.reduce((sAcc, s) => sAcc + s.count, 0);
        }
        return acc + (curr.length || 0);
    },
    0
  );
  const activeConfigTotalScore = activeConfig.reduce(
    (acc, curr) => {
        if (curr.segments) return acc + (curr.points || 0);
        return acc + (curr.length || 0) * (curr.points || 0);
    },
    0
  );

  const allUniqueSubjects = useMemo(() => {
    const allSubjects = new Map<string, SubjectConfig>();
    Object.values(configMap).forEach((configs) => {
      configs.forEach((subj) => {
        if (!allSubjects.has(subj.id)) {
          allSubjects.set(subj.id, subj);
        }
      });
    });
    return Array.from(allSubjects.values());
  }, [configMap]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                OMR Dashboard
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                İmtahan nəticələrinin analizi
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConfigOpen(true)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <Settings className="w-4 h-4" />
                Konfiqurasiya
              </button>

              {/* User avatar + sign out */}
              {session?.user && (
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-8 h-8 rounded-full border-2 border-slate-200 shadow-sm"
                      title={session.user.email || ''}
                    />
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    title="Çıxış et"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıxış
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Configuration Modal */}
        {isConfigOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Konfiqurasiya
                  </h2>
                  <p className="text-sm text-slate-500">
                    Siniflər üzrə fənn və sual saylarını tənzimləyin
                  </p>
                </div>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Class List */}
                <div className="w-64 bg-slate-50/50 border-r border-slate-100 flex flex-col p-4 overflow-y-auto">
                  <div className="space-y-1">
                    <button
                      onClick={() => setConfigActiveTab("default")}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all mb-4",
                        configActiveTab === "default"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200"
                      )}
                    >
                      Standart (Default)
                    </button>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 mt-6">
                      Siniflər
                    </div>
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
                            {Number(activeConfigTotalScore).toFixed(1)}
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
                                handleSegmentConfigUpdate={handleSegmentConfigUpdate}
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

        {/* Parsing Debugger (Buraxilis Only) */}
        {examType === 'buraxilis' && rawText && (
            <ParsingDebugger rawText={rawText} />
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

              {/* Exam Type Selector */}
              <div className="bg-white rounded-xl border border-slate-200 p-1 flex shadow-sm">
                 <button 
                    onClick={() => setExamType('standard')}
                    className={cn("flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all text-center", 
                        examType === 'standard' ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}
                 >
                     Fənn İmtahanı
                 </button>
                 <button 
                    onClick={() => setExamType('buraxilis')}
                    className={cn("flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all text-center", 
                        examType === 'buraxilis' ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}
                 >
                     Buraxılış İmtahanı
                 </button>
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
                          (acc, curr) => acc + (curr.length || 0),
                          0
                        );

                        const isComplete = variants.every(
                          (v) => {
                              const langs = detectedLangs[cls]?.[v] || [];
                              const checkLen = (key: string) => (answerKeys[cls]?.[key] || "").length >= requiredLength && requiredLength > 0;
                              if (langs.length > 0) return langs.every(l => checkLen(`${v}-${l}`));
                              return checkLen(v);
                          }
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
                        {(neededKeys[activeClass] || []).map((variant) => {
                          const langs = detectedLangs[activeClass]?.[variant] || [];
                          const valuesObj: Record<string, string> = {};
                          if (langs.length > 0) {
                              langs.forEach(l => valuesObj[l] = answerKeys[activeClass]?.[`${variant}-${l}`] || "");
                          } else {
                              valuesObj[""] = answerKeys[activeClass]?.[variant] || "";
                          }

                          return (
                          <SubjectKeyInputs
                            key={variant}
                            variant={variant}
                            languages={langs.length > 0 ? langs : [""]}
                            values={valuesObj}
                            config={
                              configMap[activeClass] || configMap["default"]
                            }
                            openWeights={openWeights[activeClass] || {}}
                            onOpenWeightsChange={(subjectId, weights) => {
                                setOpenWeights((prev) => ({
                                    ...prev,
                                    [activeClass]: {
                                        ...(prev[activeClass] || {}),
                                        [subjectId]: weights // Store directly under subjectId
                                    }
                                }));
                            }}
                            onChange={(updates) => {
                              setAnswerKeys((prev) => {
                                const newClassKeys = { ...(prev[activeClass] || {}) };
                                Object.entries(updates).forEach(([lang, val]) => {
                                    const storeKey = lang ? `${variant}-${lang}` : variant;
                                    newClassKeys[storeKey] = val;
                                });
                                return {
                                  ...prev,
                                  [activeClass]: newClassKeys,
                                };
                              });
                            }}
                          />
                        )})}
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
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-400">
                      Total: {validCount} student(s)
                    </div>

                    {/* Save to DB button */}
                    <button
                      onClick={handleSaveToDatabase}
                      disabled={isSavingToDB || validCount === 0 || !examName.trim()}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95",
                        isSavingToDB || validCount === 0 || !examName.trim()
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : saveStatus === 'success'
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
                          : saveStatus === 'error'
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200"
                          : "bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-300"
                      )}
                      title={!examName.trim() ? 'Əvvəlcə imtahan adını daxil edin' : ''}
                    >
                      {isSavingToDB ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Yüklənir...</>
                      ) : saveStatus === 'success' ? (
                        <><CheckCircle2 className="w-4 h-4" /> Saxlanıldı!</>
                      ) : saveStatus === 'error' ? (
                        <><AlertTriangle className="w-4 h-4" /> Xəta!</>
                      ) : (
                        <><Database className="w-4 h-4" /> İmtahanı Yüklə</>
                      )}
                    </button>

                    {/* PDF button */}
                    <button
                      onClick={handleGenerateAllPDFs}
                      disabled={isGeneratingPDFs || validCount === 0}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95",
                        isGeneratingPDFs || validCount === 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                      )}
                    >
                      <Download className="w-4 h-4" />
                      {isGeneratingPDFs ? "Hazırlanır..." : "Ümumi PDF"}
                    </button>
                  </div>
                </div>

                {/* Single scrollable container with two tables sharing the same column widths */}
                {(() => {
                  const fixedCols = [
                    { w: 80 }, { w: 200 }, { w: 150 }, { w: 50 }, { w: 100 },
                  ];
                  const subjCols = allUniqueSubjects.map((s) => ({
                    w: Math.max(100, (s.length || 10) * 15),
                  }));
                  const totalW = fixedCols.reduce((a, c) => a + c.w, 0) +
                    subjCols.reduce((a, c) => a + c.w, 0);
                  const colgroup = (
                    <colgroup>
                      {fixedCols.map((c, i) => <col key={i} style={{ width: c.w }} />)}
                      {subjCols.map((c, i) => <col key={`s${i}`} style={{ width: c.w }} />)}
                    </colgroup>
                  );
                  return (
                    <div
                      ref={scrollRef}
                      className="overflow-auto flex-1 w-full relative bg-white"
                    >
                      {/* Sticky header table */}
                      <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200">
                        <table
                          className="text-left border-collapse table-fixed"
                          style={{ width: totalW, minWidth: "100%" }}
                        >
                          {colgroup}
                          <thead className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                              <th className="px-3 py-3 font-semibold">İş №</th>
                              <th className="px-3 py-3 font-semibold">Ad Soyad</th>
                              <th className="px-2 py-3 font-semibold">Sinif</th>
                              <th className="px-2 py-3 font-semibold text-center">Var</th>
                              <th className="px-3 py-3 font-semibold text-center bg-blue-50/50 text-indigo-600">Yekun</th>
                              {allUniqueSubjects.map((subject) => (
                                <th key={subject.id} className="px-3 py-3 font-semibold text-center whitespace-nowrap">
                                  {subject.name.slice(0, 5).toUpperCase()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        </table>
                      </div>

                      {/* Virtualized body */}
                      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
                        <table
                          className="text-left border-collapse table-fixed"
                          style={{
                            width: totalW,
                            minWidth: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
                          }}
                        >
                          {colgroup}
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
                  );
                })()}

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
