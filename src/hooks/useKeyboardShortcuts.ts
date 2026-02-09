'use client';

import { useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '@/stores/workflowStore';

export function useKeyboardShortcuts() {
  const { screenToFlowPosition, getViewport } = useReactFlow();
  const {
    currentTool,
    setCurrentTool,
    addNodeAtPosition,
    deleteSelectedNodes,
    copySelectedNodes,
    pasteNodes,
    duplicateSelectedNodes,
    undo,
    redo,
    clearSelection,
    selectedNodes,
  } = useWorkflowStore();

  const getCanvasCenter = useCallback(() => {
    const viewport = getViewport();
    // ビューポートの中央を取得
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    return screenToFlowPosition({ x: centerX, y: centerY });
  }, [screenToFlowPosition, getViewport]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合はスキップ
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // ショートカットキーの処理
      switch (event.key.toLowerCase()) {
        // ツール選択
        case 'v':
          if (!isCtrlOrCmd) {
            event.preventDefault();
            setCurrentTool('select');
          }
          break;

        case 't':
          if (!isCtrlOrCmd) {
            event.preventDefault();
            setCurrentTool('text');
            // テキストボックスを追加
            const posT = getCanvasCenter();
            addNodeAtPosition(posT, 'text');
            setCurrentTool('select');
          }
          break;

        case 'r':
          if (!isCtrlOrCmd) {
            event.preventDefault();
            setCurrentTool('rectangle');
            // 矩形を追加（textノードを使用）
            const posR = getCanvasCenter();
            addNodeAtPosition(posR, 'text');
            setCurrentTool('select');
          }
          break;

        case 'o':
          if (!isCtrlOrCmd) {
            event.preventDefault();
            setCurrentTool('ellipse');
            // 楕円を追加
            const posO = getCanvasCenter();
            addNodeAtPosition(posO, 'ellipse');
            setCurrentTool('select');
          }
          break;

        case 'l':
          if (!isCtrlOrCmd) {
            event.preventDefault();
            setCurrentTool('connection');
          }
          break;

        // 削除
        case 'delete':
        case 'backspace':
          if (!isCtrlOrCmd && selectedNodes.length > 0) {
            event.preventDefault();
            deleteSelectedNodes();
          }
          break;

        // コピー
        case 'c':
          if (isCtrlOrCmd && !event.shiftKey) {
            event.preventDefault();
            copySelectedNodes();
          }
          break;

        // 貼り付け
        case 'v':
          if (isCtrlOrCmd) {
            event.preventDefault();
            pasteNodes();
          }
          break;

        // 元に戻す
        case 'z':
          if (isCtrlOrCmd && !event.shiftKey) {
            event.preventDefault();
            undo();
          }
          // やり直す (Ctrl+Shift+Z / Cmd+Shift+Z)
          if (isCtrlOrCmd && event.shiftKey) {
            event.preventDefault();
            redo();
          }
          break;

        // 複製
        case 'd':
          if (isCtrlOrCmd) {
            event.preventDefault();
            duplicateSelectedNodes();
          }
          break;

        // 選択解除
        case 'escape':
          event.preventDefault();
          clearSelection();
          setCurrentTool('select');
          break;
      }
    },
    [
      currentTool,
      setCurrentTool,
      addNodeAtPosition,
      deleteSelectedNodes,
      copySelectedNodes,
      pasteNodes,
      duplicateSelectedNodes,
      undo,
      redo,
      clearSelection,
      selectedNodes,
      getCanvasCenter,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
