"use client"
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BaseNode, NodeType } from '../../types/workflow';

interface CustomNodeData extends BaseNode {
  label?: string;
  nodeType: NodeType;
  [key: string]: unknown;
}

export const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const getNodeIcon = (nodeType: NodeType): string => {
    switch (nodeType) {
      case NodeType.WEBHOOK:
        return '🔗';
      case NodeType.API_CALL:
        return '🌐';
      case NodeType.CONDITION:
        return '🔀';
      case NodeType.TIMER:
        return '⏰';
      case NodeType.DATA_TRANSFORM:
        return '🔄';
      case NodeType.LOOP:
        return '🔁';
      default:
        return '📦';
    }
  };

  const getNodeColor = (nodeType: NodeType): string => {
    switch (nodeType) {
      case NodeType.WEBHOOK:
        return '#4CAF50';
      case NodeType.API_CALL:
        return '#2196F3';
      case NodeType.CONDITION:
        return '#FF9800';
      case NodeType.TIMER:
        return '#9C27B0';
      case NodeType.DATA_TRANSFORM:
        return '#00BCD4';
      case NodeType.LOOP:
        return '#795548';
      default:
        return '#757575';
    }
  };

  const isValid = data.config?.isValid !== false;
  const hasErrors = data.config?.errors && data.config.errors.length > 0;

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''} ${!isValid ? 'invalid' : ''}`}
      style={{
        background: 'white',
        border: `2px solid ${selected ? '#1976d2' : getNodeColor(data.type)}`,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '150px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: getNodeColor(data.type),
          width: '12px',
          height: '12px',
        }}
      />

      {/* Node content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>{getNodeIcon(data.type)}</span>
        <div>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333',
              marginBottom: '2px',
            }}
          >
            {data.label || data.type.replace('_', ' ').toUpperCase()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              textTransform: 'capitalize',
            }}
          >
            {typeof data.type === 'string' ? data.type.replace(/_/g, ' ') : ''}
          </div>
        </div>
      </div>

      {/* Error indicator */}
      {hasErrors && (
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#f44336',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          !
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: getNodeColor(data.type),
          width: '12px',
          height: '12px',
        }}
      />
    </div>
  );
};