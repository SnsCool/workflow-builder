'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { EndNodeData } from '@/types/workflow';

type EndNodeType = Node<EndNodeData, 'end'>;

function EndNode({ data, selected }: NodeProps<EndNodeType>) {
  return (
    <div
      className={`
        px-6 py-3 rounded-full
        bg-gradient-to-r from-red-400 to-red-500
        text-white font-semibold shadow-lg
        border-2 transition-all duration-200
        ${selected ? 'border-red-700 ring-2 ring-red-300' : 'border-red-600'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-red-700 !w-3 !h-3 !border-2 !border-white"
      />
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
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
        <span>{data.label}</span>
      </div>
    </div>
  );
}

export default memo(EndNode);
