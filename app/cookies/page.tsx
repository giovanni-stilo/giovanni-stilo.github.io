import { PageShell } from "@/components/site/page-shell";
import { CookiePreferencesButton } from "@/components/site/statistics-consent";
import { pageMetadata } from "@/lib/seo";
import { CONSENT_KEY } from "@/lib/statistics-consent";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Cookies and statistics",
  description: "Information about optional visit statistics and how to accept, refuse or withdraw consent on Giovanni Stilo’s website.",
  path: "/cookies/",
});

export default function CookiesPage() {
  return (
    <PageShell title="Cookies and statistics">
      <p>This notice explains optional visit statistics and the browser storage used to remember your choice on giovannistilo.eu.</p>

      <h2>Your choice</h2>
      <p>
        Statistics are off until you select <strong>Accept statistics</strong>.
        Selecting <strong>Reject</strong> leaves them off. You can use the website either way.
        Scrolling or following a link does not give consent.
      </p>
      <p>
        Use <strong>Cookie preferences</strong> in the footer at any time to review or change your choice.
        Withdrawing consent stops subsequent measurement and removes the accessible statistics cookies set by this site.
        The page reloads to stop the previously loaded measurement code.
        Withdrawal does not automatically delete data already sent or affect the lawfulness of earlier processing based on consent.
      </p>
      <CookiePreferencesButton />

      <h2>Who is responsible</h2>
      <p>
        The controller for these website statistics is {site.author}, owner of this personal academic website.
        For questions or privacy requests, email <a href="mailto:gstilo@luiss.it">gstilo@luiss.it</a>.
      </p>

      <h2>Optional visit statistics</h2>
      <p>
        With your consent, the website uses <strong>Google Analytics 4, provided by Google</strong>,
        to understand visits and improve the website. The legal basis for this optional processing is your consent
        under Article 6(1)(a) of the GDPR. Providing it is voluntary.
      </p>
      <p>
        Measurement can include pages visited, visit times, referral information, browser and device information,
        approximate location and cookie identifiers. A connection to Google also communicates technical information,
        including your IP address. These statistics should not be described as anonymous.
        This website’s tag disables Google signals and advertising-personalisation signals, and does not grant advertising-storage consent.
      </p>

      <h2>Storage and retention</h2>
      <div className="table-wrap cookie-storage-table" tabIndex={0} role="region" aria-label="Cookie storage details">
        <table>
          <caption>Storage used for this preference and optional statistics</caption>
          <thead><tr><th scope="col">Item</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
          <tbody>
            <tr>
              <th scope="row"><code>{CONSENT_KEY}</code></th>
              <td>Essential browser local storage remembering acceptance or refusal, the notice version and expiry. It is not a visitor identifier and is not sent to Google.</td>
              <td>Valid for six months, unless you change or clear it sooner.</td>
            </tr>
            <tr>
              <th scope="row"><code>_ga</code></th>
              <td>Optional first-party cookie used by Google Analytics to distinguish browsers.</td>
              <td>The tag limits its lifetime to the remaining consent period, up to six months. Browser limits may shorten this.</td>
            </tr>
            <tr>
              <th scope="row"><code>_ga_{site.gaId.replace("G-", "")}</code></th>
              <td>Optional first-party cookie used by Google Analytics to maintain session information.</td>
              <td>The same limit applies: no later than the current consent expiry.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Google Analytics user-level and event-level data retention is set to <strong>14 months</strong>.
        This account setting is separate from the browser-cookie lifetime
        and does not apply in the same way to standard aggregated reports.
        See <a href="https://support.google.com/analytics/answer/7667196">Google’s explanation of data retention</a>.
      </p>
      <p>
        The website checks the preference’s expiry and asks again after six months.
        Clearing browser storage can make the banner appear sooner.
        If your choice cannot be read or saved, statistics remain off.
      </p>

      <h2>Google and international processing</h2>
      <p>
        If you accept, statistics are sent to Google for processing and are available to the website owner through Analytics reports.
        Google may process information outside the European Economic Area, including in the United States.
        Its notices explain the applicable entities, processing and international-transfer safeguards:
        {" "}<a href="https://policies.google.com/technologies/partner-sites">How Google uses information from partner sites</a>
        {" "}and <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.
      </p>

      <h2>Your rights</h2>
      <p>
        You may withdraw consent at any time. Where applicable under the GDPR, you may also request access,
        rectification, erasure, restriction, portability or object to processing by contacting the email address above.
        You may lodge a complaint with the <a href="https://www.garanteprivacy.it/">Italian Data Protection Authority</a>
        or another competent supervisory authority.
      </p>
      <p className="page-updated">Updated 1 November 2026.</p>
    </PageShell>
  );
}
