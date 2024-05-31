//app/layout.js

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        {children}
      </body>
    </html>
  );
}
