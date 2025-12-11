import { Icon } from "@yopem-ui/react-icons"

import { Button } from "@/components/ui/button"
import Link from "@/components/ui/link"
import { createApi } from "@/lib/trpc/server"

const Footer = async () => {
  const api = await createApi()

  const desa = await api.setting.byKey("desa")
  const address = await api.setting.byKey("address")
  const kecamatan = await api.setting.byKey("kecamatan")
  const kabupaten = await api.setting.byKey("kabupaten")
  const provinsi = await api.setting.byKey("provinsi")
  const facebookUsername = await api.setting.byKey("facebookUsername")
  const instagramUsername = await api.setting.byKey("instagramUsername")
  const youtubeUsername = await api.setting.byKey("youtubeUsername")
  const whatsappNumber = await api.setting.byKey("whatsappNumber")
  const supportEmail = await api.setting.byKey("supportEmail")

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background text-foreground border-t">
      {/* WhatsApp Contact Bar */}
      <div className="bg-muted/30 border-b py-2 text-sm">
        <div className="container mx-auto flex items-center justify-center px-4">
          <Icon name="Phone" className="text-muted-foreground mr-2 size-4" />
          <span className="text-muted-foreground font-medium">
            {whatsappNumber}
          </span>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Village Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary text-primary-foreground rounded-lg p-2">
                  <Icon name="Shield" className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Desa {desa}</h3>
                  <p className="text-muted-foreground text-sm">
                    Kecamatan {kecamatan}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Kabupaten {kabupaten}, Provinsi {provinsi}
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                Kontak
              </h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Icon
                    name="Mail"
                    className="text-muted-foreground mr-3 size-4"
                  />
                  <span>{supportEmail}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Icon
                    name="MapPin"
                    className="text-muted-foreground mt-0.5 mr-3 size-4"
                  />
                  <span className="text-muted-foreground">{address}</span>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                Sosial Media
              </h4>
              <div className="flex space-x-2">
                {facebookUsername && (
                  <Button asChild variant="outline" size="icon">
                    <Link
                      href={`https://www.facebook.com/${facebookUsername}`}
                      target="_blank"
                    >
                      <Icon name="Facebook" className="size-4" />
                    </Link>
                  </Button>
                )}
                {instagramUsername && (
                  <Button asChild variant="outline" size="icon">
                    <Link
                      href={`https://instagram.com/${instagramUsername}`}
                      target="_blank"
                    >
                      <Icon name="Instagram" className="size-4" />
                    </Link>
                  </Button>
                )}
                {youtubeUsername && (
                  <Button asChild variant="outline" size="icon">
                    <Link
                      href={`https://youtube.com/channel/${youtubeUsername}`}
                      target="_blank"
                    >
                      <Icon name="Youtube" className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Pintudesa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
