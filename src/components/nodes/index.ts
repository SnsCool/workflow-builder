import StartNode from './StartNode';
import EndNode from './EndNode';
import TaskNode from './TaskNode';
import ConditionNode from './ConditionNode';

// nodeTypesをコンポーネント外で定義（再レンダリング防止）
export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  condition: ConditionNode,
};

export { StartNode, EndNode, TaskNode, ConditionNode };
