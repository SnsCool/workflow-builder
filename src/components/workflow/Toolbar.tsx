'use client';

import { useRef } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';

export default function Toolbar() {
  const { workflowName, setWorkflowName, clearWorkflow, saveWorkflow, loadWorkflow } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const json = saveWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      loadWorkflow(json);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (window.confirm('ワークフローをクリアしますか？')) {
      clearWorkflow();
    }
  };

  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-medium text-gray-800">Workflow Builder</h1>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:border-black"
          placeholder="ワークフロー名"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm border border-black bg-white hover:bg-gray-100 text-black transition-colors"
        >
          保存
        </button>

        <button
          onClick={handleLoad}
          className="px-3 py-1 text-sm border border-gray-400 bg-white hover:bg-gray-100 text-gray-700 transition-colors"
        >
          読込
        </button>

        <button
          onClick={handleClear}
          className="px-3 py-1 text-sm border border-gray-400 bg-white hover:bg-gray-100 text-gray-700 transition-colors"
        >
          クリア
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </header>
  );
}
