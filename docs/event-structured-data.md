# Event structured data

Updated 24 October 2026. Event facts live in the existing `content/events/*.md`
files. `lib/content.ts` reads them; `lib/seo.ts` generates JSON-LD. Dates,
venues, organizers, speakers and images are also visible on the detail pages;
the generated Markdown includes the event facts. All existing page URLs remain.

The Events index uses CollectionPage/ItemList links to event pages. Complete
Event entities appear on individual event pages, following
[Google's single-event page guidance](https://developers.google.com/search/docs/appearance/structured-data/event).

## Authoring

Use real event dates, not the page's `last-updated` value. Dates use
`YYYY-MM-DD` without an invented midnight/timezone. A verified one-day event can
use the same start and end date. For multiple days, use the actual range.

For a physical venue, add `venue.name`, `venue.address.streetAddress`,
`venue.address.addressLocality`, and the ISO country code in
`venue.address.addressCountry`. Include a verified postal code when available.
`venue.source` links readers to the official venue/conference page. The
existing `location` string remains the human-readable city/country label.

`organizers` and `speakers` are lists of documented names. Speakers map to
`performer`; an organizer is not automatically classified as a speaker.
`image`, `image_width`, and `image_height` identify the relevant original event
image, displayed on the page and included in structured data. Original images
were copied from the AIIM event pages already linked in each archive; the
same AAAI banner is shared by the tutorial and lab.

For wholly virtual events, set `online: true`. Google currently requires a
physical location for its Event search feature. Online archives remain useful,
indexable pages without claiming a physical venue. Do not substitute a planned
host city for the location of an event that was held online.

Missing/invalid dates, an end date before the start, or an incomplete venue
cause the Event entity to be omitted. The ordinary WebPage and breadcrumbs
remain, without a dangling mainEntity reference. This is a fallback for
unverified data, not a reason to remove accurate Event markup from archives.

## Verified physical events

The 14 physical-event records have dates, a named venue, and a street address.
Each file retains its original event-source link; venue sources are also linked
in the displayed venue summary.

| Record(s) | Date / venue evidence |
|---|---|
| AAAI 2024 tutorial and lab | [AAAI programme](https://aaai.org/aaai-24-conference/aaai-24-tutorial-and-lab-forum/) places both on **21 February 2024** (TQ10 in Room 119; LQ3 in Room 121). [Venue operating guidelines](https://www.vancouverconventioncentre.com/fullpdf/operating-guidelines) document the West Building at 1055 Canada Place, Vancouver. |
| XAI.it 2023 invited talk | [Workshop](https://beyondaccuracy-userprofiling.github.io/xai-it-2023/) and [AIxIA venue](https://www.aixia2023.cnr.it/attendee/venue): Roma Tre, Via Vito Volterra 60, Rome. |
| BIAS 2022 | [Workshop](https://biasinrecsys.github.io/ecir2022/), [conference venue](https://ecir2022.org/conference-venue/), [hotel address](https://www.strawberryhotels.com/hotels/norway/stavanger/clarion-hotel-energy/): Clarion Hotel Energy, Ishockeyveien 2, Stavanger. Remote attendance was also supported; the physical venue is documented. |
| BIAS 2023 | [Workshop](https://biasinrecsys.github.io/ecir2023/) and [conference venue](https://ecir2023.org/attending/attend.html#venue): Radisson Blu Royal Hotel, Golden Lane, Dublin. Remote attendance was also supported. |
| DELTA 2024 | [Workshop](https://aiimlab.org/events/KDD_2024_Discovering_Drift_Phenomena_in_Evolving_Landscape) names CCIB Room 120; [venue certificate](https://ccib.es/wp-content/uploads/2025/09/ISO-22000_ENG.pdf) gives Plaça de Willy Brandt 11–14, Barcelona. |
| ECML-PKDD 2025 tutorial and WIPE-OUT 2025 | [Programme](https://ecmlpkdd.org/2025/workshops-tutorials/) places the tutorial on Friday **19 September**, and WIPE-OUT on Monday **15 September**. [Conference venue](https://ecmlpkdd.org/2025/conference-venue/) and [operator address](https://www.ccalfandegaporto.com/en/location/): Alfândega Porto Congress Centre, Rua Nova da Alfândega, Porto. The tutorial organizer/speaker name Efstratios Zaradoukas follows the [organizers' page](https://aiimlab.org/events/ECML_PKDD_2025_Unraveling_Graph_Counterfactual_Explainability_from_Theoretical_Foundations_to_Technical_Mastery). |
| ESSAI 2025 course | [Course source](https://aiimlab.org/events/ESSAI_2025_Machine_Unlearning_Theory_Methods_and_Evaluations_with_Hands-On_Insights) and [school venue](https://essai2025.eu/travelling/): FIIT STU, Ilkovičova 2, Bratislava. The documented course/school range is retained. |
| GRETEL at WSDM 2023 | [Demo source](https://aiimlab.org/events/gretel-wsdm2023) and [conference venue](https://www.wsdm-conference.org/2023/venue-travel/conference-venue): Carlton Hotel, 76 Bras Basah Road, Singapore. |
| SERecSys at ICDM 2016 | [Workshop source](https://aiimlab.org/events/serecsys-icdm2016), [conference venue](https://icdm2016.eurecat.cat/attending/the-venue-wtc-world-trade-center/), [operator address](https://www.wtcbarcelona.com/es/home-page-x3/bienvenida/): World Trade Center Barcelona, Moll de Barcelona s/n. |
| SIR at CIKM 2018 | [Conference](https://www.cikm2018.units.it/) and [venue address](https://www.centrocongressilingotto.it/en/contacts.html): Centro Congressi Lingotto, Via Nizza 280, Turin. |
| SoAPS at ECIR 2018 | [Conference venue](https://www.ecir2018.org/organisation/minatec-venue/index.html): Minatec, 3 Parvis Louis Néel, Grenoble. |
| WIPE-OUT 2026 | [Workshop](https://aiimlab.org/events/ECML_PKDD_2026_WIPE-OUT_2_Workshop_on_Machine_Unlearning_and_Privacy_Preservation) and [conference venue](https://ecmlpkdd.org/2026/conference-venue/): University of Naples Federico II, Via Claudio 21, Naples. |

## Archive exceptions

These six records keep their pages, links and ordinary WebPage markup:

| Record | Reason for omitting Event markup |
|---|---|
| BIAS 2020 | Held online, confirmed by the [organizers' report](https://sigir.org/wp-content/uploads/2020/06/p11.pdf). |
| BIAS 2021 | Online, as stated on the [official workshop page](https://biasinrecsys.github.io/ecir2021/). |
| CIKM 2020 dropout tutorial | Virtual conference; [organizers' announcement](https://groups.google.com/g/ml-news/c/DWmfc9DJ-tU). Galway was the originally planned host city. |
| SERecSys at ICDM 2017 | Linked archive confirms the date but a specific street-address venue was not verified. |
| SoMePeAS at ECIR 2017 | Linked archive confirms the date; the exact workshop venue address remains unverified. |
| SoMePeAS at ECIR 2019 | Linked archive confirms the date; the exact workshop venue address remains unverified. |

The last three can regain Event markup after adding verified venue facts.

## Optional properties and release checks

No registration prices or current ticket availability were established for the
archived events. No `offers` are invented. `performer` is omitted where no
speaker/presenter was documented. These optional Google warnings may remain;
they do not justify classifying all organizers as performers or claiming free
admission. Completing required properties does not guarantee rich results.

Run:

```sh
npm run build
npm run check:events
npm run lint
```

`check:events` tests missing/invalid dates, incomplete venues, online events,
archive graph references, other document types, and every exported event page.
CI runs it after the production build and before uploading the site artifact.
It checks local output; it is not a replacement for Google's hosted validator.

After deployment, test representative updated URLs with Google's
[Rich Results Test](https://search.google.com/test/rich-results), inspect their
live HTML, then select **Validate fix** in Search Console's Events report.
Google must recrawl the pages before its old issue counts change.

## Verification on 24 October 2026

Production build, TypeScript, lint, and `check:events` passed. The exported
output has 14 complete Event entities and six ordinary archive pages. Among
the seven reported fields, remaining omissions are `offers` on 14 events and
`performer` on eight; missing required dates/locations are zero in emitted
Events. This is a local check of the reported properties, not a Google-hosted
Rich Results Test.

Eight browser checks covered the Events index, AAAI lab, WIPE-OUT 2026, and an
online archive at desktop and phone widths. Images loaded with their expected
aspect ratios, cards used the complete branding image, and the online label
was visible. External fonts and analytics were blocked during these checks;
no Core Web Vitals measurement is claimed.

The installed Next.js 16.4.0 also blocked production builds on a pre-existing
[security advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
The compatible patch update to 16.4.3 removed that blocker. Other existing npm
advisories remain outside this event-markup fix; no broad dependency upgrade
or deployment was performed.
