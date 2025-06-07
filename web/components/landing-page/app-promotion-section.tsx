import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

/**
 * App Promotion Section
 *
 * Showcases the mobile app with features and app screenshot
 * Clean and advanced layout without childish elements
 */
export function AppPromotionSection() {
  const features = [
    "Lightning-fast gameplay experience",
    "Real-time match updates and notifications",
    "Secure payment gateway integration",
    "Expert analysis and player insights",
    "24/7 customer support",
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div>
              <h2 className="text-red-600 text-4xl md:text-5xl font-bold mb-6">
                Play Fantasy Cricket on RosterRumble App
              </h2>
              <div className="w-20 h-1 bg-red-600 rounded-full"></div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Want to enjoy fantasy games like cricket but just can&apos;t
                manage the time? Well, RosterRumble.com is the answer you need.
                This is the place where your favorite fantasy sports come alive.
              </p>

              <p>
                RosterRumble.com brings the best fantasy games at your
                fingertips. It is committed to offering the same gameplay
                experience with millions of players. Register with us, pick a
                game and win cash daily.
              </p>

              <p>
                Fantasy cricket and football boost your skill and let you win
                real cash rewards. We offer a safe and secured platform to enjoy
                online fantasy sports at your leisure.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-red-500 fill-current flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-7 text-lg rounded-xl">
              Today&apos;s Match Preview
            </Button>
          </div>

          {/* Mobile App Image  */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <Image
                src="/appScreenshot.png"
                alt="RosterRumble Mobile App Screenshot"
                width={400}
                height={800}
                className="w-full h-auto rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
