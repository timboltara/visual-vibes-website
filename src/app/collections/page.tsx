import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    slug: "faith-collection",
    name: "The Faith Collection",
    tagline: "Romans 1:16",
    description: "Scripture-inspired designs for the believer who carries their faith into every part of daily life.",
    coverImage: "https://visualvibesllc.com/cdn/shop/files/9977603057237069872_2048.jpg",
    count: 8,
  },
  {
    slug: "kings-collection",
    name: "The Kings Collection",
    tagline: "Revelation 19:16",
    description: "Crown and royalty-themed pieces for those who know who they belong to — the King of Kings.",
    coverImage: "https://visualvibesllc.com/cdn/shop/files/20260117054810-1f0f3681-adf8-6550-bcce-be50c093e59a.jpg",
    count: 7,
  },
];

export default function CollectionsPage() {
  return (
    <div className="pt-[129px] min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-vv-black overflow-hidden" style={{ minHeight: "260px" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 25% 65%, #e8622a 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, #bf4f1e 0%, transparent 45%)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[260px]">
          <p className="font-heading text-vv-orange text-xs uppercase tracking-widest2 mb-3">Curated With Purpose</p>
          <h1 className="font-heading font-black text-white uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}>
            Collections
          </h1>
          <p className="font-body text-gray-400 text-sm max-w-xs mx-auto mt-4">
            Each collection tells a story of faith. Find yours.
          </p>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="max-w-screen-lg mx-auto px-5 sm:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <Link key={col.slug} href={`/collections/${col.slug}`} className="group block relative overflow-hidden bg-vv-gray">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  style={{ filter: "contrast(1.05) brightness(0.85)" }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-heading text-[10px] uppercase tracking-widest2 text-vv-orange mb-2">{col.tagline}</p>
                  <h2 className="font-heading font-black text-white uppercase leading-none text-2xl sm:text-3xl mb-2">
                    {col.name}
                  </h2>
                  <p className="font-body text-white/70 text-sm mb-4 max-w-xs">{col.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="inline-block bg-vv-orange text-white font-heading text-xs font-semibold uppercase tracking-widest2 px-6 py-3 group-hover:bg-white group-hover:text-vv-black transition-colors duration-300">
                      Shop Collection
                    </span>
                    <span className="font-heading text-[10px] uppercase tracking-widest text-white/50">
                      {col.count} pieces
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse all CTA */}
        <div className="mt-12 text-center">
          <p className="font-body text-vv-gray-mid text-sm mb-4">Looking for something specific?</p>
          <Link href="/shop" className="inline-block border border-vv-black text-vv-black font-heading text-xs font-semibold uppercase tracking-widest2 px-10 py-4 hover:bg-vv-black hover:text-white transition-colors duration-300">
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
