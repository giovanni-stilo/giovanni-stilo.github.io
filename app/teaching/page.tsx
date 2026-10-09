import { ContentPage, contentPageMetadata } from "@/components/site/content-page";

export const metadata = contentPageMetadata("teaching", "/teaching/");

export default function Page() {
  return <ContentPage name="teaching" path="/teaching/" />;
}
