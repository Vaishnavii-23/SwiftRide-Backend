import { useState } from "react";
import { Mail as MailIcon, MapPin as MapPinIcon, MessageSquare as MessageSquareIcon, Phone as PhoneIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const contactInfo = [
  {
    icon: MailIcon,
    label: "Email",
    value: "hello@swiftride.app",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "1-800-SAFE-RIDE",
  },
  {
    icon: MapPinIcon,
    label: "Office",
    value: "240 Market Street, San Francisco, CA",
  },
];

const faqs = [
  {
    question: "How does the safety scoring work?",
    answer:
      "Routes are scored 0–100 based on street lighting, historical incident data, traffic patterns, and community reports. Scores update in real time as conditions change.",
  },
  {
    question: "Can I share my trip with someone?",
    answer:
      "Yes. Before confirming a ride, you can add up to five trusted contacts who will receive a live tracking link — no account required on their end.",
  },
  {
    question: "Is SwiftRide available in my city?",
    answer:
      "We currently operate across 12 metropolitan areas and are expanding rapidly. Check the app for live availability in your area.",
  },
  {
    question: "How do I report an unsafe area?",
    answer:
      "Tap the flag icon on any route in the app to submit a community report. Our team verifies reports and feeds them into the safety engine within minutes.",
  },
];

export const ContactPage = (): JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div>
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="[font-family:'Nunito_Sans',Helvetica] text-sm font-bold uppercase tracking-[0.70px] text-[#8a7440]">
            GET IN TOUCH
          </p>
          <h1 className="mt-3 [font-family:'Literata',Helvetica] text-4xl font-normal leading-tight text-[#2e3230] sm:text-5xl">
            We'd love to hear from you.
          </h1>
          <p className="mt-5 [font-family:'Nunito_Sans',Helvetica] text-lg font-normal leading-[1.65] text-[#5d625d]">
            Questions, feedback, or partnership ideas? Reach out and our team
            will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-4">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <Card
                  key={info.label}
                  className="rounded-2xl border-[#e4e0d8] bg-[#f0ece4] shadow-[0px_4px_20px_#2e32300f]"
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4a7c59]/10">
                      <Icon className="h-6 w-6 text-[#4a7c59]" />
                    </div>
                    <div>
                      <p className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]">
                        {info.label}
                      </p>
                      <p className="mt-1 [font-family:'Literata',Helvetica] text-lg font-normal text-[#2e3230]">
                        {info.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="rounded-2xl border-[#e4e0d8] bg-white shadow-[0px_4px_20px_#2e32300f]">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4a7c59]/10">
                    <MessageSquareIcon className="h-8 w-8 text-[#4a7c59]" />
                  </div>
                  <h3 className="mt-6 [font-family:'Literata',Helvetica] text-2xl font-normal text-[#2e3230]">
                    Message Sent
                  </h3>
                  <p className="mt-3 max-w-sm [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
                    Thanks, {name}. We've received your message and will reply
                    to {email} within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    variant="outline"
                    className="mt-6 rounded-3xl border-[#d6d1c8] px-6 py-3 text-sm font-bold text-[#4a7c59] hover:bg-[#f4efe8]"
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h2 className="[font-family:'Literata',Helvetica] text-xl font-normal leading-7 text-[#2e3230]">
                    Send us a message
                  </h2>
                  <div>
                    <label
                      htmlFor="name"
                      className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-2 h-11 w-full rounded-xl border border-[#d6d1c8] bg-[#faf6f0] px-3 [font-family:'Nunito_Sans',Helvetica] text-sm text-[#2e3230] outline-none focus:border-[#4a7c59] placeholder:text-[#8b8f8a]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 h-11 w-full rounded-xl border border-[#d6d1c8] bg-[#faf6f0] px-3 [font-family:'Nunito_Sans',Helvetica] text-sm text-[#2e3230] outline-none focus:border-[#4a7c59] placeholder:text-[#8b8f8a]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="[font-family:'Nunito_Sans',Helvetica] text-xs font-bold uppercase tracking-wider text-[#8a7440]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-[#d6d1c8] bg-[#faf6f0] px-3 py-3 [font-family:'Nunito_Sans',Helvetica] text-sm text-[#2e3230] outline-none focus:border-[#4a7c59] placeholder:text-[#8b8f8a]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!name || !email || !message}
                    className="h-auto rounded-3xl bg-[#4a7c59] py-4 [font-family:'Nunito_Sans',Helvetica] text-base font-bold leading-6 text-white shadow-[0px_4px_20px_#2e32300f] hover:bg-[#426f50] disabled:opacity-50"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-[#f4efe8]">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="[font-family:'Literata',Helvetica] text-3xl font-normal leading-9 text-[#2e3230]">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
              Quick answers to the questions we hear most.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.question}
                className="rounded-2xl border-[#e4e0d8] bg-white shadow-[0px_2px_10px_#2e32300a]"
              >
                <CardContent className="p-6">
                  <h3 className="[font-family:'Nunito_Sans',Helvetica] text-base font-bold text-[#2e3230]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 [font-family:'Nunito_Sans',Helvetica] text-sm font-normal leading-6 text-[#5d625d]">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
