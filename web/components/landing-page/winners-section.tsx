/**
 * Winners Section
 *
 * Clean showcase of crorepati winners with modern card design
 */
export function WinnersSection() {
  const winners = [
    { name: "DARSHAN BISHT", amount: "₹1 CRORE", location: "UTTARAKHAND" },
    { name: "PRADIP APTE", amount: "₹1 CRORE", location: "MAHARSHTRA" },
    { name: "UPENDRA KUMAR", amount: "₹5 CRORE", location: "UTTAR PRADESH" },
    { name: "GOUR BHAIRAGYA", amount: "₹1 CRORE", location: "WEST BENGAL" },
  ];

  return (
    <section className="relative min-h-[600px] bg-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {winners.map((winner, index) => (
              <div
                key={index}
                className="group bg-white border border-red-200 rounded-2xl p-6 hover:bg-red-50 transition-all duration-500 hover:scale-105 hover:shadow-lg"
              >
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/50 transition-all duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-red-500 font-bold text-lg">
                        {winner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">👑</span>
                  </div>
                </div>

                <h3 className="text-red-700 font-bold text-sm mb-1">
                  {winner.name}
                </h3>
                <div className="text-2xl font-bold text-red-500 mb-1">
                  {winner.amount}
                </div>
                <p className="text-red-400 text-xs">{winner.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
