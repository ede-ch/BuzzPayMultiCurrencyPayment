import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Solutions from "@/components/landing/Solutions";
import Technology from "@/components/landing/Technology";
import GetStarted from "@/components/landing/GetStarted";
import Footer from "@/components/landing/Footer";
import CardStack from "@/components/landing/CardStack";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden bg-ink text-[#f4f1f1]">
      {/* ambient background glow — behind BUZZPAY title in the Hero */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(100% 20% at 52% 18%, rgba(120, 26, 31, 0.35) 0%, rgba(60,14,18,0.16) 55%, rgba(11,7,8,0) 100%)"
        }}
      />

      {/* ambient background glow — Solutions / Technology vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(100% 20% at 50% 85%, rgba(120, 26, 31, 0.31) 0%, rgba(60,14,18,0.18) 30%, rgba(11,7,8,0) 70%)"
        }}
      />


      {/* top hairline */}
      <div
        className="absolute left-0 right-0 top-0 z-30 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, #c4151b, #ef2630 50%, #f45b60)",
        }}
      />

      {/* bottom hairline */}
      <div
        className="absolute left-0 right-0 bottom-0 z-30 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, #c4151b, #ef2630 50%, #f45b60)",
        }}
      />

      {/* decorative animated card stack (spans hero into about) */}
      <CardStack />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Solutions />
        <Technology />
        <GetStarted />
        <Footer />
      </div>
    </main>
  );
}
