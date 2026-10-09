import { ContentPage, contentPageMetadata } from "@/components/site/content-page";

export const metadata = contentPageMetadata("service", "/service/");

export default function Page() {
  return <ContentPage name="service" path="/service/" />;
}
