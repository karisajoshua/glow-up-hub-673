import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface Props {
  fullName?: string
  masterclassTitle?: string
  date?: string
  time?: string
  venue?: string
  meetLink?: string
}

const BLUE = '#0b3a66'
const GREEN = '#2f8f5b'
const PALE_GREEN = '#eef7f1'
const LOGO_URL =
  'https://sstc.co.ke/__l5e/assets-v1/201ac2be-9f61-4f61-aab6-d35e39dfc27e/sstc-logo.jpg'

const Email = ({
  fullName,
  masterclassTitle = 'the masterclass',
  date,
  time,
  venue = 'Google Meet',
  meetLink,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your place in {masterclassTitle} is confirmed — here is your joining link.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={LOGO_URL}
            width="80"
            height="80"
            alt="S-STC crest"
            style={logo}
          />
          <Text style={brand}>S-STC</Text>
          <Text style={brandSub}>Sustainability and Green Skills Training</Text>
        </Section>

        <Section style={content}>
          <Text style={status}>Payment received · Place reserved</Text>
          <Heading style={heading}>Your place is confirmed</Heading>
          <Text style={text}>{fullName ? `Hello ${fullName},` : 'Hello,'}</Text>
          <Text style={text}>
            Thank you for your payment. Your place in <strong>{masterclassTitle}</strong> is now
            confirmed.
          </Text>

          <Section style={details}>
            <Text style={detailsTitle}>{masterclassTitle}</Text>
            {date ? (
              <Text style={detailRow}>
                <strong>Date:</strong> {date}
              </Text>
            ) : null}
            {time ? (
              <Text style={detailRow}>
                <strong>Time:</strong> {time}
              </Text>
            ) : null}
            <Text style={detailRow}>
              <strong>Venue:</strong> {venue}
            </Text>
          </Section>

          {meetLink ? (
            <Section style={joinSection}>
              <Text style={joinTitle}>Your joining details</Text>
              <Button href={meetLink} style={button}>
                Join the masterclass
              </Button>
              <Text style={linkLabel}>If the button does not work, copy and paste this link:</Text>
              <Text style={linkText}>
                <Link href={meetLink} style={link}>
                  {meetLink}
                </Link>
              </Text>
            </Section>
          ) : null}

          <Section style={instructions}>
            <Text style={instructionsTitle}>Before the session</Text>
            <Text style={instructionRow}>1. Join about five minutes early.</Text>
            <Text style={instructionRow}>2. Use a quiet space and a stable internet connection.</Text>
            <Text style={instructionRow}>
              3. Bring a notebook and an updated copy of your CV so you can work along.
            </Text>
          </Section>

          <Text style={signoff}>
            We look forward to welcoming you.
            <br />
            <strong>The S-STC Team</strong>
          </Text>
        </Section>

        <Section style={footerSection}>
          <Text style={footer}>
            <strong>S-STC</strong>
            <br />
            Sustainability and Green Skills Training
          </Text>
          <Text style={footerLinks}>
            <Link href="mailto:info@sstc.co.ke" style={footerLink}>
              info@sstc.co.ke
            </Link>
            <br />
            WhatsApp +254 739 775 180
            <br />
            <Link href="https://sstc.co.ke" style={footerLink}>
              sstc.co.ke
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Your place in ${data['masterclassTitle'] ?? 'the masterclass'} is confirmed`,
  displayName: 'Masterclass confirmation',
  previewData: {
    fullName: 'Jane Wanjiku',
    masterclassTitle: 'The Digital Career Compass Masterclass',
    date: '2 October 2026',
    time: '9:00 – 12:00',
    venue: 'Google Meet',
    meetLink: 'https://meet.google.com/abc-defg-hij',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#f3f5f4',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '0',
  padding: '24px 10px',
}
const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #d9e1dd',
  maxWidth: '600px',
  margin: '0 auto',
}
const header = {
  backgroundColor: '#ffffff',
  padding: '24px 24px 20px',
  textAlign: 'center' as const,
  borderTop: `6px solid ${GREEN}`,
  borderBottom: `2px solid ${BLUE}`,
}
const logo = {
  border: '0',
  display: 'block',
  margin: '0 auto 10px',
}
const brand = {
  margin: '0 0 2px',
  fontSize: '24px',
  fontWeight: 'bold' as const,
  letterSpacing: '0',
  color: BLUE,
}
const brandSub = { margin: '0', fontSize: '12px', color: '#244d37', lineHeight: '18px' }
const content = { padding: '28px 30px 24px' }
const status = {
  margin: '0 0 8px',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  color: '#236a43',
  letterSpacing: '0',
}
const heading = { margin: '0 0 20px', fontSize: '26px', lineHeight: '34px', color: '#102f4c' }
const text = { margin: '0 0 14px', fontSize: '16px', lineHeight: '25px', color: '#222222' }
const details = {
  backgroundColor: '#ffffff',
  borderLeft: `4px solid ${GREEN}`,
  borderTop: '1px solid #d9e1dd',
  borderRight: '1px solid #d9e1dd',
  borderBottom: '1px solid #d9e1dd',
  padding: '16px 18px 12px',
  margin: '22px 0',
}
const detailsTitle = {
  margin: '0 0 12px',
  fontSize: '17px',
  lineHeight: '24px',
  fontWeight: 'bold' as const,
  color: '#102f4c',
}
const detailRow = { margin: '7px 0', fontSize: '15px', lineHeight: '22px', color: '#222222' }
const joinSection = { margin: '26px 0', textAlign: 'left' as const }
const joinTitle = {
  margin: '0 0 16px',
  fontSize: '17px',
  fontWeight: 'bold' as const,
  color: '#102f4c',
}
const button = {
  backgroundColor: GREEN,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  padding: '14px 25px',
  borderRadius: '6px',
  textDecoration: 'none',
}
const linkLabel = { fontSize: '13px', color: '#333333', margin: '18px 0 5px' }
const linkText = { fontSize: '13px', lineHeight: '19px', margin: '0', wordBreak: 'break-all' as const }
const link = { color: '#0b3a66', textDecoration: 'underline' }
const instructions = {
  backgroundColor: PALE_GREEN,
  padding: '16px 18px 12px',
  margin: '24px 0 20px',
}
const instructionsTitle = {
  margin: '0 0 10px',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  color: '#102f4c',
}
const instructionRow = { margin: '6px 0', fontSize: '14px', lineHeight: '21px', color: '#222222' }
const signoff = { margin: '22px 0 0', fontSize: '15px', lineHeight: '24px', color: '#222222' }
const footerSection = {
  backgroundColor: '#f6f8f7',
  borderTop: `3px solid ${BLUE}`,
  padding: '20px 28px',
  textAlign: 'center' as const,
}
const footer = { margin: '0 0 10px', fontSize: '13px', color: '#222222', lineHeight: '20px' }
const footerLinks = { margin: '0', fontSize: '12px', color: '#333333', lineHeight: '20px' }
const footerLink = { color: '#0b3a66', textDecoration: 'underline' }
