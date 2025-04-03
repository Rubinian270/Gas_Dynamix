import { Badge } from "@/components/ui/badge"

interface Activity {
  id: number
  type: "project" | "analysis" | "comment" | "certification"
  title: string
  description: string
  date: string
  badge?: {
    text: string
    variant: "blue" | "green" | "purple" | "amber"
  }
}

const activities: Activity[] = [
  {
    id: 1,
    type: "project",
    title: "Natural Gas Analysis",
    description: "Started a new project for Acme Energy Corporation",
    date: "2 days ago",
    badge: {
      text: "New Project",
      variant: "blue",
    },
  },
  {
    id: 2,
    type: "analysis",
    title: "Methane Concentration Analysis",
    description: "Completed analysis with 99.8% accuracy",
    date: "3 days ago",
    badge: {
      text: "Completed",
      variant: "green",
    },
  },
  {
    id: 3,
    type: "comment",
    title: "Biogas Composition",
    description: "Added comments on the ethane concentration findings",
    date: "1 week ago",
  },
  {
    id: 4,
    type: "certification",
    title: "Advanced Gas Analysis Certification",
    description: "Obtained certification from International Gas Association",
    date: "2 weeks ago",
    badge: {
      text: "Certification",
      variant: "purple",
    },
  },
  {
    id: 5,
    type: "project",
    title: "LNG Quality Control",
    description: "Joined project team as lead analyst",
    date: "3 weeks ago",
    badge: {
      text: "Joined",
      variant: "amber",
    },
  },
]

export function ProfileActivity() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100"></div>

        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-10 group">
              <div className="absolute left-0 top-2 h-8 w-8 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <div className="h-3 w-3 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors duration-300"></div>
              </div>

              <div className="p-4 rounded-lg border border-blue-100 hover:border-blue-200 bg-white hover:bg-blue-50/30 transition-all duration-300 hover:shadow-md hover:translate-x-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                        {activity.title}
                      </h4>
                      {activity.badge && (
                        <Badge
                          className={`
                            ${activity.badge.variant === "blue" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
                            ${activity.badge.variant === "green" ? "bg-green-100 text-green-700 border-green-200" : ""}
                            ${activity.badge.variant === "purple" ? "bg-purple-100 text-purple-700 border-purple-200" : ""}
                            ${activity.badge.variant === "amber" ? "bg-amber-100 text-amber-700 border-amber-200" : ""}
                          `}
                        >
                          {activity.badge.text}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-blue-700/60 group-hover:text-blue-700/80 transition-colors duration-300">
                    {activity.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

