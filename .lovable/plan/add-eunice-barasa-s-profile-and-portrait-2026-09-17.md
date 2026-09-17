# Add Eunice Barasa’s profile and portrait

Use the supplied portrait as Eunice Barasa’s official image in the two places where her role is relevant, while preserving the existing S-STC visual identity.

## Masterclass page

- Replace the generic workshop image with Eunice’s portrait in the opening section.
- Present her name and role — **Eunice Barasa, Sustainability Advocate | Development Practitioner** — directly with the portrait so visitors immediately recognise the facilitator.
- Keep her WhatsApp contact accessible beside the profile.
- Rebalance the opening layout so the title, quote, action button and portrait align cleanly on desktop and stack naturally on mobile.
- Remove the now-duplicated standalone facilitator block, then tighten the spacing between session details, “What You’ll Gain,” and the application area.
- Use Eunice’s portrait as the masterclass social-sharing image where an absolute published image URL is available.

## About page

- Add a dedicated **Message from the Director** section using the supplied portrait.
- Place the director’s message from the supplied website document beside the image, followed by her name and title: **Eunice Barasa, Director**.
- Include the LinkedIn profile supplied in the document as a clearly labelled external link.
- Position this section after the opening image and before the institution’s philosophy, then adjust surrounding spacing so the page reads in a clear sequence.

## Image handling and checks

- Upload the portrait to the site’s managed image storage and reuse that single asset in both locations.
- Crop with focal positioning that keeps Eunice’s face and shoulders visible without stretching the image.
- Verify both pages on desktop and mobile, including text alignment, image clarity, links, and the existing application flow.

## Technical details

- Update `src/routes/masterclass.tsx` and `src/routes/about.tsx` only, plus one managed portrait asset pointer.
- Preserve the existing blue/green tokens, typography, animation behaviour, metadata structure, and all masterclass registration/PDF logic.
