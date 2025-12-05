import Demographics from "@/components/web/demographics"
import DigitalServices from "@/components/web/digital-services"
import Hero from "@/components/web/hero"
import Services from "@/components/web/services"

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
