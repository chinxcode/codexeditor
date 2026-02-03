import "../styles/globals.css";
import "../styles/chatbot.css";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-G39KFP1LZ7" />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-G39KFP1LZ7');
                    `,
                }}
            />
            <SessionProvider session={session}>
                <Component {...pageProps} />
                <Analytics />
            </SessionProvider>
        </>
    );
}

export default MyApp;
