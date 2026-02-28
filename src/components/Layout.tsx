import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import MiniRadioPlayer from "./MiniRadioPlayer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isRadioPage = location.pathname === "/radio";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <Chatbot />
      {!isRadioPage && <MiniRadioPlayer />}
    </div>
  );
};

export default Layout;
