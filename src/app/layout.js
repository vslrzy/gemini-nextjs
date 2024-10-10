import "./globals.css";
import { Fira_Code } from "next/font/google";

export const metadata = {
  title: "Gemini API - Next 14",
};

const firaFont = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${firaFont.className} bg-anim`}>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
