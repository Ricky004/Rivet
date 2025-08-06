"use client"
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Workflow, WorkflowNode, WorkflowEdge, NodeType } from '../../types/workflow';
import { CustomNode } from './CustomNode';
import './WorkflowCanvas.css';

// Define custom node types for React Flow
const nodeTypes: NodeTypes = {
  [NodeType.WEBHOOK]: CustomNode,
  [NodeType.API_CALL]: CustomNode,
  [NodeType.CONDITION]: CustomNode,
  [NodeType.TIMER]: CustomNode,
  [NodeType.DATA_TRANSFORM]: CustomNode,
  [NodeType.LOOP]: CustomNode,
} as NodeTypes

interface WorkflowCanvasProps extends Workflow {
  workflow?: Workflow;
  onWorkflowChange?: (workflow: Workflow) => void;
  isExecuting?: boolean;
  className?: string;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  onWorkflowChange,
  isExecuting = false,
  className = '',
}) => {
  // Convert workflow nodes to React Flow nodes
  const initialNodes: Node[] = workflow?.nodes.map((node: WorkflowNode) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      ...node.data,
      nodeType: node.type,
      config: node.config,
    },
  })) || [];

  // Convert workflow edges to React Flow edges
  const initialEdges: Edge[] = workflow?.edge.map((edge: WorkflowEdge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    type: edge.type,
    data: edge.data,
  })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections between nodes
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));

      // Update workflow if callback provided
      if (onWorkflowChange && workflow) {
        const newWorkflowEdge: WorkflowEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          type: 'default',
        }

        const updatedWorkflow: Workflow = {
          ...workflow,
          edge: [...workflow.edge, newWorkflowEdge]
        }
        onWorkflowChange(updatedWorkflow);
      }
    },
    [setEdges, onWorkflowChange, workflow]
  );

  // Handle node changes (position, selection, etc.)
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);

      // Update workflow if callback provided
      if (onWorkflowChange && workflow) {
        // Apply changes to get updated nodes
        const updatedNodes = nodes.map((node) => {
          const change = changes.find(
            (c) => c.type !== 'add' && 'id' in c && c.id === node.id
          );
          if (change && change.type === 'position' && 'position' in change) {
            return {
              ...node,
              position: change.position || node.position,
            };
          }
          return node;
        });

        const updatedWorkflowNodes: WorkflowNode[] = updatedNodes.map((node) => ({
          id: node.id,
          type: node.type as NodeType,
          position: node.position,
          data: node.data,
          config: node.data.config || {},
        }) as WorkflowNode);

        const updatedWorkflow: Workflow = {
          ...workflow,
          nodes: updatedWorkflowNodes,
        };
        onWorkflowChange(updatedWorkflow);
      }
    },
    [onNodesChange, onWorkflowChange, workflow, nodes]
  );

  // Handle edge changes (deletion, etc.)
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);

      // Update workflow if callback provided
      if (onWorkflowChange && workflow) {
        const deletedEdgeIds = changes
          .filter((change) => change.type === 'remove')
          .map((change) => change.id);

        if (deletedEdgeIds.length > 0) {
          const updatedWorkflow: Workflow = {
            ...workflow,
            edge: workflow.edge.filter((edge) => !deletedEdgeIds.includes(edge.id)),
          };
          onWorkflowChange(updatedWorkflow);
        }
      }
    },
    [onEdgesChange, onWorkflowChange, workflow]
  );

  // Handle drop events for adding new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element).getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow');


      if (!nodeType) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNodeId = `${nodeType}-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type: nodeType as NodeType,
        position,
        data: {
          label: `${nodeType.replace('_', ' ').toUpperCase()} Node`,
          nodeTypes,
          config: { isValid: true },
        },
      };

      setNodes((nds) => nds.concat(newNode));

      // Update workflow if callback provided
      if (onWorkflowChange && workflow) {
        const newWorkflowNode: WorkflowNode = {
          id: newNodeId,
          type: nodeType as NodeType,
          position,
          data: {
            label: `${nodeType.replace('_', ' ').toUpperCase()} Node`,
          },
          config: { isValid: false },
        } as unknown as WorkflowNode ;

        const updatedWorkflow: Workflow = {
          ...workflow,
          nodes: [...workflow.nodes, newWorkflowNode],
        };
        onWorkflowChange(updatedWorkflow);
      }
    },
    [setNodes, onWorkflowChange, workflow]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className={`workflow-canvas ${className}`} style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        className={isExecuting ? 'executing' : ''}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};