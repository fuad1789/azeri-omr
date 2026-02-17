import React from 'react';
import { BURAXILIS_LAYOUT, BURAXILIS_LAYOUT_11, getBuraxilisLayout } from '../lib/omr-parser';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ParsingDebugger = ({ rawText }: { rawText: string }) => {
    if (!rawText) return null;
    
    // Split and trim lines using aggressive regex to catch BOM, NBSP, etc.
    const lines = rawText.split('\n').map(l => l.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')).filter(l => l.length > 0);
    if (lines.length === 0) return null;
    
    // Use first valid line for debug
    const firstLine = lines[0];
    const DATA_START = 32; // Sync with parser logic

    // Detect Grade from Header (28-30)
    const grade = firstLine.slice(28, 30).trim();
    const activeLayout = getBuraxilisLayout(grade);

    // ID Section
    // Define Header Layout specifically for Buraxilis (matching omr-parser.ts)
    const headerBlocks = [
        { name: 'Ad', start: 0, end: 10, color: 'bg-slate-100 text-slate-600 border-slate-300' },
        { name: 'Soyad', start: 10, end: 20, color: 'bg-slate-100 text-slate-600 border-slate-300' },
        { name: 'İş №', start: 20, end: 25, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        { name: 'Məktəb', start: 25, end: 28, color: 'bg-slate-100 text-slate-600 border-slate-300' },
        { name: 'Sinif', start: 28, end: 30, color: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' },
        { name: 'Qrup', start: 30, end: 31, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        { name: 'Dil', start: 31, end: 32, color: 'bg-green-50 text-green-700 border-green-200' },
    ].map(b => ({
        ...b,
        content: firstLine.slice(b.start, b.end),
        type: 'Header' as const,
        subject: b.name.toLowerCase()
    }));
    
    // Data Blocks
    let currentIndex = DATA_START;
    const dataBlocks = activeLayout.map((layout, idx) => {
        const len = layout.length || (layout.count! * layout.lengthPerItem!);
        const content = firstLine.slice(currentIndex, currentIndex + len);
        const start = currentIndex;
        const end = currentIndex + len;
        currentIndex += len;
        
        return {
            ...layout,
            content,
            start,
            end,
            name: layout.subject.toUpperCase(), 
            color: layout.subject === 'az' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                   layout.subject === 'math' ? 'bg-red-100 text-red-900 border-red-200' :
                   'bg-orange-100 text-orange-900 border-orange-200'
        };
    });

    const blocks = [...headerBlocks, ...dataBlocks];

    return (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Parsing Debugger 
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Line Length: {firstLine.length} chars
                </span>
            </h3>
            
            <div className="font-mono text-xs overflow-x-auto pb-4">
                {/* Header Indices */}
                <div className="flex mb-1 w-max">
                    {/* Spacer removed for correct alignment */}
                    {firstLine.split('').map((_, i) => (
                        <div key={i} className="w-[12px] border-r border-transparent text-center text-[8px] text-slate-400 rotate-90 origin-bottom transform translate-y-2">
                            {i}
                        </div>
                    ))}
                </div>

                {/* Raw Line Character Boxes */}
                <div className="flex w-max border-b border-t border-slate-100 py-1 ml-[7px]">
                     {firstLine.split('').map((char, i) => (
                        <div key={i} className={cn(
                            "w-[12px] h-[24px] flex items-center justify-center border-r border-slate-50",
                            i < DATA_START ? "bg-slate-50 text-slate-400" : "text-slate-900 font-bold"
                        )}>
                            {char}
                        </div>
                    ))}
                </div>

                {/* Block Visualization */}
                <div className="relative h-[60px] w-max mt-2 ml-[2px]">
                    {/* Header Block Removed - replaced by individual blocks */}

                    {/* All Blocks */}
                    {blocks.map((block, idx) => (
                        <div 
                            key={idx}
                            className={cn("absolute h-8 top-0 border flex flex-col items-center justify-center text-[9px] overflow-hidden whitespace-nowrap px-1", block.color)}
                            style={{ left: `${block.start * 12}px`, width: `${(block.end - block.start) * 12}px` }}
                            title={`${block.name} ${block.type} (${block.start}-${block.end})`}
                        >
                            <span className="font-bold">{block.name}</span>
                            {/* Only show type for data blocks to save space */}
                            {block.type !== 'Header' && <span className="opacity-75">{block.type}</span>}
                        </div>
                    ))}
                </div>
                
                {/* Legend / Details View */}
                <div className="mt-6 flex flex-col gap-2">
                    {blocks.map((block, idx) => (
                         <div key={idx} className="flex items-start gap-3 border p-3 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                             <div className={cn("w-4 h-4 mt-0.5 rounded flex-shrink-0", block.color.split(' ')[0])}></div>
                             
                             <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                 <div className="md:col-span-2 font-bold text-sm text-slate-700">
                                     {block.name}
                                 </div>
                                 <div className="md:col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 text-center">
                                     {block.type}
                                 </div>
                                 <div className="md:col-span-2 font-mono text-xs text-slate-400 text-center">
                                     {block.start} - {block.end}
                                 </div>
                                 <div className="md:col-span-6 font-mono text-sm text-slate-900 bg-white px-3 py-1.5 rounded border border-slate-200 break-all shadow-sm">
                                     {block.content}
                                 </div>
                             </div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
