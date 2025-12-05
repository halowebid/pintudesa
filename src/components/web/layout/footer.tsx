import { Button } from "@/lib/ui"
import { Icon } from "@yopem-ui/react-icons"

import Link from "@/components/web/link"
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
    <footer className="from-background/80 to-background/90 text-foreground bg-gradient-to-r">
      {/* WhatsApp Contact Bar */}
      <div className="bg-green-500 py-3">
        <div className="container mx-auto flex items-center justify-center px-4">
          <Icon name="Phone" className="mr-2 size-5" />
          <span className="font-semibold">{whatsappNumber}</span>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Village Info */}
            <div>
              <div className="mb-6 flex items-center space-x-3">
                <div className="rounded-lg bg-green-600 p-2">
                  <Icon name="Shield" className="size-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Desa {desa}</h3>
                  <p className="text-accent-foreground">
                    Kecamatan {kecamatan}
                  </p>
                  <p className="text-accent-foreground">
                    Kabupaten {kabupaten}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Email :</h4>
              <div className="mb-4 flex items-center">
                <Icon
                  name="Mail"
                  className="text-accent-foreground mr-3 size-5"
                />
                <span>{supportEmail}</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Alamat :</h4>
              <div className="flex items-start">
                <Icon
                  name="MapPin"
                  className="text-accent-foreground mt-1 mr-3 size-5"
                />
                <div>
                  <p>
                    {address}, Kabupaten {kabupaten},
                  </p>
                  <p>Provinsi {provinsi}, Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-6 border-t border-sky-700 pt-8">
            {facebookUsername && (
              <Button asChild variant="ghost" size="icon">
                <Link
                  href={`https://www.facebook.com/${facebookUsername}`}
                  target="_blank"
                >
                  <Icon name="Facebook" className="size-6" />
                </Link>
              </Button>
            )}
            {instagramUsername && (
              <Button asChild variant="ghost" size="icon">
                <Link
                  href={`https://instagram.com/${instagramUsername}`}
                  target="_blank"
                >
                  <Icon name="Instagram" className="size-6" />
                </Link>
              </Button>
            )}
            {youtubeUsername && (
              <Button asChild variant="ghost" size="icon">
                <Link
                  href={`https://youtube.com/channel/${youtubeUsername}`}
                  target="_blank"
                >
                  <Icon name="Youtube" className="size-6" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-accent py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent-foreground">Pintudesa © {currentYear}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
