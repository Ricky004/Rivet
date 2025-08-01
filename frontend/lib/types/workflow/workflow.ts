/** 
 * Core workflow data models and type definitions
 */

import { TriggerConfig } from "./auth"
import { WebhookNode, ApiCallNode, ConditionNode, TimerNode, DataTransformNode, LoopNode } from "./nodes"

// Base position interface for node positioning
export interface Position {
    x: number
    y: number
}

// Node type enums
export enum NodeType {
    WEBHOOK = 'webhook',
    API_CALL = 'api_call',
    CONDITION = 'condition',
    TIMER = 'timer',
    DATA_TRANSFORM = 'data_transform',
    LOOP = 'loop'
}

// Base node interface 
export interface BaseNode {
    id: string
    type: NodeType
    position: Position
    data: NodeData
    config: NodeConfig
}

// Generic node data interface
export interface NodeData {
    label?: string
    description?: string
    [key: string]: unknown
}

// Generic node data interface
export interface NodeConfig {
    isValid?: boolean
    errors?: string[]
    [key: string]: unknown
}

// Workflow edge interface 
export interface WorkflowEdge {
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
    type?: string
    data?: EdgeData
}

// Edge data interface
export interface EdgeData {
    label?: string
    condition?: string
    [key: string]: unknown
}

// Workflow Metadata interface
export interface WorkflowMetadata {
    name: string
    description?: string
    version: number
    createdAt: Date
    updatedAt: Date
    createdBy: string
    tags?: string[]
}

// Main workflow interface
export interface Workflow {
    id: string
    name: string
    nodes: WorkflowNode[]
    edge: WorkflowEdge[]
    metadata: WorkflowMetadata
    status: WorkflowStatus
    triggers: TriggerConfig[]
}

// Workflow status enums
export enum WorkflowStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ARCHIVED = 'archived'
}

// Union type for all Workflow nodes
export type WorkflowNode = WebhookNode | ApiCallNode | ConditionNode | TimerNode | DataTransformNode | LoopNode