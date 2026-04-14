import './globals.css'

export const metadata = {
  title: 'Grass Nerds — 2026 Treatment Reference',
  description: 'Internal team reference tool for treatment programs, chemicals, rates, and customer talk tracks.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
