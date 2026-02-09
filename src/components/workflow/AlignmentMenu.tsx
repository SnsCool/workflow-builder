'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { AlignmentType } from '@/types/workflow';

interface MenuPosition {
  x: number;
  y: number;
}

// アイコンコンポーネント
const AlignLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="2" y1="2" x2="2" y2="12" />
    <rect x="4" y="3" width="8" height="3" />
    <rect x="4" y="8" width="5" height="3" />
  </svg>
);

const AlignCenterHIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="7" y1="2" x2="7" y2="12" />
    <rect x="2" y="3" width="10" height="3" />
    <rect x="4" y="8" width="6" height="3" />
  </svg>
);

const AlignRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="12" y1="2" x2="12" y2="12" />
    <rect x="2" y="3" width="8" height="3" />
    <rect x="5" y="8" width="5" height="3" />
  </svg>
);

const AlignTopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="2" y1="2" x2="12" y2="2" />
    <rect x="3" y="4" width="3" height="8" />
    <rect x="8" y="4" width="3" height="5" />
  </svg>
);

const AlignCenterVIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="2" y1="7" x2="12" y2="7" />
    <rect x="3" y="2" width="3" height="10" />
    <rect x="8" y="4" width="3" height="6" />
  </svg>
);

const AlignBottomIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="2" y1="12" x2="12" y2="12" />
    <rect x="3" y="2" width="3" height="8" />
    <rect x="8" y="5" width="3" height="5" />
  </svg>
);

export default function AlignmentMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const { selectedNodes, alignNodes } = useWorkflowStore();

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      // 選択されたノードが2つ以上ある場合のみメニューを表示
      if (selectedNodes.length >= 2) {
        const target = event.target as HTMLElement;
        if (target.closest('.react-flow__node')) {
          event.preventDefault();
          setPosition({ x: event.clientX, y: event.clientY });
          setIsOpen(true);
        }
      }
    },
    [selectedNodes]
  );

  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [handleContextMenu, handleClick]);

  const handleAlign = (alignment: AlignmentType) => {
    alignNodes(alignment);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const menuItems: { alignment: AlignmentType; icon: React.ReactNode; label: string }[] = [
    { alignment: 'left', icon: <AlignLeftIcon />, label: '左揃え' },
    { alignment: 'center', icon: <AlignCenterHIcon />, label: '水平中央揃え' },
    { alignment: 'right', icon: <AlignRightIcon />, label: '右揃え' },
    { alignment: 'top', icon: <AlignTopIcon />, label: '上揃え' },
    { alignment: 'middle', icon: <AlignCenterVIcon />, label: '垂直中央揃え' },
    { alignment: 'bottom', icon: <AlignBottomIcon />, label: '下揃え' },
  ];

  return (
    <div
      className="fixed z-50 bg-white border border-gray-300 shadow-lg py-1 min-w-[160px]"
      style={{ left: position.x, top: position.y }}
    >
      <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-200">
        整列
      </div>
      {menuItems.map(({ alignment, icon, label }) => (
        <button
          key={alignment}
          onClick={() => handleAlign(alignment)}
          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
