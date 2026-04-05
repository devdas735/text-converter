import Button from '../components/common/Button.jsx';
import InputField from '../components/common/InputField.jsx';
import Textarea from '../components/common/Textarea.jsx';

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Contact Us</h1>
        <p className="max-w-2xl text-slate-300">
          Need help with setup, enterprise pricing, or API integration? Send us a message.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <form className="space-y-4 rounded-xl border border-white/10 bg-slate-900/80 p-5">
          <InputField label="Full name" placeholder="Jane Doe" />
          <InputField label="Work email" type="email" placeholder="jane@company.com" />
          <InputField label="Company" placeholder="Your organization" />
          <Textarea label="How can we help?" placeholder="Tell us about your use case..." />
          <Button type="submit">Send Message</Button>
        </form>

        <aside className="rounded-xl border border-white/10 bg-slate-900/80 p-5">
          <h2 className="text-lg font-semibold text-white">Support Channels</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• support@textconverterpro.ai</li>
            <li>• sales@textconverterpro.ai</li>
            <li>• +1 (800) 555-0199</li>
            <li>• Mon–Fri, 9AM–6PM UTC</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
