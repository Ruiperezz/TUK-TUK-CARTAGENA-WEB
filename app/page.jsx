import { Suspense } from "react";
import HomePage from "../src/components/HomePage";

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
