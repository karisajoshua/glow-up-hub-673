import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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
        <Text style={brand}>S-STC</Text>
        <Text style={brandSub}>Sustainability and Green Skills Training</Text>

        <Heading style={heading}>Your place is confirmed</Heading>
        <Text style={text}>
          {fullName ? `Hello ${fullName},` : 'Hello,'} we have received your payment and reserved
          your place in <strong>{masterclassTitle}</strong>.
        </Text>

        <Section style={details}>
          {date ? <Text style={detailRow}>Date: {date}</Text> : null}
          {time ? <Text style={detailRow}>Time: {time}</Text> : null}
          <Text style={detailRow}>Venue: {venue}</Text>
        </Section>

        {meetLink ? (
          <Section style={{ margin: '28px 0' }}>
            <Button href={meetLink} style={button}>
              Join the session
            </Button>
            <Text style={linkText}>
              Or paste this link into your browser: <Link href={meetLink}>{meetLink}</Link>
            </Text>
          </Section>
        ) : null}

        <Text style={text}>
          Please be online about five minutes early, join from a quiet space with a stable
          connection, and bring a notebook or an updated copy of your CV so you can work along with
          the facilitator.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          S-STC · info@sstc.co.ke · WhatsApp +254 739 775 180 ·{' '}
          <Link href="https://sstc.co.ke" style={{ color: GREEN }}>
            sstc.co.ke
          </Link>
        </Text>
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

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 26px', maxWidth: '600px' }
const brand = {
  margin: '0',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  letterSpacing: '1px',
  color: BLUE,
}
const brandSub = { margin: '2px 0 24px', fontSize: '12px', color: GREEN, letterSpacing: '1px' }
const heading = { margin: '0 0 14px', fontSize: '24px', color: BLUE }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333333' }
const details = {
  backgroundColor: '#f4f8f5',
  borderLeft: `3px solid ${GREEN}`,
  padding: '14px 18px',
  margin: '20px 0',
}
const detailRow = { margin: '4px 0', fontSize: '15px', color: BLUE }
const button = {
  backgroundColor: BLUE,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  padding: '13px 26px',
  borderRadius: '6px',
  textDecoration: 'none',
}
const linkText = { fontSize: '13px', color: '#555555', marginTop: '14px' }
const hr = { borderColor: '#e3e8e4', margin: '28px 0 16px' }
const footer = { fontSize: '12px', color: '#666666', lineHeight: '20px' }
