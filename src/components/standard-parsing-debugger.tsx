import React from 'react';
import { HeaderField, SubjectConfig } from '../lib/omr-parser';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const StandardParsingDebugger = ({ 
    rawLine, 
    headerConfig, 
    subjectConfigs, 
    classNameTitle 
}: { 
    rawLine: string; 
    headerConfig: HeaderField[]; 
    subjectConfigs: SubjectConfig[]; 
    classNameTitle: string;
}) => {
    if (!rawLine) return null;
    
    // Header Blocks
    let currentIdx = 0;
    const headerBlocks = headerConfig.map(field => {
        const start = currentIdx;
        const end = currentIdx + field.length;
        currentIdx += field.length;
        return {
            name: field.name,
            start,
            end,
            content: rawLine.slice(start, end) || "",
            type: 'Header' as const,
            subject: field.id,
            color: 'bg-slate-100 text-slate-600 border-slate-300'
        };
    });
    
    // Data Blocks
    const dataBlocks: any[] = [];
    const colors = ['bg-blue-100 text-blue-900 border-blue-200', 'bg-red-100 text-red-900 border-red-200', 'bg-orange-100 text-orange-900 border-orange-200', 'bg-emerald-100 text-emerald-900 border-emerald-200', 'bg-purple-100 text-purple-900 border-purple-200'];
    
    subjectConfigs.forEach((subject, sIdx) => {
        if (subject.segments) {
            subject.segments.forEach((seg, i) => {
                const len = seg.count * seg.lengthPerItem;
                const start = currentIdx;
                const end = currentIdx + len;
                dataBlocks.push({
                    name: `${subject.name} (${seg.type})`,
                    start,
                    end,
                    content: rawLine.slice(start, end) || "",
                    type: seg.type,
                    subject: subject.id,
                    color: colors[sIdx % colors.length]
                });
                currentIdx += len;
            });
        } else {
            const len = subject.length || 0;
            const start = currentIdx;
            const end = currentIdx + len;
            dataBlocks.push({
                name: subject.name,
                start,
                end,
                content: rawLine.slice(start, end) || "",
                type: 'closed',
                subject: subject.id,
                color: colors[sIdx % colors.length]
            });
            currentIdx += len;
        }
    });

    const blocks = [...headerBlocks, ...dataBlocks];

    return (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-[1600px] mx-auto w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Parsing Debugger ({classNameTitle} Sinif)
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Line Length: {rawLine.length} simvol
                </span>
            </h3>
            
            <div className="font-mono text-xs overflow-x-auto pb-4">
                {/* Header Indices */}
                <div className="flex mb-1 w-max">
                    {/* Spacer removed for correct alignment */}
                    {rawLine.split('').map((_, i) => (
                        <div key={i} className="w-[12px] border-r border-transparent text-center text-[8px] text-slate-400 rotate-90 origin-bottom transform translate-y-2">
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Raw Line Character Boxes */}
                <div className="flex w-max border-b border-t border-slate-100 py-1 ml-[2px]">
                     {rawLine.split('').map((char, i) => (
                        <div key={i} className={cn(
                            "w-[12px] h-[24px] flex items-center justify-center border-r border-slate-50",
                            i < headerConfig.reduce((acc, c) => acc + c.length, 0) ? "bg-slate-50 text-slate-400" : "text-slate-900 font-bold"
                        )}>
                            {char}
                        </div>
                    ))}
                </div>

                {/* Block Visualization */}
                <div className="relative h-[60px] w-max mt-2 ml-[2px]">
                    {/* All Blocks */}
                    {blocks.map((block, idx) => (
                        <div 
                            key={idx}
                            className={cn("absolute h-8 top-0 border flex flex-col items-center justify-center text-[9px] overflow-hidden whitespace-nowrap px-1", block.color)}
                            style={{ left: `${block.start * 12}px`, width: `${(block.end - block.start) * 12}px` }}
                            title={`${block.name} ${block.type} (${block.start + 1}-${block.end})`}
                        >
                            <span className="font-bold truncate w-full flex-1">{block.name}</span>
                        </div>
                    ))}
                </div>
                
                {/* Legend / Details View */}
                <div className="mt-6 flex flex-col gap-2">
                    {blocks.map((block, idx) => (
                         <div key={idx} className="flex items-start gap-3 border p-3 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                             <div className={cn("w-4 h-4 mt-0.5 rounded flex-shrink-0", block.color.split(' ')[0])}></div>
                             
                             <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                 <div className="md:col-span-3 font-bold text-sm text-slate-700">
                                     {block.name}
                                 </div>
                                 <div className="md:col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 text-center">
                                     {block.type}
                                 </div>
                                 <div className="md:col-span-2 font-mono text-xs text-slate-400 text-center">
                                     {block.start + 1} - {block.end}
                                 </div>
                                 <div className="md:col-span-5 font-mono text-sm text-slate-900 bg-white px-3 py-1.5 rounded border border-slate-200 break-all shadow-sm">
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
