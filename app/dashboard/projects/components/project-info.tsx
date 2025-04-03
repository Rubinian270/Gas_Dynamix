import { Badge } from "@/components/ui/badge"

interface ProjectInfoProps {
  id: string
}

export function ProjectInfo({ id }: ProjectInfoProps) {
  // This would typically fetch project data based on the ID
  // For demo purposes, we're using static data
  const projectData = {
    name:
      id === "proj-1"
        ? "Natural Gas Analysis"
        : id === "proj-2"
          ? "Biogas Composition"
          : id === "proj-3"
            ? "Hydrogen Purity"
            : id === "proj-4"
              ? "LNG Quality Control"
              : id === "proj-5"
                ? "Flue Gas Analysis"
                : "Gas Analysis Project",
    client: "Acme Energy Corporation",
    location: "Well Site A-123, North Field",
    startDate: "2025-01-15",
    status: id === "proj-3" ? "Completed" : "In Progress",
    sampleType: "Natural Gas",
    sampleMethod: "Continuous Flow Sampling",
    analyst: "Dr. Sarah Johnson",
    lastUpdated: "2025-03-22",
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-blue-900 mb-2">{projectData.name}</h3>
        <Badge
          variant={projectData.status === "Completed" ? "default" : "secondary"}
          className={
            projectData.status === "Completed"
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
          }
        >
          {projectData.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-blue-700/60 mb-1">Client</p>
          <p className="font-medium text-blue-900">{projectData.client}</p>
        </div>
        <div>
          <p className="text-blue-700/60 mb-1">Location</p>
          <p className="font-medium text-blue-900">{projectData.location}</p>
        </div>
        <div>
          <p className="text-blue-700/60 mb-1">Start Date</p>
          <p className="font-medium text-blue-900">{projectData.startDate}</p>
        </div>
        <div>
          <p className="text-blue-700/60 mb-1">Last Updated</p>
          <p className="font-medium text-blue-900">{projectData.lastUpdated}</p>
        </div>
        <div>
          <p className="text-blue-700/60 mb-1">Sample Type</p>
          <p className="font-medium text-blue-900">{projectData.sampleType}</p>
        </div>
        <div>
          <p className="text-blue-700/60 mb-1">Sample Method</p>
          <p className="font-medium text-blue-900">{projectData.sampleMethod}</p>
        </div>
        <div>
          <p className="text-blue-700/60 mb-1">Analyst</p>
          <p className="font-medium text-blue-900">{projectData.analyst}</p>
        </div>
      </div>
    </div>
  )
}

