'use client';

import { useCallback, useRef, DragEvent, MouseEvent } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
  SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '@/components/nodes';
import DefaultEdge from '@/components/edges/DefaultEdge';
import VerticalToolbar from '@/components/workflow/VerticalToolbar';
import AlignmentMenu from '@/components/workflow/AlignmentMenu';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { NodeType } from '@/types/workflow';

// edgeTypesをコンポーネント外で定義（再レンダリング防止）
const edgeTypes = {
  default: DefaultEdge,
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    addNodeAtPosition,
    updateNodeText,
    currentTool,
    setCurrentTool,
    connectionSourceId,
    setConnectionSourceId,
  } = useWorkflowStore();

  // キーボードショートカットを有効化
  useKeyboardShortcuts();

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  // ダブルクリックで新しいノードを追加
  const onDoubleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // ノードやエッジ上でのダブルクリックは無視
      const target = event.target as HTMLElement;
      if (target.closest('.react-flow__node') || target.closest('.react-flow__edge')) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // 現在のツールに基づいてノードタイプを決定
      let nodeType: NodeType = 'text';
      if (currentTool === 'ellipse') {
        nodeType = 'ellipse';
      }

      addNodeAtPosition(position, nodeType);
    },
    [screenToFlowPosition, addNodeAtPosition, currentTool]
  );

  // キャンバスクリック時の処理
  const onPaneClick = useCallback(
    (event: MouseEvent<Element>) => {
      // 接続モードでクリックした場合
      if (currentTool === 'connection') {
        // ノード上でクリックした場合
        const target = event.target as HTMLElement;
        const nodeElement = target.closest('.react-flow__node');
        if (nodeElement) {
          const nodeId = nodeElement.getAttribute('data-id');
          if (nodeId) {
            if (!connectionSourceId) {
              // 最初のノードを選択
              setConnectionSourceId(nodeId);
            } else if (connectionSourceId !== nodeId) {
              // 2番目のノードを選択して接続を作成
              onConnect({
                source: connectionSourceId,
                target: nodeId,
                sourceHandle: null,
                targetHandle: null,
              });
              setConnectionSourceId(null);
            }
          }
        } else {
          // 空白をクリックした場合は接続モードをリセット
          setConnectionSourceId(null);
        }
      } else if (currentTool !== 'select') {
        // ツールが選択されている場合、クリック位置にノードを追加
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        let nodeType: NodeType = 'text';
        if (currentTool === 'ellipse') {
          nodeType = 'ellipse';
        }

        addNodeAtPosition(position, nodeType);
        setCurrentTool('select');
      }
    },
    [
      currentTool,
      connectionSourceId,
      setConnectionSourceId,
      onConnect,
      screenToFlowPosition,
      addNodeAtPosition,
      setCurrentTool,
    ]
  );

  // ノードにテキスト変更ハンドラを注入
  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onTextChange: updateNodeText,
    },
    // 接続モードでソースとして選択されているノードをハイライト
    className: connectionSourceId === node.id ? 'ring-2 ring-blue-500' : '',
  }));

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDoubleClick={onDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        selectionOnDrag
        panOnDrag={currentTool === 'select' ? [1, 2] : false}
        selectionMode={SelectionMode.Partial}
        defaultEdgeOptions={{
          type: 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#000000',
          },
          style: {
            stroke: '#000000',
            strokeWidth: 1,
          },
        }}
        connectionLineStyle={{ stroke: '#000000', strokeWidth: 1 }}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#cccccc"
        />
        <Controls
          showZoom
          showFitView
          showInteractive={false}
          position="bottom-right"
          className="bg-white border border-gray-300"
        />
      </ReactFlow>
      <VerticalToolbar />
      <AlignmentMenu />
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
