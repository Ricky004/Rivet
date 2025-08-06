"use client"
import { WorkflowCanvas } from "@/lib/components/WorkflowCanvas/WorkflowCanvas";
import { Workflow, WorkflowStatus, } from "@/lib/types/workflow";
import { NodePalette } from '../NodePalette/NodePalette';
import React, { useState } from "react";

interface WorkflowBuilderProps {
  initialWorkflow?: Workflow;
  onWorkflowChange?: (workflow: Workflow) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  initialWorkflow,
  onWorkflowChange
}) => {

  const [workflow, setWorkflow] = useState<Workflow>(
    initialWorkflow || {
      id: 'demo-workflow',
      name: 'Demo Workflow',
      nodes: [],
      edge: [],
      metadata: {
        name: 'Demo Workflow',
        description: 'A demo workflow for testing',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'demo-user',
      },
      status: WorkflowStatus.DRAFT,
      triggers: [],
    }
  );

  const handleWorkflowChange = (updatedWorkflow: Workflow) => {
    setWorkflow(updatedWorkflow);
    onWorkflowChange?.(updatedWorkflow);
  };
  return (
    <div className="flex overflow-hidden h-screen w-screen">
        <NodePalette className="shrink-0" />
        <div className="flex-1 relative overflow-hidden">
        <WorkflowCanvas
          {...workflow}
          onWorkflowChange={handleWorkflowChange}
          className="h-full w-full"
        />
        </div>
      </div>
  );
}
