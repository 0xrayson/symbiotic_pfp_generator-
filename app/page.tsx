import { PfpGenerator } from "@/components/pfp-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            symbiotic pfp generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transform your profile picture with our signature symbiotic border. Upload your image and download your
            enhanced PFP instantly.
          </p>
        </div>

        <PfpGenerator />

        <footer className="text-center mt-16 pb-8">
          <p className="text-muted-foreground">
            created with 💚 by{" "}
            <a
              href="https://x.com/0xrayson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              @0xrayson
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
