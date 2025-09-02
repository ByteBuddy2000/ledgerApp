import Head from "next/head";

import AboutSection from "@/components/AboutSection/AboutSection";
import CounterSection from "@/components/CounterSection/CounterSection";
import FAQSection from "@/components/FAQSection/FAQSection";
import FlareNetworkSection from "@/components/FlareNetworkSection/FlareNetworkSection";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HowItWorksSection from "@/components/HowItWorksSection/HowItWorksSection";
import QFSCard from "@/components/QFSCard/QFSCard";
import RecentNewsSection from "@/components/RecentNewsSection/RecentNewsSection";
import TestimonialsSection from "@/components/TestimonialSection/TestimonialSection";
import TouchSection from "@/components/TouchSection/TouchSection";
import VideoArea from "@/components/VideoArea/VideoArea";
import Navbar from "@/components/Navbar/Navbar";
import Banner from "@/components/Banner/Banner";

export default function Home() {
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '5ce16d6181794ff74162dd204d883f70c76f4f66';
              window.smartsupp || (function(d) {
                var s, c, o = smartsupp = function () { o._.push(arguments) }; o._ = [];
                s = d.getElementsByTagName('script')[0];
                c = d.createElement('script'); c.type = 'text/javascript'; c.charset = 'utf-8'; c.async = true;
                c.src = 'https://www.smartsuppchat.com/loader.js?';
                s.parentNode.insertBefore(c, s);
              })(document);
            `,
          }}
        />
      </Head>

      <main className="w-full min-h-screen  text-white overflow-x-hidden">
        {/* Navbar */}
        {/* <div className="absolute top-0 left-0 w-full z-50"> */}
        {/* <div className="sticky top-0"> */}
        <Navbar />
        {/* </div> */}
        {/* </div> */}
        <Banner />
        {/* <Header /> */}
        <QFSCard />
        <AboutSection />
        <VideoArea />
        <FlareNetworkSection />
        <HowItWorksSection />
        <FAQSection />
        <CounterSection />
        <TouchSection />
        <TestimonialsSection />
        <RecentNewsSection />
        <Footer />
      </main>
    </>
  );
}
