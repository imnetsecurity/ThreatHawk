# **App Name**: ThreatHawk

## Core Features:

- Event Viewer: Real-time Sysmon Event Viewer: Display incoming Sysmon events in a sortable and filterable table with syntax highlighting, timestamps and event details.
- Anomaly Detection: Behavioral Anomaly Detection: The system baselines normal user and host behavior using Sysmon data.  Anomalies, such as unusual process spawns or connections, trigger alerts for investigation.
- Rule Generation: AI-Driven Sysmon Rule Generation: Suggest new Sysmon rules based on detected anomalies. Analysts can review the tool's recommendation and deploy with one click.
- Alerting: Alert Triage Dashboard: Consolidate alerts from various sources (AI, YARA) with severity levels, and triage tools (Acknowledge, Escalate, False Positive).
- YARA Rule Manager: Centralized YARA Rule Management: Store, edit, and deploy YARA rules to the agents, including syntax highlighting.
- PowerShell Gateway: Secure PowerShell Gateway: Provides an audited, secure web-based terminal for executing PowerShell commands on remote agents.  All commands and outputs are logged.
- Sysmon Config: Sysmon Configuration Management: Enables a user-friendly XML editor for maintaining Sysmon configuration, versioning, and deployment.

## Style Guidelines:

- Background color: Dark gray (#222222) to minimize eye strain and provide a professional look.  Based on the user's explicit request for a dark mode theme.
- Primary color: Electric blue (#7DF9FF) for high-confidence alerts. The electric blue provides high contrast on a dark background, and a feeling of technological sophistication appropriate to the software's goals.
- Accent color: Lime green (#32CD32) to indicate routine or standard operations, or to visually separate key information.
- Body font: 'Inter', a grotesque-style sans-serif, should be used for its objective and modern look, making it highly suitable for both headings and body text.
- Use a set of clear, minimalist icons.  Use color to match severity levels (critical, warning, informational, normal). Icon set should also work well on dark backgrounds.
- Dashboard layout: Display Key Metrics (Events, Alerts, Agents) prominently with a timeline of severity. Arrange the other key features in clear visual blocks.
- Use subtle animations for status updates (e.g., agent check-in), loading indicators, and when transitioning between views.