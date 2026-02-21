'use client'

import React from 'react'
import Card from '@/components/ui/Card'
import { CheckCircle, XCircle, Circle } from 'lucide-react'

interface TestResult {
  studentInfo: {
    ad: string
    soyad: string
    isNomresi: string
    mekteb: string
    sinif: string
    qrup: string
    variant: string
    bal: string
  }
  examTitle: string
  closedTests: Array<{ th: string; icon: string; span: string }>
  openTests: string[]
  writingScores: string[]
  summaryTable: Array<Record<string, string>>
  rawHtml: string
}

interface TestResultDisplayProps {
  result: TestResult
  onClose?: () => void
}

export default function TestResultDisplay({ result, onClose }: TestResultDisplayProps) {
  const { studentInfo, examTitle, closedTests, openTests, writingScores, summaryTable } = result

  // Group closed tests by subject (every 3 rows)
  const groupedClosedTests: Array<Array<{ th: string; icon: string; span: string }>> = []
  for (let i = 0; i < closedTests.length; i += 3) {
    groupedClosedTests.push(closedTests.slice(i, i + 3))
  }

  // Group open tests (every 3 rows)
  const groupedOpenTests: string[][] = []
  for (let i = 0; i < openTests.length; i += 3) {
    groupedOpenTests.push(openTests.slice(i, i + 3))
  }

  // Group writing scores (every 3 rows)
  const groupedWritingScores: string[][] = []
  for (let i = 0; i < writingScores.length; i += 3) {
    groupedWritingScores.push(writingScores.slice(i, i + 3))
  }

  const getIcon = (iconClass: string) => {
    if (iconClass.includes('fa-check')) {
      return <CheckCircle className="text-green-600" size={16} />
    } else if (iconClass.includes('fa-dot-circle')) {
      return <Circle className="text-blue-600" size={16} />
    } else if (iconClass.includes('fa-commenting')) {
      return <span className="text-gray-600">💬</span>
    }
    return null
  }

  const renderAnswerString = (str: string) => {
    return str.split('').map((char, idx) => {
      let bgColor = 'bg-gray-100'
      if (char === '+') bgColor = 'bg-green-200'
      else if (char === '-') bgColor = 'bg-red-200'
      
      return (
        <span
          key={idx}
          className={`inline-block w-6 h-6 text-center text-xs font-mono ${bgColor} border border-gray-300 mr-0.5`}
        >
          {char}
        </span>
      )
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-red to-red-600 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">İmtahan nəticə vərəqi</h1>
            <p className="text-lg opacity-90">{examTitle}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <XCircle size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Student Info */}
        <Card className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ad</p>
              <p className="text-lg font-bold text-gray-900">{studentInfo.ad}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Soyad</p>
              <p className="text-lg font-bold text-gray-900">{studentInfo.soyad}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">İş nömrəsi</p>
              <p className="text-lg font-bold text-gray-900">{studentInfo.isNomresi}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Sinif</p>
              <p className="text-lg font-bold text-gray-900">{studentInfo.sinif}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Qrup</p>
              <p className="text-lg font-bold text-gray-900">{studentInfo.qrup}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Variant</p>
              <p className="text-lg font-bold text-gray-900">{studentInfo.variant}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Ümumi Bal</p>
              <p className="text-3xl font-bold text-brand-red">{studentInfo.bal}</p>
            </div>
          </div>
        </Card>

        {/* Test Results */}
        <div className="grid lg:grid-cols-12 gap-6 mb-6">
          {/* Closed Type Tests */}
          <div className="lg:col-span-6">
            <div className="bg-gray-800 text-white text-center py-3 rounded-t-lg">
              <h3 className="text-lg font-bold">Qapalı tipli testlər</h3>
            </div>
            <Card className="rounded-t-none border-t-0">
              <div className="divide-y divide-gray-200">
                {groupedClosedTests.map((group, groupIdx) => (
                  <div key={groupIdx} className="p-4">
                    {group.map((test, idx) => (
                      <div key={idx} className="mb-2">
                        {test.th && (
                          <div className="font-bold text-gray-900 mb-1">{test.th}</div>
                        )}
                        <div className="flex items-start gap-2">
                          {getIcon(test.icon)}
                          <div className="flex-1 font-mono text-sm">
                            {renderAnswerString(test.span)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Open Type Tests and Writing Scores */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {/* Open Type Tests */}
            <div>
              <div className="bg-gray-800 text-white text-center py-3 rounded-t-lg">
                <h3 className="text-sm font-bold">Açıq tipli testlər</h3>
              </div>
              <Card className="rounded-t-none border-t-0">
                <div className="divide-y divide-gray-200">
                  {groupedOpenTests.map((group, groupIdx) => (
                    <div key={groupIdx} className="p-3">
                      {group.map((test, idx) => (
                        <div key={idx} className="mb-1 text-xs font-mono break-all">
                          {renderAnswerString(test)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Writing Scores */}
            <div>
              <div className="bg-gray-800 text-white text-center py-3 rounded-t-lg">
                <h3 className="text-sm font-bold">Yazı işi balları</h3>
              </div>
              <Card className="rounded-t-none border-t-0">
                <div className="divide-y divide-gray-200">
                  {groupedWritingScores.map((group, groupIdx) => (
                    <div key={groupIdx} className="p-3">
                      {group.map((score, idx) => (
                        <div key={idx} className="mb-1 text-center">
                          <span className="inline-block bg-yellow-100 border-2 border-yellow-400 px-4 py-2 rounded font-bold text-gray-900">
                            {score}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        {summaryTable.length > 0 && (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(summaryTable[0] || {}).map((key, idx) => (
                    <th key={idx} className="px-4 py-3 text-left font-bold text-gray-900 border border-gray-300">
                      {summaryTable[0][key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryTable.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`px-4 py-3 border border-gray-300 ${
                          cellIdx === 0 ? 'font-semibold text-gray-900' : 'text-center'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">Əlaqə məlumatları</p>
          <p>Tel: (018) 656 50 42 | Mob: (055) 444-06-62</p>
          <p>WhatsApp / Email: info@azeri.edu.az</p>
        </div>
      </div>
    </div>
  )
}
