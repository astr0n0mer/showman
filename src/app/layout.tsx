import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showman",
  description:
    "Showman can be used to manage show timings for movies, shows and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
