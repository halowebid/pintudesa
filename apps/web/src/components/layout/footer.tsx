import { Button } from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"

const Footer = () => {
  return (
    <footer className="from-background/80 to-background/90 text-foreground bg-gradient-to-r">
      {/* WhatsApp Contact Bar */}
      <div className="bg-green-500 py-3">
        <div className="container mx-auto flex items-center justify-center px-4">
          <Icon name="Phone" className="mr-2 size-5" />
          <span className="font-semibold">+6281276534865</span>
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
                  <h3 className="text-xl font-bold">Desa Sukatani</h3>
                  <p className="text-accent-foreground">Kecamatan Sukakopi</p>
                  <p className="text-accent-foreground">Kabupaten Sukajanda</p>
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
                <span>desasukatani@gmail.com</span>
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
                  <p>Sukatani, Kabupaten Sukajanda,</p>
                  <p>Provinsi Sumatera Tenggara, Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-8 flex justify-center space-x-6 border-t border-sky-700 pt-8">
            <Button variant="ghost" size="icon">
              <Icon name="Facebook" className="size-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Instagram" className="size-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Youtube" className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-accent py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent-foreground">
            Digital Daftar Warga Nusantara © 2025
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
