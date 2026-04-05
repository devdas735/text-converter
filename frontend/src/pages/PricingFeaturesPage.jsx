import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    blurb: 'For personal testing and quick experiments.',
    features: ['Basic voice options', 'Limited monthly conversions', 'Standard support']
  },
  {
    name: 'Pro',
    price: '$29',
    blurb: 'For creators and growing teams shipping audio content.',
    features: ['Premium voices', 'Higher conversion limits', 'History + re-generation', 'Priority support'],
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'For organizations with scale, compliance, and SLA needs.',
    features: ['Dedicated infrastructure', 'Advanced security controls', 'Custom integrations', 'Account manager']
  }
];

export default function PricingFeaturesPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Pricing & Features</h1>
        <p className="max-w-2xl text-slate-300">
          Choose a plan that matches your usage and workflow complexity.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.featured ? 'border-brand-400/50 bg-brand-500/10' : ''}
            title={plan.name}
            subtitle={plan.blurb}
          >
            <p className="text-2xl font-semibold text-white">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button className="mt-5 w-full" variant={plan.featured ? 'primary' : 'secondary'}>
              {plan.featured ? 'Start Pro Trial' : 'Choose Plan'}
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
