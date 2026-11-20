import { Link } from "react-router-dom"
import LegalPage from "../components/common/LegalPage"
import { APP_NAME, CONTACT_EMAIL } from "../constants"
import { usePageTitle } from "../hooks/usePageTitle"

export default function PrivacyPolicy() {
  usePageTitle("Privacy Policy")

  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what information ${APP_NAME} collects, how we use it, and the choices you have. By using ${APP_NAME}, you agree to the practices described here.`}
    >
      <h2>1. Information we collect</h2>
      <h3>Account information</h3>
      <p>
        When you register, we collect your name, email address and password. We use these to create
        your account, sign you in and greet you in the app.
      </p>
      <h3>Resume content</h3>
      <p>
        The resumes you create or import, including contact details, work experience, education,
        skills and projects. Your resume may contain personal information such as your phone number
        and location; only include what you are comfortable sharing.
      </p>
      <h3>Job descriptions and analyses</h3>
      <p>
        When you run an analysis, we process the job description you paste in together with your
        resume. We store the result (match score, strengths, missing keywords and suggestions) so
        you can see your recent analyses.
      </p>
      <h3>Imported files</h3>
      <p>
        If you import a PDF, DOCX or Markdown file, we process it to extract your resume details and
        fill in the builder. Nothing extracted from the file is saved to your account until you
        choose to save the resume.
      </p>
      <h3>Information stored in your browser</h3>
      <p>
        {APP_NAME} uses your browser&apos;s local storage, not advertising cookies, to keep you
        signed in and remember your preferences:
      </p>
      <ul>
        <li>your sign-in token and basic profile (name and email);</li>
        <li>your theme (light or dark) and whether the sidebar is collapsed;</li>
        <li>
          drafts of unsaved resume changes, kept if your session expires while you are editing.
          Drafts are deleted after 30 days and never leave your device unless you save them.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>to provide the service: storing your resumes, running analyses and creating PDFs;</li>
        <li>to keep your account secure and prevent abuse;</li>
        <li>to fix problems and improve the product;</li>
        <li>to contact you about your account or important changes to these terms.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for advertising.</p>

      <h2>3. AI processing</h2>
      <p>
        Analyses and file imports are performed by an AI model. To produce a result, the relevant
        resume content, job description or file is sent to that model, which may be operated by a
        third-party provider acting on our behalf. We only send what is needed for the request.
      </p>
      <p>
        AI output can be incomplete or inaccurate. Review every suggestion and extracted detail
        before relying on it.
      </p>

      <h2>4. Sharing</h2>
      <p>We share information only with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> who host our infrastructure or provide AI processing,
          under obligations to protect it and use it only to provide their services to us;
        </li>
        <li>
          <strong>Authorities</strong>, when we are required to by law or need to protect the
          rights, safety or property of our users or others.
        </li>
      </ul>

      <h2>5. Data retention</h2>
      <p>
        We keep your account, resumes and analyses for as long as your account is active. When you
        delete a resume, it is removed from your account. If you ask us to delete your account, we
        delete your personal information unless we must keep it to meet a legal obligation.
      </p>

      <h2>6. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect your information. No
        method of transmission or storage is completely secure, so we cannot guarantee absolute
        security.
      </p>

      <h2>7. Your rights and choices</h2>
      <ul>
        <li>view, edit and delete your resumes at any time from your dashboard;</li>
        <li>
          remove what is stored in your browser: logging out removes your sign-in token and profile,
          and clearing this site&apos;s data in your browser settings removes everything;
        </li>
        <li>
          request a copy of your information, its correction, or the deletion of your account by
          contacting us.
        </li>
      </ul>
      <p>
        Depending on where you live, you may have additional rights under local data protection law.
        We will respond to requests within the time those laws require.
      </p>

      <h2>8. Children</h2>
      <p>
        {APP_NAME} is not intended for anyone under 16. We do not knowingly collect information from
        children. If you believe a child has given us information, contact us and we will delete it.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we make significant changes, we will
        update the date at the top of this page and, where appropriate, notify you in the app.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this policy or your data? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
        <Link to="/terms-and-conditions">Terms and Conditions</Link>.
      </p>
    </LegalPage>
  )
}
