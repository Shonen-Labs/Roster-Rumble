import { Phone, Smartphone, ArrowRight } from "lucide-react";

/**
 * Missed Call Section
 *
 * Enhanced call-to-action section with phone number and app download
 * Advanced design with subtle animations and visual elements
 */
export function ContactSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 py-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Missed Call Info  */}
          <div className="flex items-center justify-center text-center md:text-left group bg-black/30 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-all duration-300">
            <div className="relative">
              <div className="absolute -inset-1 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
              <div className="relative bg-red-500 rounded-full p-3">
                <Phone className="text-white h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <span className="text-gray-300 font-medium text-sm block mb-1">
                GIVE A MISSED CALL
              </span>
              <div className="relative">
                <span className="text-white text-2xl md:text-3xl font-bold tracking-wider">
                  <span className="text-red-500">8010</span>400200
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          </div>

          {/* App Download Button */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative flex items-center bg-black rounded-xl px-6 py-4 hover:bg-gray-900 transition-all duration-300 cursor-pointer border border-gray-800">
              <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-xl mr-4">
                <Smartphone className="text-red-500 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400 mb-1">
                  To Download Your
                </div>
                <div className="flex items-center">
                  <span className="text-white font-bold">ROSTER</span>
                  <span className="text-red-500 font-bold">RUMBLE</span>
                  <span className="text-white font-bold ml-1">APP</span>
                  <ArrowRight className="h-4 w-0 text-red-400 ml-0 opacity-0 group-hover:w-4 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
