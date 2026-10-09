import { ContentPage, contentPageMetadata } from "@/components/site/content-page";

export const metadata = contentPageMetadata("publications", "/publications/");

export default function Page() {
  return <ContentPage name="publications" path="/publications/" />;
}
