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
  paragraph: { marginBottom: "16px", lineHeight: "1.6", whiteSpace: "pre-wrap" },
};

export default function EULA() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>End User License Agreement (EULA)</h1>
      <p style={styles.subtitle}>Effective Date: May 28, 2025</p>

      <p style={styles.paragraph}>
        IMPORTANT: PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING CLOUTGRID. BY CREATING AN ACCOUNT OR ACCESSING THE APP, YOU AGREE TO BE BOUND BY THE TERMS OF THIS AGREEMENT. IF YOU DO NOT AGREE, DO NOT USE THE APP.
      </p>

      <h2 style={styles.sectionHeader}>1. License Grant</h2>
      <p style={styles.paragraph}>
        Cloutivity Private Limited ("Company", "we", "our") grants you ("User", "you") a limited, non-exclusive, non-transferable, revocable license to use Cloutgrid for your personal or business use in accordance with this Agreement.
      </p>

      <h2 style={styles.sectionHeader}>2. Ownership</h2>
      <p style={styles.paragraph}>
        All content, code, and data within Cloutgrid remain the exclusive property of Cloutivity Private Limited. You are granted a license to use Cloutgrid but not ownership of any of its components.
      </p>

      <h2 style={styles.sectionHeader}>3. User-Generated Content</h2>
      <p style={styles.paragraph}>
        Cloutgrid allows users to upload content such as posts, comments, messages, and profile details ("User Content"). By submitting User Content, you agree to the following:
        {"\n"}- You are solely responsible for all content you post or share.
        {"\n"}- You will not submit any content that is abusive, threatening, discriminatory, harassing, defamatory, obscene, illegal, or otherwise objectionable.
        {"\n"}- You grant Cloutivity Private Limited a non-exclusive, worldwide, royalty-free license to use, host, store, display, and distribute your User Content for the purpose of operating and improving the platform.
      </p>

      <h2 style={styles.sectionHeader}>4. Community Standards & No Tolerance Policy</h2>
      <p style={styles.paragraph}>
        By using Cloutgrid, you agree to:
        {"\n"}- Abide by our Community Guidelines, which prohibit hate speech, explicit content, impersonation, spam, harassment, and abusive behavior.
        {"\n"}- Understand that Cloutgrid enforces a zero-tolerance policy toward objectionable content or abusive users.
        {"\n"}- Not exploit, manipulate, or interfere with the platform or other users.
      </p>

      <h2 style={styles.sectionHeader}>5. Moderation & Reporting</h2>
      <p style={styles.paragraph}>
        Cloutgrid includes the following content moderation systems:
        {"\n"}- Automated and manual filtering of objectionable content.
        {"\n"}- Flagging mechanism allowing users to report content or behavior that violates community guidelines.
        {"\n"}- Review and enforcement, where reported content may be reviewed, removed, and action taken against violators, including warnings, suspensions, or permanent bans.
      </p>

      <h2 style={styles.sectionHeader}>6. Account Termination</h2>
      <p style={styles.paragraph}>
        Cloutgrid reserves the right to suspend or terminate your account without prior notice if you violate this EULA, engage in abusive behavior, or post objectionable content.
      </p>

      <h2 style={styles.sectionHeader}>7. Disclaimer & Limitation of Liability</h2>
      <p style={styles.paragraph}>
        Cloutgrid is provided “as is.” We do not guarantee that it will be error-free or uninterrupted. To the maximum extent permitted by law, Cloutivity Private Limited disclaims all liability for damages arising from your use of the app, including loss of data, profits, or exposure to objectionable content.
      </p>

      <h2 style={styles.sectionHeader}>8. Updates and Modifications</h2>
      <p style={styles.paragraph}>
        We may update this EULA from time to time. Continued use of Cloutgrid after such changes constitutes your acceptance of the revised terms.
      </p>

      <h2 style={styles.sectionHeader}>9. Governing Law</h2>
      <p style={styles.paragraph}>
        This Agreement shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
      </p>

      <h2 style={styles.sectionHeader}>10. Contact</h2>
      <p style={styles.paragraph}>
        For questions or concerns, contact:
        {"\n"}Email: <a href="mailto:info@cloutgrid.com">info@cloutgrid.com</a>
      </p>
    </div>
  );
}
