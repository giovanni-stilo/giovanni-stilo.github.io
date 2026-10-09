import { ContentPage, contentPageMetadata } from "@/components/site/content-page";

export const metadata = contentPageMetadata("about", "/about/");

export default function Page() {
  return <ContentPage name="about" path="/about/" />;
}
