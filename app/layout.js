import "../styles/globals.css"

export const metadata = {
  title: "Arcline",
  description: "Arcitecture + perfect lines, design agency website built with Next.js 13 and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
