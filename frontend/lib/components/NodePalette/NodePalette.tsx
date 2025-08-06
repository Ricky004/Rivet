import React from 'react';
import { NodeType } from '../../types/workflow';
import './NodePalette.css';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const nodeTypes: NodePaletteItem[] = [
  {
    type: NodeType.WEBHOOK,
    label: 'Webhook',
    description: 'Receive data from external services',
    icon: '🔗',
    color: '#4CAF50',
  },
  {
    type: NodeType.API_CALL,
    label: 'API Call',
    description: 'Make HTTP requests to external APIs',
    icon: '🌐',
    color: '#2196F3',
  },
  {
    type: NodeType.CONDITION,
    label: 'Condition',
    description: 'Add conditional logic and branching',
    icon: '🔀',
    color: '#FF9800',
  },
  {
    type: NodeType.TIMER,
    label: 'Timer',
    description: 'Add delays and scheduling',
    icon: '⏰',
    color: '#9C27B0',
  },
  {
    type: NodeType.DATA_TRANSFORM,
    label: 'Transform',
    description: 'Transform and map data between steps',
    icon: '🔄',
    color: '#00BCD4',
  },
  {
    type: NodeType.LOOP,
    label: 'Loop',
    description: 'Repeat actions with iteration control',
    icon: '🔁',
    color: '#795548',
  },
];

interface NodePaletteProps {
  className?: string;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ className = '' }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={`node-palette ${className}`}>
      <div className="node-palette-header">
        <h3>Node Palette</h3>
        <p>Drag nodes to the canvas to build your workflow</p>
      </div>
      
      <div className="node-palette-items">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className="node-palette-item"
            draggable
            onDragStart={(event) => onDragStart(event, nodeType.type)}
            style={{
              borderColor: nodeType.color,
            }}
          >
            <div className="node-palette-item-icon" style={{ color: nodeType.color }}>
              {nodeType.icon}
            </div>
            <div className="node-palette-item-content">
              <div className="node-palette-item-label">{nodeType.label}</div>
              <div className="node-palette-item-description">{nodeType.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};