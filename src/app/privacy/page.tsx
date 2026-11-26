import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Hanurya",
  description:
    "Learn how Hanurya handles account, order, and browsing information when you shop with us.",
};

const sections = [
  { id: "information", title: "Information we collect" },
  { id: "use", title: "How we use it" },
  { id: "payments", title: "Payments" },
  { id: "storage", title: "Browser storage and analytics" },
  { id: "sharing", title: "When information is shared" },
  { id: "security", title: "Data security and retention" },
  { id: "choices", title: "Your choices and requests" },
  { id: "children", title: "Children’s privacy" },
  { id: "third-parties", title: "Third-party links and policy updates" },
  { id: "contact", title: "Contact us" },
];

const takeaways = [
  {
    label: "Your account",
    detail: "We use the details you provide to create and secure your account.",
  },
  {
    label: "Your orders",
    detail: "Checkout details help us prepare and follow up on your order.",
  },
  {
    label: "UPI payments",
    detail: "Payments happen in your UPI app or bank—not through a card form here.",
  },
  {
    label: "Your choices",
    detail: "Contact us if you would like to ask about or update your information.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-primary px-5 pb-20 pt-14 text-text-main sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl border-b border-accent/30 pb-10 sm:pb-14">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Your privacy
          </p>
          <h1 className="max-w-2xl text-5xl font-medium leading-[0.98] tracking-[-0.035em] text-dark sm:text-6xl md:text-7xl">
            Privacy, handled with care.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
            A clear note on the information Hanurya uses to help you browse,
            create an account, and place an order.
          </p>
          <p className="mt-5 text-sm text-text-muted">
            Last updated: 26 November 2026
          </p>
        </header>

        <section
          aria-labelledby="at-a-glance"
          className="mt-9 border border-accent/35 bg-cream/55 px-5 py-6 sm:px-8 sm:py-8"
        >
          <div className="flex flex-col gap-2 border-b border-accent/25 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="at-a-glance"
              className="text-3xl font-medium leading-none text-dark"
            >
              At a glance
            </h2>
            <p className="text-sm text-text-muted">
              The essentials, before the details.
            </p>
          </div>
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {takeaways.map((item, index) => (
              <div key={item.label} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 font-serif text-lg text-accent"
                >
                  0{index + 1}
                </span>
                <div>
                  <dt className="font-medium text-dark">{item.label}</dt>
                  <dd className="mt-1 text-sm leading-6 text-text-muted">
                    {item.detail}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
          <nav
            aria-label="Privacy policy contents"
            className="h-fit border-l border-accent/35 pl-5 lg:sticky lg:top-10"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              On this page
            </p>
            <ol className="space-y-3">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    className="group flex gap-2 text-sm leading-5 text-text-muted transition-colors hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    href={`#${section.id}`}
                  >
                    <span className="text-accent/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl divide-y divide-accent/20">
            <section
              id="information"
              aria-labelledby="information-title"
              className="scroll-mt-8 pb-9"
            >
              <h2
                id="information-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                01. Information we collect
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                When you register, we collect your name, email address, and
                password. Passwords are stored as bcrypt hashes rather than
                plain text. When you check out, we collect the name, phone
                number, and delivery address you provide, along with the items
                ordered, order total, and order status. A payment reference may
                also be provided for manual payment review.
              </p>
              <p className="mt-4 leading-7 text-text-muted">
                If you shop without signing in, cart and wishlist information
                may be kept in your browser. For signed-in customers, cart and
                wishlist details can sync with the account.
              </p>
            </section>

            <section
              id="use"
              aria-labelledby="use-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="use-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                02. How we use it
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                We use account details to provide account access, and checkout
                details to prepare, deliver, and manage your orders. Cart and
                wishlist information helps keep track of the products you have
                selected. We may use the contact details attached to an order
                to follow up about that order or a support request.
              </p>
            </section>

            <section
              id="payments"
              aria-labelledby="payments-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="payments-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                03. Payments
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                Hanurya checkout provides a UPI QR code or payment link for you
                to use with your chosen UPI app or bank. Your payment is handled
                through that app or bank. Hanurya does not ask you to enter card
                details on the site or receive your UPI PIN. Where a payment
                reference is submitted, it may be used to review and confirm the
                order payment.
              </p>
            </section>

            <section
              id="storage"
              aria-labelledby="storage-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="storage-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                04. Browser storage and analytics
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                The site stores an authentication token in your browser’s local
                storage and may use browser storage for guest cart and wishlist
                information. Clearing browser storage can remove those saved
                guest selections or sign you out.
              </p>
              <p className="mt-4 leading-7 text-text-muted">
                Hanurya uses Vercel Analytics and Speed Insights to understand
                site usage and performance. Product images are hosted using
                Cloudinary. These services may process information as needed
                to provide their respective features.
              </p>
            </section>

            <section
              id="sharing"
              aria-labelledby="sharing-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="sharing-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                05. When information is shared
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                Information may be handled by service providers that support
                store operations, such as site analytics and image hosting, or
                by the UPI app or bank you choose to complete a payment. We
                limit use of information to what is needed for the service or
                transaction. Information may also need to be retained or
                disclosed to address a dispute or meet legal or accounting
                obligations.
              </p>
            </section>

            <section
              id="security"
              aria-labelledby="security-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="security-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                06. Data security and retention
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                We use safeguards intended to protect information, including
                storing account passwords as bcrypt hashes. No online service
                can be made entirely risk-free, so please keep your login
                details private and contact us if you have a concern.
              </p>
              <p className="mt-4 leading-7 text-text-muted">
                We keep information for as long as it is needed to provide the
                service, resolve disputes, and meet legal or accounting
                obligations. The time needed can vary depending on the
                information and circumstances.
              </p>
            </section>

            <section
              id="choices"
              aria-labelledby="choices-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="choices-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                07. Your choices and requests
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                You can manage guest cart and wishlist details through your
                browser and sign out of your account. You may contact us to ask
                about, correct, or request deletion of personal information
                associated with you. We may need to keep some information where
                it is required to complete an order, address a dispute, or
                comply with legal or accounting obligations.
              </p>
            </section>

            <section
              id="children"
              aria-labelledby="children-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="children-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                08. Children’s privacy
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                If you believe a child has provided personal information
                through the site, please contact us so we can review the
                request.
              </p>
            </section>

            <section
              id="third-parties"
              aria-labelledby="third-parties-title"
              className="scroll-mt-8 py-9"
            >
              <h2
                id="third-parties-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                09. Third-party links and policy updates
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                The site may link to services or websites that are not operated
                by Hanurya. Their privacy practices are governed by their own
                policies. We may update this notice as the site or its
                practices change; the date at the top indicates when it was
                last updated.
              </p>
            </section>

            <section
              id="contact"
              aria-labelledby="contact-title"
              className="scroll-mt-8 pt-9"
            >
              <h2
                id="contact-title"
                className="text-3xl font-medium text-dark sm:text-4xl"
              >
                10. Contact us
              </h2>
              <p className="mt-4 leading-7 text-text-muted">
                Questions or requests about privacy? Reach Hanurya using the
                details below.
              </p>
              <address className="mt-5 not-italic leading-7 text-dark">
                <a
                  className="underline decoration-accent/60 underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href="mailto:hanuryadecor@gmail.com"
                >
                  hanuryadecor@gmail.com
                </a>
                <br />
                <a
                  className="underline decoration-accent/60 underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href="tel:+917574862119"
                >
                  +91 7574862119
                </a>
              </address>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Visit our contact page
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
