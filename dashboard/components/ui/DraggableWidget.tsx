'use client';
import { useDrag, useDrop } from 'react-dnd';

interface DraggableWidgetProps {
  id: string;
  index: number;
  component: React.ReactNode;
  moveWidget: (fromIndex: number, toIndex: number) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  index,
  component,
  moveWidget,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'widget',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveWidget(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {component}
    </div>
  );
};

export default DraggableWidget;