import { Shield, Clock, DollarSign, Headphones, Award, MapPin } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Trusted & Reliable",
    description: "All our vehicles are regularly maintained and insured for your safety and peace of mind.",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Transparent pricing with no hidden fees. Get the best value for your money.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you whenever you need help.",
  },
  {
    icon: Award,
    title: "Premium Fleet",
    description: "Modern, well-maintained vehicles from trusted brands for a comfortable journey.",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "Serving major cities and towns across Kenya with convenient pickup locations.",
  },
  {
    icon: Headphones,
    title: "Expert Service",
    description: "Professional team with years of experience in the car rental industry.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-red-600">MileMaven</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional car rental services that exceed your expectations every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
