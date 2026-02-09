import { create } from 'zustand';
import {
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import { WorkflowNode, WorkflowEdge, Workflow, NodeType, WorkflowNodeData } from '@/types/workflow';

interface WorkflowState {
  // 状態
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;

  // ノード操作
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  addNodeAtPosition: (position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  updateNodeText: (nodeId: string, text: string) => void;
  deleteNode: (nodeId: string) => void;

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

  onNodesChange: (changes) => {
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
    const newNode: WorkflowNode = {
      id: getNodeId(),
      type,
      position,
      data: createNodeData(),
      style: { width: 150, height: 80 },
    };
    set({
      nodes: [...get().nodes, newNode],
    });
  },

  addNodeAtPosition: (position) => {
    const newNode: WorkflowNode = {
      id: getNodeId(),
      type: 'text',
      position,
      data: createNodeData(),
      style: { width: 150, height: 80 },
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
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  setWorkflowName: (name) => {
    set({ workflowName: name });
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      workflowName: '新規ワークフロー',
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
