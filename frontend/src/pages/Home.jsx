import Faqs from "@/components/Faqs";
import Features from "@/components/FeaturesData";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import StudentStats from "@/components/StudentStats";
import { useTitle } from "@/utils/useTitle";
import { useSelector } from "react-redux";

export const Home = () => {
  const { currentUser } = useSelector((state) => state.login);
  useTitle("Home");
  return (
    <div>
      {currentUser ? <StudentStats /> : <Hero />}
      <Features />
      <Faqs />
      <Footer />
    </div>
  );
};
