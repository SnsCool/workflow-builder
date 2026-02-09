'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { TaskNodeData } from '@/types/workflow';

type TaskNodeType = Node<TaskNodeData, 'task'>;

function TaskNode({ data, selected }: NodeProps<TaskNodeType>) {
  const statusColors = {
    pending: 'bg-gray-100',
    in_progress: 'bg-yellow-100',
    completed: 'bg-green-100',
  };

  const statusLabels = {
    pending: '未着手',
    in_progress: '進行中',
    completed: '完了',
  };

  return (
    <div
      className={`
        min-w-[180px] rounded-lg shadow-lg
        bg-white border-2 transition-all duration-200
        ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />

      {/* ヘッダー */}
      <div className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-t-md">
        <div className="flex items-center gap-2 text-white font-semibold">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span>{data.label}</span>
        </div>
      </div>

      {/* ボディ */}
      <div className="px-4 py-3 space-y-2">
        {data.description && (
          <p className="text-sm text-gray-600">{data.description}</p>
        )}
        {data.assignee && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{data.assignee}</span>
          </div>
        )}
        {data.status && (
          <span
            className={`
              inline-block px-2 py-1 text-xs rounded-full
              ${statusColors[data.status]} text-gray-700
            `}
          >
            {statusLabels[data.status]}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(TaskNode);
