import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { X, Play, Code2, ChevronDown } from 'lucide-react';

const CodeEditor = ({ question, onSubmit, onClose }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript', default: '// Write your code here\n\n' },
    { value: 'python', label: 'Python', default: '# Write your code here\n\n' },
    { value: 'java', label: 'Java', default: '// Write your code here\n\n' },
    { value: 'cpp', label: 'C++', default: '// Write your code here\n\n' },
    { value: 'csharp', label: 'C#', default: '// Write your code here\n\n' },
  ];

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const langData = languages.find((l) => l.value === newLang);
    setCode(langData?.default || '');
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }
    onSubmit(code, language);
  };

  const handleRun = () => {
    // Simple mock execution for demo
    setOutput('Code execution simulated. In production, this would run on a secure backend.');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Coding Challenge</h3>
              <p className="text-sm text-gray-400">Write your solution below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Problem Statement */}
          <div className="w-2/5 border-r border-gray-700 overflow-y-auto bg-gray-800/30">
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Problem Statement
                </h4>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300 leading-relaxed">{question}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-white font-semibold mb-2">Instructions</h5>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Write clean, well-commented code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Consider edge cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Optimize for time and space complexity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Explain your approach as you code</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-white font-semibold mb-2">Tips</h5>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">
                      Take your time to understand the problem. It's okay to ask clarifying
                      questions. The AI interviewer is evaluating your problem-solving approach,
                      not just the final solution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* Editor Header */}
            <div className="px-6 py-3 border-b border-gray-700 flex items-center justify-between bg-gray-800/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  onClick={handleRun}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
                >
                  <Play className="w-4 h-4" />
                  <span className="font-semibold">Run Code</span>
                </button>
              </div>
              <div className="text-gray-400 text-sm">
                Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+Enter</kbd> to
                run
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>

            {/* Output Panel */}
            {output && (
              <div className="border-t border-gray-700 bg-gray-800/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white font-semibold text-sm">Output</span>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;