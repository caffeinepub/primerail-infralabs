# PrimeRail Infralabs

## Current State
- App.tsx has the full version 7 site (TopBar, Navbar, HeroSlider, About, Services, Expertise, Team, Testimonials, Stats, Contact, Footer)
- AdminPage.tsx has a full admin panel with CRUD for Post/Blog/News/Article content, login via Internet Identity, image upload, draft/publish toggle
- ContentHub.tsx has a tabbed public view of published content
- ContentHub was removed from the main page in a previous fix; admin panel button exists in navbar
- Some visual interfaces from version 7 may look broken (backgrounds, text colors)

## Requested Changes (Diff)

### Add
- ContentHub section back into the main site (PrimerailSite component) before the Footer, so published admin content is visible on the website
- A dedicated "Insights" or "Latest Updates" section header above the ContentHub tabs

### Modify
- Restore all version 7 visual styles across every section: clean light backgrounds, fully black text on cards, white text on top bar, correct hover dropdowns
- Admin Panel button in navbar should be clearly visible (orange filled button)
- ContentHub section should match the overall site design: white background, navy headings, orange accents, same card style as services

### Remove
- Nothing

## Implementation Plan
1. In App.tsx, re-add `<ContentHub />` inside `PrimerailSite`'s `<main>` block, just before `<Footer />`
2. Audit every section background and text color to match version 7: TopBar (navy bg, white text), Navbar (white bg), HeroSlider (full-height with overlay), About (cyan-50 bg, black text), Services (amber-50), Expertise (violet-100), Team (white), Testimonials, Stats, Contact, Footer
3. Ensure ContentHub has matching visual style: white bg section, orange tab indicators, navy card titles
4. Admin Panel button in navbar: orange bg, white text, rounded
5. Validate build
