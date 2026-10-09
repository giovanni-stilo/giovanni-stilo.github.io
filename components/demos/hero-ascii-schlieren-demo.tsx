import { SchlierenRig } from "@/components/ui/hero-ascii-schlieren";

export default function SchlierenRigDemo() {
  return (
    <SchlierenRig>
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
        Only the edges survive.
      </h1>
      <p className="max-w-md text-sm text-muted-foreground sm:text-base">
        Still air transmits nothing — only the steep density boundaries of a
        rising thermal survive the knife edge. Sweep the pointer across the
        field to rotate that knife.
      </p>
    </SchlierenRig>
  );
}
