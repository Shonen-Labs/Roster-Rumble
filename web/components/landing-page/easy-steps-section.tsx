"use client";

import { useState } from "react";
import { Play, Target, Users, Trophy } from "lucide-react";

/**
 * Easy Steps Section
 *
 * Red background section with playable video and step guide
 */
export function EasyStepsSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const steps = [
    {
      icon: Target,
      title: "Select a Match",
      description:
        "Select an upcoming match of your choice from our extensive list",
    },
    {
      icon: Users,
      title: "Create your own team",
      description:
        "Use your sports knowledge and check player stats to create a winning team using 100 credits",
    },
    {
      icon: Trophy,
      title: "Join Free & Cash Contests",
      description:
        "Participate in Cash or Practice Contests and win exciting prizes",
    },
  ];

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // You can add actual video play logic here
  };

  return (
    <section className="bg-red-600 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-16">
          3 Easy Steps
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Video Section */}
          <div className="relative group">
            <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl">
              {!isVideoPlaying ? (
                // Video Thumbnail/Placeholder
                <div
                  className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-300 cursor-pointer"
                  onClick={handleVideoPlay}
                >
                  <div className="text-center">
                    <div className="relative">
                      <Play className="text-red-500 h-20 w-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-white text-lg font-semibold">
                      How to play on RosterRumble
                    </p>
                    <p className="text-white/70 text-sm mt-2">
                      Click to play video
                    </p>
                  </div>
                </div>
              ) : (
                // Actual Video Element
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  poster="/appScreenshot.png"
                >
                  <source src="/how-to-play.mp4" type="video/mp4" />
                  <source src="/how-to-play.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Video Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3">
              <p className="text-white font-semibold">
                How to play on RosterRumble | Tutorial
              </p>
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-full p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                  <step.icon className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-3 group-hover:text-red-100 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
