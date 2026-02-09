import { Node, Edge } from '@xyflow/react';

// ノードタイプの定義
export type NodeType = 'start' | 'end' | 'task' | 'condition';

// カスタムノードデータの型
export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  assignee?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface ConditionNodeData extends BaseNodeData {
  type: 'condition';
  condition?: string;
}

export type WorkflowNodeData = StartNodeData | EndNodeData | TaskNodeData | ConditionNodeData;

// ワークフローノードの型
export type WorkflowNode = Node<WorkflowNodeData, NodeType>;

// ワークフローエッジの型
export interface WorkflowEdgeData extends Record<string, unknown> {
  label?: string;
}

export type WorkflowEdge = Edge<WorkflowEdgeData>;

// ワークフロー全体の型
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// ドラッグアイテムの型
export interface DragItem {
  type: NodeType;
  label: string;
}
