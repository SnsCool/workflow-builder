'use client';

import { DragEvent } from 'react';
import { NodeType } from '@/types/workflow';

interface NodeItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const nodeItems: NodeItem[] = [
  {
    type: 'start',
    label: '開始',
    description: 'ワークフローの開始点',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-400 to-green-500',
  },
  {
    type: 'end',
    label: '終了',
    description: 'ワークフローの終了点',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    color: 'from-red-400 to-red-500',
  },
  {
    type: 'task',
    label: 'タスク',
    description: '実行する作業',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: 'from-blue-400 to-blue-500',
  },
  {
    type: 'condition',
    label: '条件分岐',
    description: '条件による分岐',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-amber-400 to-amber-500',
  },
];

export default function Sidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">ノードパレット</h2>
      <p className="text-sm text-gray-500 mb-4">
        ドラッグしてキャンバスに配置
      </p>

      <div className="space-y-3">
        {nodeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className={`
              p-3 rounded-lg cursor-grab active:cursor-grabbing
              bg-gradient-to-r ${item.color}
              text-white shadow-md
              hover:shadow-lg transition-all duration-200
              hover:scale-105
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-xs text-white/80">{item.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">ヒント</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>- ノードをドラッグして配置</li>
          <li>- ハンドルを接続してエッジを作成</li>
          <li>- Backspaceで選択を削除</li>
          <li>- マウスホイールでズーム</li>
        </ul>
      </div>
    </aside>
  );
}
