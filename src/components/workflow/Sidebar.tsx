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

      <div className="space-y-2">
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
          矩形
        </div>

        <div
          draggable
          onDragStart={(e) => onDragStart(e, 'ellipse')}
          className="
            p-4 border border-black bg-white
            cursor-grab active:cursor-grabbing
            hover:bg-gray-50 transition-colors
            text-center text-sm
          "
          style={{ borderRadius: '50%' }}
        >
          楕円
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600">
        <p className="font-medium mb-2">ショートカット</p>
        <ul className="space-y-1">
          <li><span className="font-mono bg-gray-200 px-1">V</span> 選択モード</li>
          <li><span className="font-mono bg-gray-200 px-1">T</span> テキスト追加</li>
          <li><span className="font-mono bg-gray-200 px-1">R</span> 矩形追加</li>
          <li><span className="font-mono bg-gray-200 px-1">O</span> 楕円追加</li>
          <li><span className="font-mono bg-gray-200 px-1">L</span> 接続線モード</li>
          <li><span className="font-mono bg-gray-200 px-1">Del</span> 削除</li>
          <li><span className="font-mono bg-gray-200 px-1">Ctrl+C</span> コピー</li>
          <li><span className="font-mono bg-gray-200 px-1">Ctrl+V</span> 貼付け</li>
          <li><span className="font-mono bg-gray-200 px-1">Ctrl+D</span> 複製</li>
          <li><span className="font-mono bg-gray-200 px-1">Ctrl+Z</span> 元に戻す</li>
          <li><span className="font-mono bg-gray-200 px-1">Ctrl+Shift+Z</span> やり直す</li>
          <li><span className="font-mono bg-gray-200 px-1">Esc</span> 選択解除</li>
        </ul>
        <p className="font-medium mt-3 mb-2">操作方法</p>
        <ul className="space-y-1">
          <li>- ドラッグで配置</li>
          <li>- ダブルクリックで追加</li>
          <li>- ノードをダブルクリックで編集</li>
          <li>- 右クリックで整列メニュー</li>
        </ul>
      </div>
    </aside>
  );
}
