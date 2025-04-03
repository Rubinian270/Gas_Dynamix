import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProjectCardProps {
  title: string
  description: string
  progress: number
  lastUpdated: string
  id: string
}

export function ProjectCard({ title, description, progress, lastUpdated, id }: ProjectCardProps) {
  return (
    <Card className="flex flex-col border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-4px] overflow-hidden bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
      <CardHeader className="pb-2 border-b border-blue-50 group-hover:bg-blue-50/30 transition-colors duration-300">
        <CardTitle className="line-clamp-1 text-blue-900 font-semibold group-hover:text-blue-800 transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <p className="text-sm text-blue-700/70 line-clamp-2 mb-6 group-hover:text-blue-700/90 transition-colors duration-300">
          {description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700/70">Progress</span>
            <span className="font-medium text-blue-700 group-hover:font-bold transition-all duration-300">
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-blue-100 overflow-hidden"
            style={{
              backgroundImage: "linear-gradient(to right, #f0f5ff 0%, #e0e7ff 100%)",
              boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-blue-50 p-4 bg-gradient-to-r from-blue-50/50 to-white group-hover:from-blue-100/50 group-hover:to-blue-50/30 transition-colors duration-300">
        <div className="text-xs text-blue-700/60">Updated {lastUpdated}</div>
        <Link href={`/dashboard/projects/${id}`}>
          <span className="text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline transition-colors relative group-hover:after:w-full after:absolute after:left-0 after:bottom-0 after:h-px after:bg-blue-700 after:w-0 after:transition-all after:duration-300">
            View Details
          </span>
        </Link>
      </CardFooter>
    </Card>
  )
}

