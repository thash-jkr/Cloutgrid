import React from "react";
import NavBar from "../common/navBar";

const styles = {
  container: {
    padding: "24px",
    fontFamily: "sans-serif",
    maxWidth: "800px",
    margin: "auto",
  },
  title: { fontSize: "32px", fontWeight: "bold", marginBottom: "16px" },
  subtitle: { fontStyle: "italic", marginBottom: "24px" },
  sectionHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    marginTop: "24px",
  },
  paragraph: { marginBottom: "16px", lineHeight: "1.6" },
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto flex items-start mt-20 lg:mt-28">
      <NavBar />
      <div
        className="w-full h-[85vh] flex flex-col mx-3 lg:mx-0 border rounded-2xl bg-white 
               shadow p-5 overflow-y-scroll"
      >
        <div>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.subtitle}>Last Updated: September 13, 2025</p>

          <p style={styles.paragraph}>
            Cloutgrid, developed and operated by Cloutivity Private Limited, is
            committed to protecting the privacy of all individuals who use our
            mobile application and web platform. This Privacy Policy explains
            how we collect, use, and safeguard personal data, as well as your
            rights in relation to this data. By accessing or using Cloutgrid,
            you consent to the practices described herein. This policy applies
            to all users, including Creator Users and Business Users.
          </p>
        </div>

        <div>
          <h2 style={styles.sectionHeader}>Platform Purpose</h2>
          <p style={styles.paragraph}>
            Cloutgrid is a digital platform for collaboration between Creator
            Users and Business Users. Creators use the platform to share their
            talents, portfolios, and content, while Businesses post
            collaboration opportunities, campaigns, and jobs. We are committed
            not only to protecting user data but also to ensuring respectful
            engagement, professional collaboration, and secure digital
            interactions across all touchpoints of the platform.
          </p>
        </div>

        <h2 style={styles.sectionHeader}>Data Collection</h2>
        <p style={styles.paragraph}>
          When registering for Cloutgrid, we collect personal information
          including your full name and email address. This information is
          required to create your account, verify your identity, enable
          communication, and provide account recovery services. Users may also
          upload profile photos, posts, and multimedia content, which may appear
          on their public profile. A unique identifier is assigned to each
          account for seamless access and personalization across the app.
          <br />
          <br />
          If you choose to connect your Instagram account, we will request
          access to certain data from your Instagram Business or Creator account
          through the Instagram Graph API. This may include your username,
          profile name, profile picture, follower count, media count, and
          insight-level analytics (such as engagement, reach, and impressions).
          All Instagram data is retrieved with your explicit consent and is used
          to display profile analytics, improve your visibility to business
          users, and personalize your experience. This data is stored securely
          and is never shared outside the platform. You may disconnect your
          Instagram account and request full deletion of this data at any time
          through the app or by contacting us.
        </p>

        <h2 style={styles.sectionHeader}>Usage Data</h2>
        <p style={styles.paragraph}>
          In addition to personal data, we collect non-identifiable technical
          information such as your device type, operating system version, screen
          dimensions, and usage behavior within the app (e.g., screen visits,
          interactions). This information helps us analyze app performance,
          troubleshoot issues, improve features, and ensure a smooth and secure
          user experience.
        </p>

        <h2 style={styles.sectionHeader}>User Content & Moderation</h2>
        <p style={styles.paragraph}>
          As a content-driven platform, Cloutgrid allows users to post media,
          text, and links. We enforce strict content moderation standards to
          ensure a safe and respectful environment. We do not tolerate nudity,
          sexually explicit material, hate speech, graphic violence, bullying,
          impersonation, harassment, or any other content that violates the
          safety or dignity of our users. Such content is subject to immediate
          removal and may result in permanent account suspension without
          warning.
          <br />
          <br />
          We use a combination of automated filters and manual review to
          identify and address violations. All users are encouraged to report
          content or behavior that they believe breaches our community
          standards. Our moderation team reviews such reports promptly. Repeated
          or severe violations will result in permanent removal from the
          platform, and in some cases, legal action may be pursued.
        </p>

        <h2 style={styles.sectionHeader}>Community Standards</h2>
        <p style={styles.paragraph}>
          Creator Users must only upload original or properly licensed content
          and engage with other users respectfully. Business Users must post
          authentic, lawful, and non-discriminatory opportunities and
          collaborations. Misrepresentation, fraud, or exploitative behavior is
          prohibited. All users are bound by our Community Guidelines and End
          User License Agreement (EULA), both of which are made available at
          registration and accessible in the app settings.
        </p>

        <h2 style={styles.sectionHeader}>Data Usage</h2>
        <p style={styles.paragraph}>
          All data collected through Cloutgrid is used solely to deliver core
          features, operate the app securely, personalize the user experience,
          and ensure proper moderation and community management. We do not sell
          your personal information or usage data to third parties for
          advertising or marketing purposes.
          <br />
          <br />
          If data is shared with trusted service providers—such as cloud storage
          platforms or analytics processors—it is done under strict
          confidentiality agreements and only for purposes necessary to maintain
          and operate the app. In the case of Instagram integration, data
          retrieved via the Instagram Graph API is used solely for account
          linking and insights display within Cloutgrid, and is never used for
          third-party analytics or advertising.
        </p>

        <h2 style={styles.sectionHeader}>Data Retention</h2>
        <p style={styles.paragraph}>
          We retain user data only for as long as necessary to fulfill our
          services or to comply with legal obligations. If you delete your
          account, your personal data, user content, and Instagram-linked data
          (if applicable) will be permanently removed from our servers unless
          retention is required by law. Users may request deletion of their data
          at any time through in-app settings or by contacting our support team
          at info@cloutgrid.com .
        </p>

        <h2 style={styles.sectionHeader}>Security</h2>
        <p style={styles.paragraph}>
          We apply industry-standard security protocols to protect your data
          from unauthorized access, loss, or misuse. This includes encryption,
          access control systems, secure hosting environments, and continuous
          monitoring. However, no system is immune to risk. We encourage users
          to use strong passwords and avoid sharing sensitive information in
          public posts.
        </p>

        <h2 style={styles.sectionHeader}>Children’s Privacy</h2>
        <p style={styles.paragraph}>
          Cloutgrid is a professional platform intended strictly for users aged
          13 and above, and is not designed for children or pre-teens. We do not
          knowingly collect or process personal data from children under 13, and
          we block access to registration for users below this age through a
          neutral age screen at sign-up.
          <br />
          <br />
          In compliance with international laws such as the Children’s Online
          Privacy Protection Act (COPPA), the EU General Data Protection
          Regulation for Children (GDPR-K), and the Google Play Families Policy,
          Cloutgrid takes a strong stance on child protection and data privacy.
          If we discover that a user under 13 has accessed the platform and
          submitted personal data without proper age verification or parental
          consent, we will immediately delete the account and purge all
          associated data.
          <br />
          <br />
          Cloutgrid does not contain content that is designed for or marketed to
          children. The platform avoids use of child-targeted visuals, games, or
          features. If any part of the app is ever accessed by a child—whether
          by error or supervision—we do not collect any personal identifiers and
          do not display personalized advertising. In the event ads are added in
          the future, we will ensure they come only from Google Play-certified
          ad networks, and will remain compliant with age-appropriateness and
          child privacy laws.
          <br />
          <br />
          All third-party APIs, SDKs, and tools integrated into
          Cloutgrid, including analytics services and social integrations—are
          reviewed for compliance with child privacy standards. If any expansion
          to child-accessible services is made in the future, Cloutgrid will
          update this policy and its platform accordingly to ensure continued
          legal compliance.
          <br />
          <br />
          If you are a parent or guardian and believe that your child has
          accessed Cloutgrid or submitted data in violation of this policy,
          please contact us immediately. We will take swift action to
          investigate and remove all associated data from our system.
        </p>

        <h2 style={styles.sectionHeader}>Your Rights</h2>
        <p style={styles.paragraph}>
          As a Cloutgrid user, you have the right to access, modify, delete, or
          request a copy of your personal data. You may also object to specific
          uses of your data or request disconnection of linked services like
          Instagram. These options are available via your in-app account
          settings, or by contacting us directly at info@cloutgrid.com .
        </p>

        <h2 style={styles.sectionHeader}>Policy Updates</h2>
        <p style={styles.paragraph}>
          We may revise this Privacy Policy as our features evolve or legal
          requirements change. If significant changes are made, we will inform
          you through email or in-app notification. Continued use of Cloutgrid
          after such updates implies your agreement with the revised policy.
        </p>

        <h2 style={styles.sectionHeader}>Contact Us</h2>
        <p style={styles.paragraph}>
          Cloutivity Private Limited
          <br />
          Email: <a href="mailto:info@cloutgrid.com">info@cloutgrid.com</a>
          <br />
          <br />
          By using Cloutgrid, you agree to the terms outlined in this Privacy
          Policy and acknowledge your responsibility to comply with platform
          rules and community standards. We thank you for helping us build a
          respectful, transparent, and secure creator-business ecosystem.
        </p>
      </div>
    </div>
  );
}
