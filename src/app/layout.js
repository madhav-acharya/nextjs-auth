'use client';

import store from "@/store/store";
import { Provider } from "react-redux";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Provider store={store}>
        {children}
      </Provider>
      </body>
    </html>
  );
}
