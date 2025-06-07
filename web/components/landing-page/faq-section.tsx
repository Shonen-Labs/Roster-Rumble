import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * FAQ Section
 *
 * Comprehensive FAQ with tabbed interface for Cricket/Football
 * Modern accordion design with smooth animations
 */
export function FAQSection() {
  const cricketFAQs = [
    {
      question: "What is Fantasy Cricket?",
      answer:
        "Fantasy Cricket is a virtual game where you create your own team of real cricket players and earn points based on their actual performance in live matches.",
    },
    {
      question: "How to Download the Fantasy Cricket App?",
      answer:
        "You can download the RosterRumble app from Google Play Store for Android devices or App Store for iOS devices.",
    },
    {
      question:
        "Play Daily Fantasy Cricket Tournaments & Win Real Cash on RosterRumble",
      answer:
        "Join daily contests, create your team, and compete with millions of players to win exciting cash prizes.",
    },
    {
      question: "Benefits of Playing Fantasy Sports on RosterRumble App",
      answer:
        "Enjoy secure gameplay, instant withdrawals, expert analysis, daily bonuses, and 24/7 customer support.",
    },
    {
      question: "Can I Play Practice Fantasy Cricket Games on RosterRumble?",
      answer:
        "Yes, you can play practice games to improve your skills before joining cash contests.",
    },
  ];

  const additionalFAQs = [
    {
      question: "Why Fantasy Games?",
      answer:
        "Fantasy games combine your sports knowledge with strategy to win real cash prizes while enjoying your favorite sports.",
    },
    {
      question: "Unique Features of RosterRumble",
      answer:
        "We offer unique features like expert tips, live match updates, instant withdrawals, and secure gameplay.",
    },
    {
      question: "Playing Fantasy Cricket & Football is Safe, Secure & Legal",
      answer:
        "Yes, fantasy sports are completely legal in India and we ensure 100% secure transactions and fair gameplay.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="cricket" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white shadow-lg rounded-xl">
              <TabsTrigger
                value="cricket"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg font-semibold"
              >
                CRICKET
              </TabsTrigger>
              <TabsTrigger
                value="football"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg font-semibold"
              >
                FOOTBALL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cricket" className="space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {cricketFAQs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <AccordionTrigger className="px-6 py-5 text-left hover:no-underline font-semibold text-gray-800 hover:text-red-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="football">
              <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-md">
                <p className="text-lg">Football FAQs coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional FAQ Section */}
          <div className="mt-16">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {additionalFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`additional-${index}`}
                  className="bg-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline font-semibold text-gray-800 hover:text-red-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
