import Demographics from "@/components/features/web/demographics"
import DigitalServices from "@/components/features/web/digital-services"
import Hero from "@/components/features/web/hero"
import Services from "@/components/features/web/services"

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Services />
      <Demographics />
      <DigitalServices />
    </div>
  )
}
