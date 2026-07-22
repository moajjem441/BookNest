import Categories from "./Components/Categories";
import FeaturedBooks from "./Components/FeaturedBooks";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import Statistics from "./Components/Statistics";
import Testimonials from "./Components/Testimonials";


export default function Home() {
  return (
   <div>

   <Hero/>

   <FeaturedBooks></FeaturedBooks>

   <Categories></Categories>

   <HowItWorks></HowItWorks>

   <Statistics></Statistics>

   <Testimonials></Testimonials>
   
   </div>
  );
}
