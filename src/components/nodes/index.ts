import TextNode from './TextNode';
import EllipseNode from './EllipseNode';

// nodeTypesをコンポーネント外で定義（再レンダリング防止）
export const nodeTypes = {
  text: TextNode,
  ellipse: EllipseNode,
};

export { TextNode, EllipseNode };
