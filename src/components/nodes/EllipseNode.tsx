'use client';

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { EllipseNodeData } from '@/types/workflow';

type EllipseNodeType = Node<EllipseNodeData, 'ellipse'>;

function EllipseNode({ id, data, selected }: NodeProps<EllipseNodeType>) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(data.label || '');
  }, [data.label]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (data.onTextChange) {
      data.onTextChange(id, text);
    }
  }, [id, text, data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(data.label || '');
    }
  }, [data.label]);

  return (
    <>
      <NodeResizer
        color="#999999"
        isVisible={selected}
        minWidth={80}
        minHeight={60}
        lineStyle={{ borderWidth: 1, borderColor: '#999' }}
        handleStyle={{ width: 6, height: 6, borderRadius: 0, backgroundColor: '#fff', border: '1px solid #999' }}
      />

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !w-3 !h-3 !border !border-gray-300 !rounded-none hover:!bg-gray-200"
        style={{ top: '-6px' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !w-3 !h-3 !border !border-gray-300 !rounded-none hover:!bg-gray-200"
        style={{ left: '-6px' }}
      />

      <div
        onDoubleClick={handleDoubleClick}
        className="w-full h-full min-w-[100px] min-h-[60px] bg-white flex items-center justify-center cursor-grab active:cursor-grabbing font-sans text-sm"
        style={{
          padding: '12px',
          border: '1px solid #333',
          borderRadius: '50%',
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="
              w-full h-full resize-none
              bg-transparent border-none outline-none
              text-center font-sans text-sm
            "
            style={{
              minHeight: '100%',
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center whitespace-pre-wrap text-center overflow-hidden">
            {text || 'ダブルクリックで編集'}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !w-3 !h-3 !border !border-gray-300 !rounded-none hover:!bg-gray-200"
        style={{ bottom: '-6px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !w-3 !h-3 !border !border-gray-300 !rounded-none hover:!bg-gray-200"
        style={{ right: '-6px' }}
      />
    </>
  );
}

export default memo(EllipseNode);
