import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For small communities up to 100 homes.",
    features: [
      "Up to 100 homes",
      "Endorsement-based reporting",
      "AI content moderation",
      "Board dashboard",
      "Status tracking",
      "Email notifications",
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Standard",
    price: "$59",
    description: "For growing communities up to 250 homes.",
    features: [
      "Up to 250 homes",
      "Everything in Starter",
      "Advanced analytics",
      "Duplicate report merging",
      "Resident management dashboard",
      "Custom branding",
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Premium",
    price: "$99",
    description: "For larger communities up to 500 homes.",
    features: [
      "Up to 500 homes",
      "Everything in Standard",
      "Multi-admin access (up to 5)",
      "Data export (CSV)",
      "Priority support",
      "API access",
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale communities with 500+ homes.",
    features: [
      "500+ homes",
      "Everything in Premium",
      "Unlimited admins",
      "Dedicated onboarding support",
      "SSO",
    ],
    cta: "Contact Us",
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            Choose Your Plan
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Select a plan based on the number of homes in your community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}