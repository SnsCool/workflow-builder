'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { ConditionNodeData } from '@/types/workflow';

type ConditionNodeType = Node<ConditionNodeData, 'condition'>;

function ConditionNode({ data, selected }: NodeProps<ConditionNodeType>) {
  return (
    <div
      className={`
        relative w-[160px] h-[100px]
        transition-all duration-200
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
      />

      {/* ダイヤモンド形状 */}
      <div
        className={`
          absolute inset-0 transform rotate-45
          bg-gradient-to-br from-amber-400 to-amber-500
          rounded-lg shadow-lg border-2
          ${selected ? 'border-amber-700 ring-2 ring-amber-200' : 'border-amber-600'}
        `}
        style={{
          width: '70%',
          height: '70%',
          left: '15%',
          top: '15%',
        }}
      />

      {/* コンテンツ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="flex items-center gap-1 text-white font-semibold">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{data.label}</span>
        </div>
        {data.condition && (
          <p className="text-xs text-white/80 mt-1 max-w-[100px] text-center truncate">
            {data.condition}
          </p>
        )}
      </div>

      {/* Yes出力 */}
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
      />

      {/* No出力 */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="!bg-red-500 !w-3 !h-3 !border-2 !border-white"
      />

      {/* ラベル */}
      <span className="absolute right-[-25px] top-1/2 -translate-y-1/2 text-xs font-medium text-green-600">
        Yes
      </span>
      <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-xs font-medium text-red-600">
        No
      </span>
    </div>
  );
}

export default memo(ConditionNode);
