import React from "react";

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
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>
      <p style={styles.subtitle}>Last Updated: May 28, 2025</p>

      <p style={styles.paragraph}>
        Cloutgrid, developed and operated by Cloutivity Private Limited, is
        committed to protecting the privacy of all individuals who use our
        mobile application and web platform. This Privacy Policy explains how we
        collect, use, and safeguard personal data, as well as your rights in
        relation to this data. By accessing or using Cloutgrid, you consent to
        the practices described herein. This policy applies to all users,
        including Creator Users and Business Users.
      </p>

      <h2 style={styles.sectionHeader}>Platform Purpose</h2>
      <p style={styles.paragraph}>
        Cloutgrid is a digital platform for collaboration between Creator Users
        and Business Users. Creators share their work and talents through
        content, while Businesses post collaboration opportunities, campaigns,
        and jobs. We are committed to protecting user data and enforcing
        standards for respectful engagement.
      </p>

      <h2 style={styles.sectionHeader}>Data Collection</h2>
      <p style={styles.paragraph}>
        When registering, we collect your name and email address for account
        creation, communication, and recovery. You may upload profile images,
        posts, or media that become part of your public profile. A unique ID is
        assigned to each account to ensure a seamless experience.
      </p>

      <h2 style={styles.sectionHeader}>Usage Data</h2>
      <p style={styles.paragraph}>
        We collect non-identifiable information such as device model, OS
        version, screen size, usage patterns, and general location (e.g.,
        city-level IP). This helps us enhance app performance and security.
      </p>

      <h2 style={styles.sectionHeader}>User Content & Moderation</h2>
      <p style={styles.paragraph}>
        Cloutgrid relies on user-generated content and enforces strict content
        standards to maintain a respectful and safe environment. We do not
        tolerate any content that includes nudity, sexually explicit material,
        hate speech, harassment, or graphic violence. Such violations will
        result in immediate and permanent account suspension. Our moderation
        process includes a combination of automated tools and manual review.
        Users are encouraged to report inappropriate content or behavior, which
        will be reviewed promptly. Repeated or severe violations will result in
        permanent removal from the platform.
      </p>

      <h2 style={styles.sectionHeader}>Community Standards</h2>
      <p style={styles.paragraph}>
        Creators must upload only original or licensed content and behave
        respectfully. Businesses must post only legitimate, non-discriminatory
        opportunities. All users must follow the Community Guidelines and EULA.
      </p>

      <h2 style={styles.sectionHeader}>Data Usage</h2>
      <p style={styles.paragraph}>
        Personal data is used to manage accounts, deliver services, enable
        communication, and ensure platform safety. We do not use personal data
        for targeted ads or sell it to third parties. If shared with providers
        (e.g., cloud, analytics), it is solely for platform functionality under
        strict agreements.
      </p>

      <h2 style={styles.sectionHeader}>Data Retention</h2>
      <p style={styles.paragraph}>
        We retain data only as long as necessary to provide services or fulfill
        legal obligations. You can delete your account via settings or by
        contacting us. Data is permanently deleted unless legally required.
      </p>

      <h2 style={styles.sectionHeader}>Security</h2>
      <p style={styles.paragraph}>
        We implement encryption, access controls, and secure environments.
        Still, no system is 100% secure. Use strong passwords and be mindful of
        public information.
      </p>

      <h2 style={styles.sectionHeader}>Children’s Privacy</h2>
      <p style={styles.paragraph}>
        Cloutgrid is not intended for children under 13. If you believe a child
        has submitted personal data, please contact us and we will remove it.
      </p>

      <h2 style={styles.sectionHeader}>Your Rights</h2>
      <p style={styles.paragraph}>
        You may view, update, delete your data, or request a copy. You may also
        object to inappropriate data use. Contact us to exercise your rights.
      </p>

      <h2 style={styles.sectionHeader}>Policy Updates</h2>
      <p style={styles.paragraph}>
        We may update this Privacy Policy. Significant changes will be
        communicated via in-app or email. Continued use after updates indicates
        acceptance.
      </p>

      <h2 style={styles.sectionHeader}>Contact Us</h2>
      <p style={styles.paragraph}>
        Cloutivity Private Limited
        <br />
        Email: <a href="mailto:info@cloutgrid.com">info@cloutgrid.com</a>
        <br />
        <br />
        By using Cloutgrid, you agree to this Privacy Policy. Thank you for
        supporting a safe and creative community.
      </p>
    </div>
  );
}
