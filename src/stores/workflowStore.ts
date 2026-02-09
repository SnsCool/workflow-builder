import { create } from 'zustand';
import {
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import {
  WorkflowNode,
  WorkflowEdge,
  Workflow,
  NodeType,
  WorkflowNodeData,
  ToolType,
  HistoryState,
  ClipboardItem,
  AlignmentType,
} from '@/types/workflow';

const MAX_HISTORY = 50;

interface WorkflowState {
  // 状態
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  selectedNodes: string[];
  currentTool: ToolType;
  connectionSourceId: string | null;

  // 履歴管理
  history: HistoryState[];
  historyIndex: number;
  clipboard: ClipboardItem | null;

  // ノード操作
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  addNodeAtPosition: (position: { x: number; y: number }, type?: NodeType) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  updateNodeText: (nodeId: string, text: string) => void;
  deleteNode: (nodeId: string) => void;
  deleteSelectedNodes: () => void;

  // 選択操作
  setSelectedNodes: (nodeIds: string[]) => void;
  clearSelection: () => void;

  // ツール操作
  setCurrentTool: (tool: ToolType) => void;
  setConnectionSourceId: (id: string | null) => void;

  // 履歴操作
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // クリップボード操作
  copySelectedNodes: () => void;
  pasteNodes: (offset?: { x: number; y: number }) => void;
  duplicateSelectedNodes: () => void;

  // 整列操作
  alignNodes: (alignment: AlignmentType) => void;

  // ワークフロー操作
  setWorkflowName: (name: string) => void;
  clearWorkflow: () => void;
  saveWorkflow: () => string;
  loadWorkflow: (json: string) => void;
}

const createNodeData = (): WorkflowNodeData => {
  return { label: '' };
};

let nodeId = 0;
const getNodeId = () => `node_${++nodeId}`;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: '新規ワークフロー',
  selectedNodes: [],
  currentTool: 'select',
  connectionSourceId: null,
  history: [],
  historyIndex: -1,
  clipboard: null,

  onNodesChange: (changes) => {
    // 選択変更を追跡
    const selectionChanges = changes.filter(
      (change) => change.type === 'select'
    );
    if (selectionChanges.length > 0) {
      const selectedIds = get().nodes
        .filter((node) => {
          const change = selectionChanges.find(
            (c) => c.type === 'select' && c.id === node.id
          );
          if (change && change.type === 'select') {
            return change.selected;
          }
          return node.selected;
        })
        .map((node) => node.id);
      set({ selectedNodes: selectedIds });
    }

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    get().saveToHistory();
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'default',
        },
        get().edges
      ),
    });
  },

  addNode: (type, position) => {
    get().saveToHistory();
    const newNode: WorkflowNode = {
      id: getNodeId(),
      type,
      position,
      data: createNodeData(),
      style: type === 'ellipse'
        ? { width: 120, height: 80 }
        : { width: 150, height: 80 },
    };
    set({
      nodes: [...get().nodes, newNode],
    });
  },

  addNodeAtPosition: (position, type = 'text') => {
    get().saveToHistory();
    const newNode: WorkflowNode = {
      id: getNodeId(),
      type,
      position,
      data: createNodeData(),
      style: type === 'ellipse'
        ? { width: 120, height: 80 }
        : { width: 150, height: 80 },
    };
    set({
      nodes: [...get().nodes, newNode],
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      ),
    });
  },

  updateNodeText: (nodeId, text) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: text } as WorkflowNodeData }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    get().saveToHistory();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  deleteSelectedNodes: () => {
    const { selectedNodes, nodes, edges } = get();
    if (selectedNodes.length === 0) return;

    get().saveToHistory();
    set({
      nodes: nodes.filter((node) => !selectedNodes.includes(node.id)),
      edges: edges.filter(
        (edge) =>
          !selectedNodes.includes(edge.source) &&
          !selectedNodes.includes(edge.target)
      ),
      selectedNodes: [],
    });
  },

  setSelectedNodes: (nodeIds) => {
    set({ selectedNodes: nodeIds });
  },

  clearSelection: () => {
    set({
      selectedNodes: [],
      nodes: get().nodes.map((node) => ({ ...node, selected: false })),
    });
  },

  setCurrentTool: (tool) => {
    set({ currentTool: tool, connectionSourceId: null });
  },

  setConnectionSourceId: (id) => {
    set({ connectionSourceId: id });
  },

  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });

    // 履歴の最大数を超えたら古いものを削除
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const prevState = history[newIndex];

    set({
      nodes: JSON.parse(JSON.stringify(prevState.nodes)),
      edges: JSON.parse(JSON.stringify(prevState.edges)),
      historyIndex: newIndex,
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextState = history[newIndex];

    set({
      nodes: JSON.parse(JSON.stringify(nextState.nodes)),
      edges: JSON.parse(JSON.stringify(nextState.edges)),
      historyIndex: newIndex,
    });
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { historyIndex, history } = get();
    return historyIndex < history.length - 1;
  },

  copySelectedNodes: () => {
    const { nodes, edges, selectedNodes } = get();
    if (selectedNodes.length === 0) return;

    const nodesToCopy = nodes.filter((node) =>
      selectedNodes.includes(node.id)
    );
    const edgesToCopy = edges.filter(
      (edge) =>
        selectedNodes.includes(edge.source) &&
        selectedNodes.includes(edge.target)
    );

    set({
      clipboard: {
        nodes: JSON.parse(JSON.stringify(nodesToCopy)),
        edges: JSON.parse(JSON.stringify(edgesToCopy)),
      },
    });
  },

  pasteNodes: (offset = { x: 30, y: 30 }) => {
    const { clipboard, nodes, edges } = get();
    if (!clipboard || clipboard.nodes.length === 0) return;

    get().saveToHistory();

    // IDマッピングを作成
    const idMapping: Record<string, string> = {};
    clipboard.nodes.forEach((node) => {
      idMapping[node.id] = getNodeId();
    });

    // 新しいノードを作成
    const newNodes: WorkflowNode[] = clipboard.nodes.map((node) => ({
      ...node,
      id: idMapping[node.id],
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: true,
    }));

    // 新しいエッジを作成
    const newEdges: WorkflowEdge[] = clipboard.edges.map((edge) => ({
      ...edge,
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: idMapping[edge.source],
      target: idMapping[edge.target],
    }));

    // 既存ノードの選択を解除
    const updatedNodes = nodes.map((node) => ({ ...node, selected: false }));

    set({
      nodes: [...updatedNodes, ...newNodes],
      edges: [...edges, ...newEdges],
      selectedNodes: newNodes.map((node) => node.id),
    });
  },

  duplicateSelectedNodes: () => {
    get().copySelectedNodes();
    get().pasteNodes({ x: 30, y: 30 });
  },

  alignNodes: (alignment) => {
    const { selectedNodes, nodes } = get();
    if (selectedNodes.length < 2) return;

    get().saveToHistory();

    const nodesToAlign = nodes.filter((node) =>
      selectedNodes.includes(node.id)
    );

    let referenceValue: number;

    switch (alignment) {
      case 'left':
        referenceValue = Math.min(
          ...nodesToAlign.map((node) => node.position.x)
        );
        break;
      case 'center':
        const minX = Math.min(...nodesToAlign.map((node) => node.position.x));
        const maxX = Math.max(
          ...nodesToAlign.map(
            (node) =>
              node.position.x + ((node.style?.width as number) || 150)
          )
        );
        referenceValue = (minX + maxX) / 2;
        break;
      case 'right':
        referenceValue = Math.max(
          ...nodesToAlign.map(
            (node) =>
              node.position.x + ((node.style?.width as number) || 150)
          )
        );
        break;
      case 'top':
        referenceValue = Math.min(
          ...nodesToAlign.map((node) => node.position.y)
        );
        break;
      case 'middle':
        const minY = Math.min(...nodesToAlign.map((node) => node.position.y));
        const maxY = Math.max(
          ...nodesToAlign.map(
            (node) =>
              node.position.y + ((node.style?.height as number) || 80)
          )
        );
        referenceValue = (minY + maxY) / 2;
        break;
      case 'bottom':
        referenceValue = Math.max(
          ...nodesToAlign.map(
            (node) =>
              node.position.y + ((node.style?.height as number) || 80)
          )
        );
        break;
    }

    const updatedNodes = nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return node;

      const width = (node.style?.width as number) || 150;
      const height = (node.style?.height as number) || 80;

      let newPosition = { ...node.position };

      switch (alignment) {
        case 'left':
          newPosition.x = referenceValue;
          break;
        case 'center':
          newPosition.x = referenceValue - width / 2;
          break;
        case 'right':
          newPosition.x = referenceValue - width;
          break;
        case 'top':
          newPosition.y = referenceValue;
          break;
        case 'middle':
          newPosition.y = referenceValue - height / 2;
          break;
        case 'bottom':
          newPosition.y = referenceValue - height;
          break;
      }

      return { ...node, position: newPosition };
    });

    set({ nodes: updatedNodes });
  },

  setWorkflowName: (name) => {
    set({ workflowName: name });
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      workflowName: '新規ワークフロー',
      history: [],
      historyIndex: -1,
      selectedNodes: [],
    });
    nodeId = 0;
  },

  saveWorkflow: () => {
    const { nodes, edges, workflowName } = get();
    const workflow: Workflow = {
      id: crypto.randomUUID(),
      name: workflowName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return JSON.stringify(workflow, null, 2);
  },

  loadWorkflow: (json) => {
    try {
      const workflow: Workflow = JSON.parse(json);
      set({
        nodes: workflow.nodes,
        edges: workflow.edges,
        workflowName: workflow.name,
        history: [],
        historyIndex: -1,
      });
      // ノードIDの最大値を更新
      const maxId = workflow.nodes.reduce((max, node) => {
        const match = node.id.match(/node_(\d+)/);
        return match ? Math.max(max, parseInt(match[1])) : max;
      }, 0);
      nodeId = maxId;
    } catch (error) {
      console.error('Failed to load workflow:', error);
      alert('ワークフローの読み込みに失敗しました');
    }
  },
}));
