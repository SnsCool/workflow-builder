'use client';

import { useWorkflowStore } from '@/stores/workflowStore';
import { ToolType } from '@/types/workflow';

interface ToolButtonProps {
  tool: ToolType;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  isActive: boolean;
  onClick: () => void;
}

function ToolButton({ tool, icon, label, shortcut, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 flex items-center justify-center
        border transition-colors relative group
        ${isActive
          ? 'bg-gray-900 border-gray-900 text-white'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
        }
      `}
      title={`${label} (${shortcut})`}
    >
      {icon}
      <span className="
        absolute left-12 bg-gray-900 text-white text-xs px-2 py-1
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none whitespace-nowrap z-50
      ">
        {label} <span className="text-gray-400">{shortcut}</span>
      </span>
    </button>
  );
}

// シンプルなSVGアイコン
const SelectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 2L3 14L7 10L10 14L12 13L9 9L13 8L3 2Z" />
  </svg>
);

const TextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="12" height="12" rx="0" />
    <text x="8" y="11" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none">T</text>
  </svg>
);

const RectangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="10" rx="0" />
  </svg>
);

const EllipseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="8" cy="8" rx="6" ry="5" />
  </svg>
);

const ConnectionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 13L13 3" />
    <path d="M10 3L13 3L13 6" />
  </svg>
);

export default function VerticalToolbar() {
  const { currentTool, setCurrentTool } = useWorkflowStore();

  const tools: { tool: ToolType; icon: React.ReactNode; label: string; shortcut: string }[] = [
    { tool: 'select', icon: <SelectIcon />, label: '選択', shortcut: 'V' },
    { tool: 'text', icon: <TextIcon />, label: 'テキスト', shortcut: 'T' },
    { tool: 'rectangle', icon: <RectangleIcon />, label: '矩形', shortcut: 'R' },
    { tool: 'ellipse', icon: <EllipseIcon />, label: '楕円', shortcut: 'O' },
    { tool: 'connection', icon: <ConnectionIcon />, label: '接続線', shortcut: 'L' },
  ];

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1 bg-white border border-gray-200 p-1 shadow-sm">
      {tools.map(({ tool, icon, label, shortcut }) => (
        <ToolButton
          key={tool}
          tool={tool}
          icon={icon}
          label={label}
          shortcut={shortcut}
          isActive={currentTool === tool}
          onClick={() => setCurrentTool(tool)}
        />
      ))}
    </div>
  );
}
