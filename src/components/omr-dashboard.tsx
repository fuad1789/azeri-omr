'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Upload, Trash2, Download, AlertTriangle, FileText, CheckCircle2, Key, Search, Settings, Plus, X, GripVertical, Copy } from 'lucide-react';
import { parseOMRData, ParsedStudent, SubjectConfig, DEFAULT_SUBJECT_CONFIG } from '@/lib/omr-parser';
import { gradeStudent, GradedStudent, SubjectScore } from '@/lib/grading';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Sortable Item Component
function SortableSubjectItem(props: {
  id: string;
  configActiveTab: string; // needed for passed handlers if any, but logic is mainly inside parent
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
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn("outline-none", isDragging && "z-50")}>
       {/* Use a specific handle logic inside children, but dnd-kit attaches listeners to the nodeRef by default if passed spreading attributes/listeners.
           If we want a drag handle, we should pass listeners ONLY to the handle. 
           Let's update the children to receive the listeners? No, easier to just wrap here or use context?
           Actually, the common pattern is to pass handle props down or attach them to a specific element.
           
           Let's refactor: The child is the row. We want the handle to be the grip icon.
       */}
       <div className={cn("relative", isDragging && "opacity-80 shadow-xl scale-105")}>
         {/* We clone the child to pass the listeners to the specific grip handle if possible, 
             OR we just assume the GripVertical is the handle. 
             But `useSortable` returns `listeners`. We can pass them to the GripVertical.
         */}
         {/* Better approach for this structure: Render the div HERE using props, and pass listeners to Grip. */}
          {React.cloneElement(props.children as React.ReactElement<{ dragListeners?: any }>, { dragListeners: listeners })}
       </div>
    </div>
  );
}

// Internal component for the subject row to cleanly accept drag listeners
const SubjectRow = ({
  subject,
  index,
  handleUpdateSubject,
  handleRemoveSubject,
  dragListeners
}: {
  subject: SubjectConfig;
  index: number;
  handleUpdateSubject: (idx: number, field: keyof SubjectConfig, val: any) => void;
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
        onChange={(e) => handleUpdateSubject(index, 'name', e.target.value)}
        placeholder="Fənn adı"
        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex items-center gap-2">
         <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 font-medium ml-1">Sual</span>
             <input 
                type="number" 
                value={subject.length}
                onChange={(e) => handleUpdateSubject(index, 'length', parseInt(e.target.value) || 0)}
                className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
             />
         </div>
         <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 font-medium ml-1">Bal</span>
             <input 
                type="number" 
                value={subject.points !== undefined ? subject.points : 5}
                onChange={(e) => handleUpdateSubject(index, 'points', parseFloat(e.target.value) || 0)}
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
};


const ColorCodedInput = ({ 
  variant, 
  value, 
  onChange,
  config
}: { 
  variant: string; 
  value: string; 
  onChange: (val: string) => void;
  config: SubjectConfig[];
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mirrorRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (inputRef.current && mirrorRef.current) {
      mirrorRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const totalLength = useMemo(() => config.reduce((acc, s) => acc + s.length, 0), [config]);

  const segments = useMemo(() => {
    const val = value || '';
    let currentIndex = 0;
    
    const mapped = config.map(subject => {
        const segText = val.slice(currentIndex, currentIndex + subject.length);
        currentIndex += subject.length;
        return {
            text: segText,
            color: subject.color
        };
    });

    // Handle overflow if value is longer than config
    if (currentIndex < val.length) {
        mapped.push({
            text: val.slice(currentIndex),
            color: 'bg-red-200 text-red-900 animate-pulse' // Error state for overflow
        });
    }

    return mapped;
  }, [value, config]);

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="w-4 font-bold text-slate-700 text-sm flex-shrink-0">{variant}</span>
      <div className="relative flex-1 h-9 rounded-md overflow-hidden border border-slate-200 bg-white">
        
        {/* Mirror Layer */}
        <div 
          ref={mirrorRef}
          className="absolute inset-0 flex items-center px-3 pointer-events-none whitespace-pre font-mono text-sm tracking-[0.1em] overflow-hidden"
        >
            {segments.map((seg, i) => (
              <span key={i} className={`${seg.color} h-6 flex items-center rounded-sm transition-all duration-200`}>
                {seg.text}
              </span>
            ))}
        </div>
        
        {/* Interaction Layer */}
        <input 
          ref={inputRef}
          type="text" 
          maxLength={totalLength > 0 ? totalLength : 70}
          onScroll={handleScroll}
          placeholder={`${variant} variantı cavabları...`}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="
            relative z-10 w-full h-full 
            bg-transparent 
            font-mono text-sm px-3 
            text-transparent 
            caret-slate-900 
            focus:outline-none 
            tracking-[0.1em] 
            placeholder:text-slate-300
          "
        />
        {/* Count indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                value.length === totalLength ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            )}>
                {value.length}/{totalLength}
            </span>
        </div>
      </div>
    </div>
  );
};

export default function OMRDashboard() {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedStudent[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Dynamic Subject Configuration
  // Map of Class Name -> Config
  const [configMap, setConfigMap] = useState<Record<string, SubjectConfig[]>>({
      'default': DEFAULT_SUBJECT_CONFIG
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configActiveTab, setConfigActiveTab] = useState<string>('default');

  // Detected needed keys from parsed data: Map of Class -> Array of Variants
  const [neededKeys, setNeededKeys] = useState<Record<string, string[]>>({});
  
  // Active class tab (for input view)
  const [activeClass, setActiveClass] = useState<string>('');

  // Removed maxScoreMap, using live config calculation

  // State for answer keys: Map of Class -> Map of Variant -> Key String
  const [answerKeys, setAnswerKeys] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    for (let i = 1; i <= 11; i++) {
        initial[i.toString()] = { 'A': '', 'B': '', 'C': '', 'D': '' };
    }
    return initial;
  });

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(50);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5, // minimum distance before drag starts to prevent accidental clicks
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
            [configActiveTab]: newConfig
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
      // Reset state on new file
      setParsedData(null);
      setNeededKeys({});
      setShowResults(false);
      setVisibleCount(50);
      setActiveClass('');
    };
    reader.readAsText(file);
  };

  const handleParse = () => {
    if (!rawText.trim()) return;
    
    // Parse using the full config map
    const results = parseOMRData(rawText, configMap);
    setParsedData(results);
    setVisibleCount(50);
    
    // Detect needed classes and variants
    const detected: Record<string, Set<string>> = {};
    const detectedClassesSet = new Set<string>();

    results.forEach(student => {
      if (student.isValid) {
        if (!detected[student.sinif]) {
          detected[student.sinif] = new Set();
        }
        detected[student.sinif].add(student.variant);
        detectedClassesSet.add(student.sinif);
      }
    });

    // Automatically create config entries for detected classes if they don't exist
    // defaulting to 'default' config
    const newConfigMap = { ...configMap };
    let configUpdated = false;
    detectedClassesSet.forEach(cls => {
        if (!newConfigMap[cls]) {
            // Deep copy to ensure independence
            newConfigMap[cls] = newConfigMap['default'].map(s => ({ ...s }));
            configUpdated = true;
        }
    });
    if (configUpdated) {
        setConfigMap(newConfigMap);
    }

    // Convert Sets to Arrays and sort
    const finalNeeded: Record<string, string[]> = {};
    Object.keys(detected).sort((a, b) => Number(a) - Number(b)).forEach(cls => {
      finalNeeded[cls] = Array.from(detected[cls]).sort();
    });

    setNeededKeys(finalNeeded);
    
    // Set active class to first detected class if available
    const detectedClasses = Object.keys(finalNeeded);
    if (detectedClasses.length > 0) {
      setActiveClass(detectedClasses[0]);
    }
    
    setShowResults(false);
  };

  const handleClear = () => {
    setRawText('');
    setParsedData(null);
    setFileName(null);
    setNeededKeys({});
    setShowResults(false);
    setVisibleCount(50);
    setActiveClass('');
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    setVisibleCount(50);
  };

  const handleDownloadJSON = () => {
    if (!gradedData) return;
    const validRecords = gradedData.filter(d => d.isValid);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(validRecords, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "omr-results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.remove();
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
        setNeededKeys({});
        setShowResults(false);
        setVisibleCount(50);
        setActiveClass('');
      };
      reader.readAsText(file);
    }
  }, []);

  // Compute graded data on the fly
  const gradedData = useMemo(() => {
    if (!parsedData) return null;
    return parsedData.map(student => {
      if (!student.isValid) return student;
      
      const classKeys = answerKeys[student.sinif];
      const key = classKeys ? classKeys[student.variant] : '';
      
      const config = configMap[student.sinif] || configMap['default'];

      return gradeStudent(student, key || '', config);
    });
  }, [parsedData, answerKeys, configMap]);

  const validCount = gradedData?.filter(d => d.isValid).length ?? 0;
  const invalidCount = gradedData?.filter(d => !d.isValid).length ?? 0;
  
  const allValidData = useMemo(() => gradedData?.filter(d => d.isValid) || [], [gradedData]);
  const visibleData = useMemo(() => allValidData.slice(0, visibleCount), [allValidData, visibleCount]);
  const hasMore = visibleData.length < allValidData.length;

  const allNeededKeysFilled = useMemo(() => {
    if (Object.keys(neededKeys).length === 0) return false;
    
    // Allow checking if AT LEAST ONE key has been entered. 
    // The grading logic is robust enough to handle partial or missing keys (giving 0 scores).
    // This solves the issue where users want to check partially or have non-standard configurations.
    return Object.entries(neededKeys).some(([cls, variants]) => {
      return variants.some(variant => {
         const key = answerKeys[cls]?.[variant] || '';
         return key.length > 0;
      });
    });
  }, [neededKeys, answerKeys]);
  
  const detectedClasses = Object.keys(neededKeys);

  // Configuration Handlers
  const handleUpdateSubject = (index: number, field: keyof SubjectConfig, value: string | number) => {
      const newConfigMap = { ...configMap };
      // Create a shallow copy of the array for the active tab
      const currentConfig = [...(newConfigMap[configActiveTab] || [])];
      
      // Create a shallow copy of the specific item being updated (Immutable update)
      currentConfig[index] = { 
        ...currentConfig[index],
        [field]: value
      };

      // Stable ID logic if needed
      if (field === 'name') {
           currentConfig[index].id = (value as string).toLowerCase().replace(/\s+/g, '');
      }
      
      newConfigMap[configActiveTab] = currentConfig;
      setConfigMap(newConfigMap);
  };

  const handleAddSubject = () => {
      const newConfigMap = { ...configMap };
      const currentConfig = [...(newConfigMap[configActiveTab] || [])];
      
      const newSubject = { 
          id: `subject-${Date.now()}`, // More robust ID for dnd-kit
          name: 'Yeni Fənn', 
          length: 10, 
          points: 5,
          color: 'bg-slate-100 text-slate-900' 
      };
      
      newConfigMap[configActiveTab] = [...currentConfig, newSubject];
      setConfigMap(newConfigMap);
  };

  const handleRemoveSubject = (index: number) => {
      const newConfigMap = { ...configMap };
      const currentConfig = newConfigMap[configActiveTab].filter((_, i) => i !== index);
      newConfigMap[configActiveTab] = currentConfig;
      setConfigMap(newConfigMap);
  };
  
  const handleAddClassConfig = () => {
      // Prompt could be better, for now just adding a placeholder or letting user type
      // Simplified: Just add a "New Class" entry that they can rename? 
      // Actually, cleaner UI: Just a list of tabs.
      // We will rely on detected classes mostly, but let's add a way to manually add a class tab
      const className = prompt("Sinif nömrəsini daxil edin (məsələn: 9):");
      if (className && !configMap[className]) {
          setConfigMap({
              ...configMap,
              // Deep copy to ensure independence
              [className]: DEFAULT_SUBJECT_CONFIG.map(s => ({ ...s }))
          });
          setConfigActiveTab(className);
      }
  };

  // Determine all unique subjects across ALL valid configs to create superset columns
  const allUniqueSubjects = useMemo(() => {
     // We only care about subjects relevant to the currently parsed/displayed data?
     // Or just all configs? Let's do all configs to be safe.
     const subjectsMap = new Map<string, SubjectConfig>();
     
     // Iterate through all configs
     Object.values(configMap).forEach(config => {
         config.forEach(subj => {
             // Use ID as unique key. If same ID but different name, last one wins (acceptable limitation)
             if (!subjectsMap.has(subj.id)) {
                 subjectsMap.set(subj.id, subj);
             }
         });
     });
     
     return Array.from(subjectsMap.values());
  }, [configMap]);


  const activeConfigTotalLength = (configMap[configActiveTab] || []).reduce((acc, curr) => acc + curr.length, 0);
  const activeConfigTotalScore = (configMap[configActiveTab] || []).reduce((acc, curr) => acc + (curr.length * (curr.points || 0)), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">OMR Məlumat Analizi</h1>
            <p className="text-slate-500 mt-1">Optik skanerdən gələn məlumatları JSON və cədvəl halına gətirin.</p>
          </div>
          <div className="flex gap-3">
             {showResults && gradedData && (
              <button 
                onClick={handleDownloadJSON}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                JSON Yüklə
              </button>
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
                             <h2 className="text-xl font-bold text-slate-900">Fənn Konfiqurasiyası</h2>
                             <p className="text-sm text-slate-500">Hər sinif üçün ayrı fənn bölgüsü təyin edin.</p>
                        </div>
                        <button onClick={() => setIsConfigOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar: Class List */}
                        <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 block">Siniflər</label>
                                {Object.keys(configMap).sort().map(cls => (
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
                                        {cls === 'default' ? 'Standart (Default)' : `${cls}-ci Sinif`}
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
                                <div className="flex items-center justify-between mb-2">
                                     <h3 className="font-bold text-slate-800 text-lg">
                                         {configActiveTab === 'default' ? 'Standart' : `${configActiveTab}-ci Sinif`} Tənzimləmələri
                                     </h3>
                                     <div className="text-sm">
                                        <span className="text-slate-500">Cəmi Sual: </span>
                                        <span className={cn(
                                            "font-bold",
                                            activeConfigTotalLength === 70 ? "text-emerald-600" : "text-amber-500"
                                        )}>{activeConfigTotalLength}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                     <span className="text-indigo-800 font-medium">Maksimum Bal (Avtomatik):</span>
                                     <span className="text-2xl font-bold text-indigo-700">{activeConfigTotalScore}</span>
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
                                        items={(configMap[configActiveTab] || []).map(s => s.id)}
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
                <p className="text-sm font-medium text-slate-900">Faylı bura atın</p>
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
                  disabled={!rawText}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-colors shadow-md active:scale-[0.98]"
                >
                  Analiz Et (Parse)
                </button>
              )}

               {parsedData && detectedClasses.length === 0 && (
                 <div className="p-6 bg-orange-50/50 border border-orange-100 text-orange-800 text-center text-sm rounded-2xl flex flex-col items-center gap-2">
                   <AlertTriangle className="w-8 h-8 text-orange-400 opacity-50 mb-1" />
                   <p className="font-semibold">Sinif tapılmadı</p>
                   <p className="text-orange-600/80 text-xs">Faylda heç bir etibarlı sinif və ya variant məlumatı aşkar edilmədi.</p>
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
                      {detectedClasses.map(cls => {
                        // Check if class is complete
                        const variants = neededKeys[cls] || [];
                        const config = configMap[cls] || configMap['default'];
                        const requiredLength = config.reduce((acc, curr) => acc + curr.length, 0);
                        
                        // Show checkmark if key matches configured length (visual cue only)
                        const isComplete = variants.every(v => 
                          (answerKeys[cls]?.[v] || '').length >= requiredLength && requiredLength > 0
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
                  <div className="p-5 flex-1 flex flex-col">
                    {activeClass && neededKeys[activeClass] && (
                      <div className="flex-1" key={activeClass}>
                        <div className="flex flex-col gap-4">
                          {neededKeys[activeClass].map(variant => (
                            <div key={`${activeClass}-${variant}`} className="group relative">
                               <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 ml-1 block tracking-wider">
                                 Variant {variant}
                               </label>
                               <div className="transform transition-transform duration-200 group-focus-within:scale-[1.005]">
                                  <ColorCodedInput
                                    variant={variant}
                                    value={answerKeys[activeClass]?.[variant] || ''}
                                    onChange={(val) => {
                                      setAnswerKeys(prev => ({
                                        ...prev,
                                        [activeClass]: {
                                          ...prev[activeClass],
                                          [variant]: val
                                        }
                                      }));
                                    }}
                                    config={configMap[activeClass] || configMap['default']}
                                  />
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                           Cavabları yoxlamaq üçün variantlardan heç olmasa birini doldurun.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Results Table - Visible ONLY after Check Answers */}
          <div className="w-full">
             {showResults && parsedData ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* ... Table Header ... */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Correct: <span className="font-semibold text-slate-900">{validCount}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          Errors: <span className="font-semibold text-slate-900">{invalidCount}</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Göstərilir: {visibleData.length} / {validCount}
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="px-3 py-3 font-semibold">İş Nömrəsi</th>
                            <th className="px-3 py-3 font-semibold">Ad Soyad</th>
                            <th className="px-2 py-3 font-semibold">Sinif</th>
                            <th className="px-2 py-3 font-semibold text-center">Var</th>
                            <th className="px-3 py-3 font-semibold text-center bg-blue-50/50 text-indigo-600">Yekun</th>
                            {/* Dynamic Subject Headers */}
                            {allUniqueSubjects.map(subject => (
                                <th key={subject.id} className="px-3 py-3 font-semibold text-right whitespace-nowrap">
                                    {subject.name.slice(0, 5).toUpperCase()}
                                </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {visibleData.map((item: any) => {
                             // Calculate Score based on ITEM CLASS CONFIG
                             // We don't need to calculate percentage anymore, just show totalNetScore (max 700)
                             const totalScore = item.scores ? item.scores.totalNetScore : 0;
                             
                             return (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 py-3 font-mono font-medium text-slate-600 text-xs">{item.isNomresi}</td>
                              <td className="px-3 py-3 font-medium text-slate-900 whitespace-nowrap text-xs">
                                {item.ad} {item.soyad}
                              </td>
                              <td className="px-2 py-3 text-slate-500 whitespace-nowrap text-xs">
                                {item.sinif}{item.sinfinAdi} <span className="text-slate-300">/</span> {item.bolme}
                              </td>
                              <td className="px-2 py-3 text-slate-900 font-bold font-mono text-center">
                                {item.variant}
                              </td>
                              <td className="px-3 py-3 font-bold text-center text-indigo-600 bg-blue-50/30">
                                {item.scores ? totalScore.toFixed(0) : '-'}
                                <span className="text-[10px] text-slate-400 block font-normal">
                                    / {(configMap[item.sinif] || configMap['default']).reduce((acc, curr) => acc + (curr.length * (curr.points || 0)), 0)}
                                </span>
                              </td>
                              
                              {/* Dynamic Subject Columns */}
                              {allUniqueSubjects.map((subject) => {
                                  // Access score dynamically
                                  const score = item.scores ? item.scores[subject.id] as SubjectScore : null;
                                  
                                  return (
                                    <td key={subject.id} className="px-3 py-2 text-right border-l border-slate-50">
                                      <div className="flex flex-col items-end">
                                        <span className="font-mono text-sm font-medium text-slate-700">
                                          {score ? score.netScore.toFixed(2) : '-'}
                                        </span>
                                        {score && (
                                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                            <span className="text-green-600 font-medium">{score.correct} D</span>
                                            <span className="mx-1">/</span>
                                            <span className="text-red-500 font-medium">{score.incorrect} S</span>
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                              })}
                            </tr>
                          );
                          })}
                        </tbody>
                      </table>
                    </div>
                </div>
             ) : parsedData ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border border-slate-200 border-dashed rounded-xl bg-slate-50/50 min-h-[400px]">
                    <Search className="w-12 h-12 mb-4 text-slate-300" />
                    <p className="text-lg font-medium text-slate-500">Nəticələr gözlənilir...</p>
                    <p className="text-sm">Zəhmət olmasa soldakı paneldə cavabları daxil edib "Cavabları Yoxla" düyməsini sıxın.</p>
                 </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border border-slate-200 border-dashed rounded-xl bg-slate-50/50 min-h-[400px]">
                    <FileText className="w-12 h-12 mb-4 text-slate-300" />
                    <p className="text-lg font-medium text-slate-500">Məlumat yoxdur</p>
                    <p className="text-sm">Analiz etmək üçün fayl yükləyin və ya mətn daxil edin.</p>
                 </div>
             )}
             
             {/* Load More Button */}
             {showResults && hasMore && (
               <div className="mt-4 flex justify-center">
                 <button 
                  onClick={() => setVisibleCount(prev => prev + 50)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
                 >
                   Daha çox göstər ({allValidData.length - visibleData.length} qalıb)
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
