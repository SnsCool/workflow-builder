'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { StartNodeData } from '@/types/workflow';

type StartNodeType = Node<StartNodeData, 'start'>;

function StartNode({ data, selected }: NodeProps<StartNodeType>) {
  return (
    <div
      className={`
        px-6 py-3 rounded-full
        bg-gradient-to-r from-green-400 to-green-500
        text-white font-semibold shadow-lg
        border-2 transition-all duration-200
        ${selected ? 'border-green-700 ring-2 ring-green-300' : 'border-green-600'}
      `}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-700 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(StartNode);
