import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Shield,
  Award,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Download,
  Star,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react";

/**
 * Footer Component
 *
 * Ultra-modern footer with advanced design and perfect responsiveness
 * Features gradient backgrounds, hover animations, and organized sections
 * Links arranged in compact columns for better space utilization
 */
export function Footer() {
  // All links organized by category
  const footerLinks = [
    {
      category: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "How to Play", href: "/how-to-play" },
        { name: "Contests", href: "/contests" },
        { name: "Winners", href: "/winners" },
        { name: "Points System", href: "/points" },
        { name: "Tips & Tricks", href: "/tips" },
        { name: "Fantasy Cricket League", href: "/cricket-league" },
        { name: "Help", href: "/help" },
      ],
    },
    {
      category: "Games",
      links: [
        { name: "Fantasy Cricket", href: "/cricket" },
        { name: "Fantasy Football", href: "/football" },
        { name: "Cricket Schedule", href: "/schedule" },
        { name: "TATA IPL 2025", href: "/ipl" },
        { name: "T20 World Cup", href: "/t20" },
        { name: "Live Matches", href: "/live" },
        { name: "Today's Match Prediction", href: "/prediction" },
        { name: "Cricket Records", href: "/records" },
      ],
    },
    {
      category: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Withdraw Cash", href: "/withdraw" },
        { name: "Responsible Gaming", href: "/responsible" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      name: "Facebook",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: Twitter,
      href: "#",
      name: "Twitter",
      color: "from-sky-500 to-sky-600",
    },
    {
      icon: Instagram,
      href: "#",
      name: "Instagram",
      color: "from-pink-500 to-purple-600",
    },
    {
      icon: Linkedin,
      href: "#",
      name: "LinkedIn",
      color: "from-blue-700 to-blue-800",
    },
    {
      icon: Send,
      href: "#",
      name: "Telegram",
      color: "from-blue-500 to-blue-600",
    },
  ];

  const stats = [
    { icon: Users, value: "10M+", label: "Active Players" },
    { icon: Trophy, value: "₹500Cr+", label: "Prizes Won" },
    { icon: Star, value: "4.8", label: "App Rating" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Top Section with Stats */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105">
                    <stat.icon className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mr-4 shadow-lg">
                  <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center">
                    <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-red-600 to-red-700"></div>
                  </div>
                </div>
                <div>
                  <span className="text-white font-bold text-2xl block">
                    ROSTERRUMBLE
                  </span>
                  <span className="text-red-400 text-sm">
                    Fantasy Sports Platform
                  </span>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                India&apos;s most trusted fantasy sports platform. Create your
                dream team, join contests, and win exciting prizes every day.
                Experience the thrill of fantasy cricket and football.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-3 text-red-500" />
                  <span className="text-sm">+91 8010400200</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-red-500" />
                  <span className="text-sm">support@rosterrumble.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-red-500" />
                  <span className="text-sm">Mumbai, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Follow Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className={`p-3 bg-gradient-to-br ${social.color} rounded-xl hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl`}
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Section - Compact Side-by-Side Layout */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-6">
              {footerLinks.map((section) => (
                <div key={section.category}>
                  <h3 className="font-semibold mb-4 text-lg text-white">
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="flex items-center text-gray-300 hover:text-red-400 transition-all duration-200 text-sm group"
                      >
                        <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Download & Security Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Download App */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white">
                  Download App
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl p-3 flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 border border-gray-700">
                    <Download className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Android App</span>
                  </button>
                  <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl p-3 flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 border border-gray-700">
                    <Download className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">iOS App</span>
                  </button>
                </div>
              </div>

              {/* Security Badges */}
              <div>
                <h3 className="font-semibold mb-4 text-lg text-white">
                  Security
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl p-3 text-center border border-green-500/20 hover:border-green-500/40 transition-all duration-200 hover:scale-105">
                    <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-green-400 font-semibold">
                      SSL Secure
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl p-3 text-center border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 hover:scale-105">
                    <Award className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-blue-400 font-semibold">
                      Certified
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl p-3 text-center col-span-2 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 hover:scale-105">
                    <CreditCard className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                    <div className="text-xs text-purple-400 font-semibold">
                      Safe Payments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 bg-black/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left max-w-2xl">
                <p>
                  © {new Date().getFullYear()} Play Games24x7 Pvt. Ltd. All
                  Rights Reserved.
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-400">
                <span>*18+ only. T&C Apply.</span>
                <span>|</span>
                <span>Play responsibly</span>
                <span>|</span>
                <span>Fantasy sports involves financial risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
