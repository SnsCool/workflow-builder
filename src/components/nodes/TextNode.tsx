'use client';

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { TextNodeData } from '@/types/workflow';

type TextNodeType = Node<TextNodeData, 'text'>;

function TextNode({ id, data, selected }: NodeProps<TextNodeType>) {
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
    // Shift+Enterで改行、Enterのみで確定（なし、複数行対応のためEnterはそのまま）
  }, [data.label]);

  return (
    <>
      <NodeResizer
        color="#000000"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        lineStyle={{ borderWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2 }}
      />

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-black !w-2 !h-2 !border-0 !rounded-none"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-black !w-2 !h-2 !border-0 !rounded-none"
      />

      <div
        onDoubleClick={handleDoubleClick}
        className={`
          w-full h-full min-w-[100px] min-h-[50px]
          bg-white border border-black
          flex items-center justify-center
          cursor-grab active:cursor-grabbing
          font-sans text-sm
          ${selected ? 'border-2' : 'border'}
        `}
        style={{
          padding: '8px',
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
        className="!bg-black !w-2 !h-2 !border-0 !rounded-none"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-black !w-2 !h-2 !border-0 !rounded-none"
      />
    </>
  );
}

export default memo(TextNode);
