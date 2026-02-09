import TextNode from './TextNode';

// nodeTypesをコンポーネント外で定義（再レンダリング防止）
export const nodeTypes = {
  text: TextNode,
};

export { TextNode };
