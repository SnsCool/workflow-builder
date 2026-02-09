import { Node, Edge } from '@xyflow/react';

// ノードタイプの定義（シンプル化：テキストノードのみ）
export type NodeType = 'text';

// カスタムノードデータの型
export interface TextNodeData extends Record<string, unknown> {
  label: string;
  onTextChange?: (nodeId: string, text: string) => void;
}

export type WorkflowNodeData = TextNodeData;

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
