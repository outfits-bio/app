import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'beta.outfits.bio',
  description: "I'm building a virtual wardrobe where people can add photos to their profile and share them with a link like outfits.bio/jecta.",
  image: 'https://outfits.bio/ogimage.png',
  url: 'https://outfits.bio',
  og: {
    locale: 'en_US',
    type: 'website',
    title: 'Something drippy is cooking',
    description: "I'm building a virtual wardrobe where people can add photos to their profile and share them with a link like outfits.bio/jecta.",
    image: 'https://outfits.bio/ogimage.png',
    imageWidth: 1200,
    imageHeight: 630,
    siteName: 'outfits.bio',
  },
  twitter: {
    card: 'summary_large_image',
    domain: 'outfits.bio',
    url: 'https://outfits.bio',
    title: 'Something drippy is cooking',
    description: "I'm building a virtual wardrobe where people can add photos to their profile and share them with a link like outfits.bio/jecta.",
    image: 'https://outfits.bio/ogimage.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
