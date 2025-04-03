import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Activity {
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  project: string
  time: string
}

const activities: Activity[] = [
  {
    user: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "JD",
    },
    action: "updated",
    project: "Natural Gas Analysis",
    time: "2 hours ago",
  },
  {
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "SJ",
    },
    action: "created",
    project: "Hydrogen Purity",
    time: "5 hours ago",
  },
  {
    user: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "MC",
    },
    action: "completed",
    project: "Biogas Composition",
    time: "1 day ago",
  },
  {
    user: {
      name: "Emily Wilson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "EW",
    },
    action: "commented on",
    project: "LNG Quality Control",
    time: "2 days ago",
  },
  {
    user: {
      name: "Robert Taylor",
      avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "RT",
    },
    action: "shared",
    project: "Flue Gas Analysis",
    time: "3 days ago",
  },
]

const extendedActivities: Activity[] = [
  ...activities,
  {
    user: {
      name: "Lisa Brown",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "LB",
    },
    action: "archived",
    project: "CO2 Capture Analysis",
    time: "4 days ago",
  },
  {
    user: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "DK",
    },
    action: "exported",
    project: "Syngas Composition",
    time: "1 week ago",
  },
  {
    user: {
      name: "Jennifer Lopez",
      avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=48&h=48&fit=crop&crop=faces&q=80",
      initials: "JL",
    },
    action: "invited you to",
    project: "Methane Leakage Study",
    time: "1 week ago",
  },
]

interface RecentActivityProps {
  extended?: boolean
}

export function RecentActivity({ extended = false }: RecentActivityProps) {
  const displayActivities = extended ? extendedActivities : activities

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-blue-50/50 transition-all duration-300 hover:translate-x-1 group"
        >
          <Avatar className="h-9 w-9 border-2 border-white ring-1 ring-blue-100 shadow-sm bg-blue-50 group-hover:ring-blue-200 group-hover:shadow-md transition-all duration-300">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300">
              {activity.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                {activity.user.name}
              </span>{" "}
              <span className="text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                {activity.action}
              </span>{" "}
              <span className="font-semibold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                {activity.project}
              </span>
            </p>
            <p className="text-xs text-blue-700/60 group-hover:text-blue-700/80 transition-colors duration-300">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

