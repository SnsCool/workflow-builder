import { Node, Edge } from '@xyflow/react';

// ノードタイプの定義
export type NodeType = 'text' | 'ellipse';

// ツールタイプの定義
export type ToolType = 'select' | 'text' | 'rectangle' | 'ellipse' | 'connection';

// カスタムノードデータの型
export interface TextNodeData extends Record<string, unknown> {
  label: string;
  onTextChange?: (nodeId: string, text: string) => void;
}

export interface EllipseNodeData extends Record<string, unknown> {
  label: string;
  onTextChange?: (nodeId: string, text: string) => void;
}

export type WorkflowNodeData = TextNodeData | EllipseNodeData;

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

// 履歴管理用の状態スナップショット
export interface HistoryState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// クリップボードアイテム
export interface ClipboardItem {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// 整列タイプ
export type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
