/**
 * FAQ content — rewritten from the previous site's six questions (its richest
 * indexed text; themes preserved deliberately for SEO continuity).
 * Rendered as native <details> accordions + FAQPage JSON-LD.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "What makes Stocklore different from other inventory software?",
    answer:
      "Most tools at our price point stop at single-level kits — Stocklore does real manufacturing: multi-level bills of materials, nested build orders, and automatic component consumption, alongside ledger-backed inventory, purchasing, and CRA-ready invoicing. And it's self-serve: no sales calls, no implementation projects, no per-module upsells. You can be working with your own data the same hour you sign up.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Stocklore is in open beta and completely free right now. When we launch paid plans, pricing will be transparent and set for small businesses — we'll announce it before the beta ends. In return, we just ask beta users to tell us about bugs and what they'd like built next.",
  },
  {
    question: "How do I get started?",
    answer:
      "Click Get started, create a free account, and you're in. You can seed a demo company with realistic data to explore, or import your own products and contacts from CSV or Excel and start invoicing right away.",
  },
  {
    question: "Does Stocklore work on mobile?",
    answer:
      "Stocklore runs in any modern browser. The app is optimized for desktop and laptop screens today — that's where inventory work mostly happens — and a dedicated mobile experience is on the roadmap.",
  },
  {
    question: "How is my data handled? What about privacy?",
    answer:
      "We collect your email address to create your account and a cookie to keep you signed in — that's it. We don't sell data to third parties, and your business data belongs to you. Stocklore is built and operated by a Canadian team.",
  },
  {
    question: "Can I follow development or request features?",
    answer:
      "Yes — we build in the open. The roadmap page shows what we've shipped, what we're building now, and what's next. If something you need is missing, tell us at support@stocklore.app; beta feedback genuinely steers the roadmap.",
  },
];

export const faqJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});
