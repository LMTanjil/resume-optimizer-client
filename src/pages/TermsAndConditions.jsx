import { Link } from "react-router-dom"
import LegalPage from "../components/common/LegalPage"
import { APP_NAME, CONTACT_EMAIL } from "../constants"
import { usePageTitle } from "../hooks/usePageTitle"

export default function TermsAndConditions() {
  usePageTitle("Terms and Conditions")

  return (
    <LegalPage
      title="Terms and Conditions"
      intro={`These terms govern your use of ${APP_NAME}. By creating an account or using the service, you agree to them. If you do not agree, do not use ${APP_NAME}.`}
    >
      <h2>1. The service</h2>
      <p>
        {APP_NAME} lets you build resumes, import existing resumes from files, analyze them against
        job descriptions with AI, and export them as PDFs. We may add, change or remove features
        over time.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 16 years old, and able to form a binding agreement where you live, to
        use {APP_NAME}.
      </p>

      <h2>3. Your account</h2>
      <ul>
        <li>Provide accurate information when you register and keep it up to date.</li>
        <li>Keep your password confidential. You are responsible for activity on your account.</li>
        <li>Tell us promptly if you suspect unauthorized access to your account.</li>
      </ul>

      <h2>4. Your content</h2>
      <p>
        You keep ownership of the resumes, files and job descriptions you add (&ldquo;your
        content&rdquo;). You give us a limited license to store, process and display your content
        only as needed to provide the service to you, including sending it to AI providers for
        analysis and import.
      </p>
      <p>
        You are responsible for your content and confirm that you have the right to use it. Do not
        upload content that belongs to someone else without permission.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use {APP_NAME} for anything unlawful, fraudulent or misleading;</li>
        <li>
          upload malware or content that is abusive, hateful or infringes others&apos; rights;
        </li>
        <li>
          attempt to access other users&apos; data, probe or disrupt our systems, or bypass security
          or rate limits;
        </li>
        <li>scrape, resell or automate access to the service without our written permission.</li>
      </ul>

      <h2>6. AI-generated output</h2>
      <p>
        Match scores, suggestions and imported details are produced automatically and may be
        incomplete or inaccurate. They are guidance, not professional career or legal advice. You
        are responsible for reviewing your resume before using it. We do not guarantee any
        interview, job offer or other outcome.
      </p>

      <h2>7. Fees</h2>
      <p>
        {APP_NAME} is currently free to use. If we introduce paid features, we will tell you in
        advance and you will not be charged without your agreement.
      </p>

      <h2>8. Availability</h2>
      <p>
        We work to keep {APP_NAME} available and reliable, but the service is provided without a
        guarantee of uptime. We may suspend it for maintenance or for reasons outside our control.
        Keep your own copies of important documents, for example by exporting PDFs.
      </p>

      <h2>9. Suspension and termination</h2>
      <p>
        You may stop using {APP_NAME} at any time and ask us to delete your account. We may suspend
        or close accounts that break these terms or put the service or other users at risk.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        To the extent permitted by law, {APP_NAME} is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo;, without warranties of any kind, whether express or implied, including
        fitness for a particular purpose and non-infringement.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for any indirect, incidental, special or
        consequential damages, or for loss of data, opportunities or profits, arising from your use
        of {APP_NAME}. Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Our <Link to="/privacy-policy">Privacy Policy</Link> explains how we collect and use your
        information.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms. When we make significant changes, we will update the date at the
        top of this page and, where appropriate, notify you in the app. Continuing to use {APP_NAME}{" "}
        after changes take effect means you accept the updated terms.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
