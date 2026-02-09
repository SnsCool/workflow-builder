'use client';

import Sidebar from '@/components/workflow/Sidebar';
import Toolbar from '@/components/workflow/Toolbar';
import WorkflowCanvas from '@/components/workflow/WorkflowCanvas';

export default function WorkflowPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <WorkflowCanvas />
      </div>
    </div>
  );
}
