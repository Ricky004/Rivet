/**
 * Specific node type definitions
*/

import { BaseNode, NodeType } from './workflow';
import { AuthConfig, RetryConfig } from './auth';

// Webhook node interface
export interface WebhookNode extends BaseNode {
    type: NodeType.WEBHOOK
    data: WebhookNodeData
}

export interface WebhookNodeData {
    service: WebhookService
    endpoint: string
    authentication: AuthConfig;
    eventTypes: string[]
    secret?: string
    isActive: boolean
    [key: string]: unknown
}

export enum WebhookService {
    STRIPE = 'stripe',
    TYPEFORM = 'typeform',
    TWILIO = 'twilio',
    GITHUB = 'github'
}

// API call node interface
export interface ApiCallNode extends BaseNode {
    type: NodeType.API_CALL
    data: ApiCallNodeData
}

export interface ApiCallNodeData {
    method: HttpMethod
    url: string
    headers: Record<string, string>
    body?: unknown
    authenticaition: AuthConfig
    retryConfig: RetryConfig
    timeout?: number
    [key: string]: unknown
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

// Condition node interface
export interface ConditionNode extends BaseNode {
    type: NodeType.CONDITION
    data: ConditionNodeData
}

export interface ConditionNodeData {
    conditionType: ConditionType
    conditions: Condition[]
    defaultPath?: string;
    [key: string]: unknown
}

export enum ConditionType {
    IF_ELSE = 'if_else',
    SWITCH = 'switch'
}

export interface Condition {
    id: string;
    field: string;
    operator: ComparisonOperator
    value: unknown
    path: string
}

export enum ComparisonOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'not_equals',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
    GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
    LESS_THAN_OR_EQUAL = 'less_than_or_equal',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'not_contains',
    STARTS_WITH = 'starts_with',
    ENDS_WITH = 'ends_with',
    IS_EMPTY = 'is_empty',
    IS_NOT_EMPTY = 'is_not_empty'
}

// Timer node interface
export interface TimerNode extends BaseNode {
    type: NodeType.TIMER
    data: TimerNodeData
}
export interface TimerNodeData {
    duration: number
    unit: TimeUnit
    timerType: TimerType
    [key: string]: unknown
}

export enum TimeUnit {
    SECONDS = 'seconds',
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days'
}

export enum TimerType {
    DELAY = 'delay',
    WAIT = 'wait',
    SCHEDULE = 'schedule'
}

// Data transform node interface
export interface DataTransformNode extends BaseNode {
    type: NodeType.DATA_TRANSFORM
    data: DataTransformNodeData
}
export interface DataTransformNodeData {
    inputSchema?: Schema
    outputSchema?: Schema
    mappings: FieldMapping[]
    transformations: Transformation[]
    [key: string]: unknown
}

export interface Schema {
    type: 'object' | 'array' | 'string' | 'number' | 'boolean';
    properties?: Record<string, Schema>
    items?: Schema
    required?: string[]
}

export interface FieldMapping {
    id: string;
    source: string;
    target: string;
    transformation?: TransformationType;
}

export interface Transformation {
    id: string;
    type: TransformationType;
    config: TransformationConfig;
}

export enum TransformationType {
    FORMAT_DATE = 'format_date',
    FORMAT_NUMBER = 'format_number',
    STRING_UPPERCASE = 'string_uppercase',
    STRING_LOWERCASE = 'string_lowercase',
    STRING_TRIM = 'string_trim',
    MATH_ADD = 'math_add',
    MATH_SUBTRACT = 'math_subtract',
    MATH_MULTIPLY = 'math_multiply',
    MATH_DIVIDE = 'math_divide',
    CUSTOM_FUNCTION = 'custom_function'
}

export interface TransformationConfig {
    [key: string]: unknown;
}

// Loop node interface
export interface LoopNode extends BaseNode {
    type: NodeType.LOOP;
    data: LoopNodeData;
}

export interface LoopNodeData {
    loopType: LoopType;
    iterations?: number;
    condition?: Condition;
    arrayPath?: string;
    [key: string]: unknown
}

export enum LoopType {
    FOR = 'for',
    WHILE = 'while',
    FOR_EACH = 'for_each'
}