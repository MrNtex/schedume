
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Main from "@/components/Main";
import Image from "next/image";
import { Button } from "react-day-picker";

export default function HomePage() {
  return (
    <Main>
      <Hero/>
      <Features/>
      <FAQ/>
    </Main>
  );
}
