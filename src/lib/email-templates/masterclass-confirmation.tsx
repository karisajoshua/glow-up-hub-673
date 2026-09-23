import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
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
        <Section style={topBar} />
        <Section style={header}>
          <Img
            src={LOGO_URL}
            width="88"
            height="88"
            alt="S-STC crest"
            style={logo}
          />
          <Text style={brand}>S-STC</Text>
          <Text style={brandSub}>Sustainability and Green Skills Training</Text>
        </Section>

        <Section style={content}>
          <Text style={eyebrow}>PAYMENT RECEIVED · PLACE RESERVED</Text>
          <Heading style={heading}>Your place is confirmed</Heading>
          <Text style={text}>{fullName ? `Hello ${fullName},` : 'Hello,'}</Text>
          <Text style={text}>
            Thank you for your payment. Your place in <strong>{masterclassTitle}</strong> is now
            confirmed. Your session details and secure joining access are below.
          </Text>

          <Section style={details}>
            <Text style={detailsTitle}>{masterclassTitle}</Text>
            {date ? (
              <Text style={detailRow}>
                <strong>Date</strong>&nbsp;&nbsp; {date}
              </Text>
            ) : null}
            {time ? (
              <Text style={detailRow}>
                <strong>Time</strong>&nbsp;&nbsp; {time}
              </Text>
            ) : null}
            <Text style={detailRow}>
              <strong>Delivery</strong>&nbsp;&nbsp; {venue}
            </Text>
          </Section>

          {meetLink ? (
            <Section style={joinSection}>
              <Button href={meetLink} style={button}>
                Open Google Meet / Calendar
              </Button>
              <Text style={linkLabel}>If the button does not open, copy this secure link:</Text>
              <Text style={linkText}>
                <Link href={meetLink} style={link}>
                  {meetLink}
                </Link>
              </Text>
            </Section>
          ) : null}

          <Section style={instructions}>
            <Text style={instructionsTitle}>Before the session</Text>
            <Text style={instructionRow}>• Join about five minutes early.</Text>
            <Text style={instructionRow}>• Use a quiet space and a stable internet connection.</Text>
            <Text style={instructionRow}>
              • Bring a notebook and an updated copy of your CV so you can work along.
            </Text>
          </Section>

          <Text style={signoff}>
            We look forward to welcoming you.
            <br />
            <strong>The S-STC Team</strong>
          </Text>
        </Section>

        <Section style={footerSection}>
          <Text style={footerBrand}>S-STC</Text>
          <Text style={footer}>
            Building skills for economic prosperity, social inclusion and environmental
            stewardship.
          </Text>
          <Hr style={footerRule} />
          <Text style={footerLinks}>
            <Link href="mailto:info@sstc.co.ke" style={footerLink}>
              info@sstc.co.ke
            </Link>
            {'  ·  '}WhatsApp +254 739 775 180{'  ·  '}
            <Link href="https://sstc.co.ke" style={footerLink}>
              sstc.co.ke
            </Link>
          </Text>
          <Text style={footerNote}>This message was sent because your masterclass payment was confirmed.</Text>
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
  backgroundColor: '#edf2f5',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '0',
  padding: '32px 12px',
}
const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #dfe6e3',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
  overflow: 'hidden' as const,
}
const topBar = { backgroundColor: GREEN, height: '7px', lineHeight: '7px' }
const header = {
  backgroundColor: '#ffffff',
  padding: '28px 30px 22px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e2ebe6',
}
const logo = {
  border: '0',
  borderRadius: '50%',
  display: 'block',
  margin: '0 auto 12px',
  objectFit: 'cover' as const,
}
const brand = {
  margin: '0 0 2px',
  fontSize: '25px',
  fontWeight: 'bold' as const,
  letterSpacing: '0',
  color: BLUE,
}
const brandSub = { margin: '0', fontSize: '12px', color: GREEN, lineHeight: '18px' }
const content = { padding: '32px 34px 28px' }
const eyebrow = {
  margin: '0 0 10px',
  fontSize: '11px',
  fontWeight: 'bold' as const,
  color: GREEN,
  letterSpacing: '0',
}
const heading = { margin: '0 0 20px', fontSize: '28px', lineHeight: '35px', color: BLUE }
const text = { margin: '0 0 14px', fontSize: '15px', lineHeight: '24px', color: '#34424a' }
const details = {
  backgroundColor: PALE_GREEN,
  borderLeft: `4px solid ${GREEN}`,
  borderRadius: '4px',
  padding: '18px 20px 14px',
  margin: '24px 0',
}
const detailsTitle = {
  margin: '0 0 12px',
  fontSize: '17px',
  lineHeight: '24px',
  fontWeight: 'bold' as const,
  color: BLUE,
}
const detailRow = { margin: '7px 0', fontSize: '14px', lineHeight: '21px', color: '#34424a' }
const joinSection = { margin: '28px 0', textAlign: 'center' as const }
const button = {
  backgroundColor: GREEN,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  padding: '14px 25px',
  borderRadius: '6px',
  textDecoration: 'none',
}
const linkLabel = { fontSize: '12px', color: '#66737a', margin: '18px 0 5px' }
const linkText = { fontSize: '12px', lineHeight: '18px', margin: '0', wordBreak: 'break-all' as const }
const link = { color: BLUE, textDecoration: 'underline' }
const instructions = {
  backgroundColor: '#f7f9fa',
  border: '1px solid #e2e8eb',
  borderRadius: '5px',
  padding: '17px 20px 12px',
  margin: '26px 0 22px',
}
const instructionsTitle = {
  margin: '0 0 10px',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  color: BLUE,
}
const instructionRow = { margin: '5px 0', fontSize: '13px', lineHeight: '20px', color: '#45545c' }
const signoff = { margin: '22px 0 0', fontSize: '14px', lineHeight: '23px', color: '#34424a' }
const footerSection = { backgroundColor: BLUE, padding: '24px 30px', textAlign: 'center' as const }
const footerBrand = {
  margin: '0 0 6px',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#ffffff',
}
const footer = { margin: '0', fontSize: '12px', color: '#dce9f2', lineHeight: '19px' }
const footerRule = { borderColor: '#315a7d', margin: '16px 0 12px' }
const footerLinks = { margin: '0', fontSize: '11px', color: '#ffffff', lineHeight: '18px' }
const footerLink = { color: '#ffffff', textDecoration: 'underline' }
const footerNote = { margin: '10px 0 0', fontSize: '10px', color: '#b9cad7', lineHeight: '16px' }
