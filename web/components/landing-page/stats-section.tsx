import { Star, Users, IndianRupee } from "lucide-react"

/**
 * Stats Section
 *
 * Displays key platform statistics in modern card design
 * Features hover animations and responsive grid layout
 */
export function StatsSection() {
  const stats = [
    {
      icon: Star,
      number: "4.3",
      title: "4.3 OUT OF 5",
      subtitle: "USER RATING",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      number: "4+",
      title: "CRORE",
      subtitle: "TOTAL USERS",
      color: "text-blue-500",
    },
    {
      icon: IndianRupee,
      number: "₹500",
      title: "CRORE+",
      subtitle: "PRIZES WON",
      color: "text-green-500",
    },
  ]

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center">
                {/* Icon & Number */}
                <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center min-w-[80px] h-20 mr-4 group-hover:bg-red-50 transition-colors">
                  <div className="text-center">
                    <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-1`} />
                    <span className="text-2xl font-bold text-gray-800">{stat.number}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <div className="text-gray-800 font-bold text-sm mb-1">{stat.title}</div>
                  <div className="text-gray-600 text-sm">{stat.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
