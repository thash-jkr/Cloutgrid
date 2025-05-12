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
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "32px",
    marginBottom: "12px",
  },
  subHeader: { fontWeight: "bold", marginTop: "16px", marginBottom: "8px" },
  paragraph: { marginBottom: "16px", lineHeight: "1.6" },
};

export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>
      <p style={styles.subtitle}>Last updated: May 09, 2025</p>

      <p style={styles.paragraph}>
        This Privacy Policy describes our policies and procedures on the
        collection, use, and disclosure of your information when you use the
        Cloutgrid app (“the Service”) and tells you about your privacy rights
        and how the law protects you. By using the Service, you agree to the
        collection and use of information in accordance with this Privacy
        Policy.
      </p>

      <h2 style={styles.sectionHeader}>Summary of Data Collection</h2>
      <p style={styles.paragraph}>
        Cloutgrid collects the following data types, which are linked to your
        identity and used solely for the app’s functionality:
        <br />– Name – used for your profile and display to other users
        <br />– Email address – used for account login, communication, and
        account recovery
        <br />– Photos or videos – used for posting content and customizing your
        profile
        <br />– User ID – used to identify your account and provide personalized
        functionality
        <br />
        <br />
        We do not use your data for tracking, targeted advertising, or data
        brokering.
      </p>

      <h2 style={styles.sectionHeader}>Interpretation and Definitions</h2>
      <p style={styles.paragraph}>
        <strong>Application</strong> refers to Cloutgrid, the software
        application provided by CLOUTIVITY PRIVATE LIMITED.
        <br />
        <strong>Company</strong> refers to CLOUTIVITY PRIVATE LIMITED, Kerala, India.
        <br />
        <strong>Personal Data</strong> means information relating to an
        identified or identifiable individual.
        <br />
        <strong>Service</strong> refers to the Application.
        <br />
        <strong>You</strong> means the individual accessing or using the
        Service.
      </p>

      <h2 style={styles.sectionHeader}>Types of Data Collected</h2>
      <p style={styles.subHeader}>Personal Data</p>
      <p style={styles.paragraph}>
        The following personal data is collected and linked to your identity:
        <br />– Name
        <br />– Email address
        <br />– Photos or videos you upload
        <br />– User ID or account identifier
      </p>

      <p style={styles.subHeader}>Usage Data</p>
      <p style={styles.paragraph}>
        Usage data may include information such as device type, operating
        system, screen size, and app usage metrics. This helps us improve the
        performance and security of the Service.
      </p>

      <h2 style={styles.sectionHeader}>Use of Your Personal Data</h2>
      <p style={styles.paragraph}>
        We use the data we collect to provide and maintain the Service, manage
        your account, enable features like profile creation and content posting,
        respond to support needs, and improve app performance.
      </p>

      <h2 style={styles.sectionHeader}>Sharing Your Personal Data</h2>
      <p style={styles.paragraph}>
        We may share your data with trusted service providers, during business
        transfers, or when legally required. Your data will never be sold for
        advertising or marketing purposes.
      </p>

      <h2 style={styles.sectionHeader}>Data Retention</h2>
      <p style={styles.paragraph}>
        Your data is retained only for as long as necessary to provide our
        services or comply with legal requirements.
      </p>

      <h2 style={styles.sectionHeader}>Security</h2>
      <p style={styles.paragraph}>
        We follow industry-standard practices to protect your data, but no
        method of storage or transmission is 100% secure.
      </p>

      <h2 style={styles.sectionHeader}>Children’s Privacy</h2>
      <p style={styles.paragraph}>
        Our Service is not intended for users under the age of 13. If you
        believe your child has provided us with data, please contact us
        immediately.
      </p>

      <h2 style={styles.sectionHeader}>Your Rights</h2>
      <p style={styles.paragraph}>
        You may view, update, or request deletion of your personal data from
        your account settings or by contacting us.
      </p>

      <h2 style={styles.sectionHeader}>Changes to This Privacy Policy</h2>
      <p style={styles.paragraph}>
        We may update this policy and will notify you of significant changes via
        email or in-app alerts.
      </p>

      <h2 style={styles.sectionHeader}>Contact Us</h2>
      <p style={styles.paragraph}>
        If you have any questions, please contact us at:
        <br />
        <strong>Email:</strong>{" "}
        <a href="mailto:info@cloutgrid.com">info@cloutgrid.com</a>
      </p>
    </div>
  );
}
