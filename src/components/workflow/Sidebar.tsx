'use client';

import { DragEvent } from 'react';
import { NodeType } from '@/types/workflow';

export default function Sidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4">
      <h2 className="text-sm font-medium text-gray-700 mb-4">要素</h2>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'text')}
        className="
          p-4 border border-black bg-white
          cursor-grab active:cursor-grabbing
          hover:bg-gray-50 transition-colors
          text-center text-sm
        "
      >
        ボックス
      </div>

      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600">
        <p className="font-medium mb-2">操作方法</p>
        <ul className="space-y-1">
          <li>- ドラッグで配置</li>
          <li>- ダブルクリックで追加</li>
          <li>- ノードをダブルクリックで編集</li>
          <li>- Backspaceで削除</li>
        </ul>
      </div>
    </aside>
  );
}
