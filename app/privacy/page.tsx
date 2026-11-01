import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Cookie, Award, Mail, ExternalLink, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Affiliate Disclosure | Tech Dadu",
  description:
    "Learn about how Tech Dadu handles user data, cookies, affiliate partnerships, and our commitment to transparency.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 1, 2026";

  return (
    <main className="py-12 sm:py-16 bg-theme-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Transparency & Trust</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-fg tracking-tight">
            Privacy Policy & Disclosure
          </h1>
          <p className="mt-3 text-sm sm:text-base text-theme-muted max-w-xl mx-auto">
            Your privacy is paramount to us. Here is how Tech Dadu collects, protects, and handles your data, alongside our affiliate relationships.
          </p>
          <p className="mt-2 text-xs text-theme-muted">
            Last Updated: <span className="font-medium text-theme-fg">{lastUpdated}</span>
          </p>
        </div>

        {/* Amazon Associates Highlight Box */}
        <div className="card-surface p-6 sm:p-8 rounded-2xl border-2 border-theme-primary/30 bg-theme-primary/5 mb-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-theme-primary text-white shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-theme-fg mb-2">
                Amazon Associates Program Disclosure
              </h2>
              <p className="text-sm text-theme-muted leading-relaxed mb-3">
                <strong className="text-theme-fg font-semibold">Tech Dadu</strong> is a participant in the <strong className="text-theme-fg font-semibold">Amazon Services LLC Associates Program</strong>, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.
              </p>
              <div className="p-3.5 rounded-xl bg-theme-surface border border-theme-border text-xs sm:text-sm font-medium text-theme-fg leading-relaxed">
                👉 <span className="italic">&ldquo;As an Amazon Associate, I earn from qualifying purchases.&rdquo;</span>
              </div>
              <p className="text-xs text-theme-muted mt-3">
                This means that if you click on an affiliate link and make a purchase, Tech Dadu may receive a small commission at <strong className="text-theme-fg">no additional cost to you</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Main Privacy Content */}
        <div className="space-y-10 text-theme-fg text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-theme-surface-hover text-theme-primary">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-theme-fg">1. Information We Collect</h2>
            </div>
            <p className="text-theme-muted mb-4">
              We collect information to provide better services, recommendations, and curated content to all our users. We collect data in the following ways:
            </p>
            <ul className="space-y-3 text-sm text-theme-muted">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-theme-fg font-medium">Voluntary Information:</strong> When you subscribe to our newsletter, register an account, or contact us, we collect your email address, name, and profile details.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-theme-fg font-medium">Device & Usage Analytics:</strong> We collect non-personally identifiable information such as your browser type, device type, operating system, and pages visited via aggregated analytics tools to optimize page performance.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-theme-fg font-medium">Outbound Click Events:</strong> When you click outbound affiliate or product links, anonymized click events are logged to measure popularity and fix broken store links.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-theme-surface-hover text-theme-primary">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-theme-fg">2. Cookies & Tracking Technologies</h2>
            </div>
            <p className="text-theme-muted mb-4">
              Cookies are small data files stored on your browser. Tech Dadu uses cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-theme-muted ml-2">
              <li>Remember your light/dark theme preference across sessions.</li>
              <li>Keep you signed in to your Tech Dadu account securely.</li>
              <li>Track affiliate referrals (when you click on a product recommendation link, an affiliate cookie is saved on your device by the retailer like Amazon to attribute eligible purchases).</li>
            </ul>
            <p className="text-xs text-theme-muted mt-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some portions of our service (such as staying logged in) may not function properly without cookies.
            </p>
          </section>

          {/* Section 3 */}
          <section className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-theme-surface-hover text-theme-primary">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-theme-fg">3. How We Use and Protect Your Data</h2>
            </div>
            <p className="text-theme-muted mb-3">
              We value your trust and will never sell, rent, or trade your personal email address or data with any third-party advertisers. We use your data exclusively to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-theme-muted ml-2 mb-4">
              <li>Deliver curated weekly tech newsletters and digital product releases you signed up for.</li>
              <li>Improve site responsiveness, search speed, and curated recommendations.</li>
              <li>Respond to direct support queries or product feedback.</li>
            </ul>
            <p className="text-xs text-theme-muted">
              We employ strict HTTPS encryption, salted password hashing, and industry-standard security protocols to keep your credentials secure.
            </p>
          </section>

          {/* Section 4 */}
          <section className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-theme-surface-hover text-theme-primary">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-theme-fg">4. Third-Party Links & Disclaimers</h2>
            </div>
            <p className="text-theme-muted text-sm leading-relaxed mb-3">
              Tech Dadu contains links to external e-commerce platforms (such as Amazon, Keychron, Epomaker, GitHub, Gumroad, etc.). Once you leave our domain via an outbound link, the third-party&apos;s privacy policy and terms govern your browsing experience. We encourage you to review their respective privacy practices.
            </p>
            <p className="text-xs text-theme-muted">
              Prices, product specs, and availability are subject to change by external merchants. We make every effort to display up-to-date information, but you should always verify final pricing directly on the retailer&apos;s store before purchasing.
            </p>
          </section>

          {/* Section 5 */}
          <section className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-theme-primary text-white">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-theme-fg">5. Contact Us & Data Requests</h2>
            </div>
            <p className="text-theme-muted text-sm leading-relaxed mb-4">
              If you have any questions regarding this Privacy Policy, wish to unsubscribe from our newsletter, or request permanent deletion of your account data, please reach out directly:
            </p>
            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div>
                <span className="block font-bold text-theme-fg">Tech Dadu Support</span>
                <span className="text-xs text-theme-muted">Email: support@techdadu.com</span>
              </div>
              <Link
                href="/about"
                className="btn-outline text-xs py-2 px-3 self-start sm:self-auto"
              >
                Learn More About Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

