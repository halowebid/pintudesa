import Demographics from "@/components/demographics"
import DigitalServices from "@/components/digital-services"
import Hero from "@/components/hero"
import Services from "@/components/services"

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
