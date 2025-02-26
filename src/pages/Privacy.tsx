import React from 'react';
import styled from 'styled-components';

/**
 * Privacy Policy page component
 * Provides information about data collection and privacy practices
 */
const Privacy: React.FC = () => {
  return (
    <PrivacyContainer>
      <Title>Privacy Policy</Title>
      <LastUpdated>Last Updated: {new Date().toLocaleDateString()}</LastUpdated>

      <Section>
        <SectionTitle>Introduction</SectionTitle>
        <SectionContent>
          At NBA Player Comparison, we respect your privacy and are committed to protecting your
          personal data. This privacy policy will inform you about how we look after your personal
          data when you visit our website and tell you about your privacy rights and how the law
          protects you.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Information We Collect</SectionTitle>
        <SectionContent>
          We collect minimal information to provide and improve our service. The types of information
          we may collect include:
        </SectionContent>
        <List>
          <ListItem>
            <ItemTitle>Usage Data</ItemTitle>
            <ItemContent>
              Information on how you use our website, including pages visited, time spent on pages,
              and other diagnostic data.
            </ItemContent>
          </ListItem>
          <ListItem>
            <ItemTitle>Cookies</ItemTitle>
            <ItemContent>
              We use cookies and similar tracking technologies to track activity on our website and
              hold certain information. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent.
            </ItemContent>
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>How We Use Your Information</SectionTitle>
        <SectionContent>
          We use the information we collect for various purposes, including:
        </SectionContent>
        <List>
          <ListItem>To provide and maintain our service</ListItem>
          <ListItem>To notify you about changes to our service</ListItem>
          <ListItem>To provide customer support</ListItem>
          <ListItem>To gather analysis or valuable information to improve our service</ListItem>
          <ListItem>To monitor the usage of our service</ListItem>
          <ListItem>To detect, prevent, and address technical issues</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>Data Security</SectionTitle>
        <SectionContent>
          The security of your data is important to us, but remember that no method of transmission
          over the Internet or method of electronic storage is 100% secure. While we strive to use
          commercially acceptable means to protect your personal data, we cannot guarantee its
          absolute security.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Third-Party Services</SectionTitle>
        <SectionContent>
          We may employ third-party companies and individuals to facilitate our service, provide
          the service on our behalf, perform service-related services, or assist us in analyzing
          how our service is used. These third parties have access to your personal data only to
          perform these tasks on our behalf and are obligated not to disclose or use it for any
          other purpose.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Changes to This Privacy Policy</SectionTitle>
        <SectionContent>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last Updated" date at the
          top of this Privacy Policy.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Contact Us</SectionTitle>
        <SectionContent>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <EmailLink href="mailto:privacy@nbaplayercomparison.com">privacy@nbaplayercomparison.com</EmailLink>.
        </SectionContent>
      </Section>
    </PrivacyContainer>
  );
};

// Styled components
const PrivacyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1d428a; /* NBA blue */
  text-align: center;
`;

const LastUpdated = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1d428a; /* NBA blue */
`;

const SectionContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const ItemTitle = styled.strong`
  display: block;
  margin-bottom: 0.25rem;
`;

const ItemContent = styled.p`
  margin: 0;
  font-size: 0.95rem;
`;

const EmailLink = styled.a`
  color: #1d428a;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default Privacy;
