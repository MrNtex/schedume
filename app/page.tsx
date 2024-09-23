import ButtonSize from "@/components/ButtonSize";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Main from "@/components/Main";
import Image from "next/image";
import { Button } from "react-day-picker";

export default function HomePage() {
  return (
    <Main>
      <div className="flex flex-col h-screen ">
        <Hero/>
        <Features/>
        <ButtonSize/>
      </div>
    </Main>
  );
}
