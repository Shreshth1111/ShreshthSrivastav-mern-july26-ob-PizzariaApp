import React from 'react';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <div className="home-container">

        <h2 className="home-story-title">Our story</h2>

        <p className="home-story-text">
          We believe in good. We launched Fresh Pan Pizza Best Excuse Awards on our Facebook fan page.
          Fans were given situations where they had to come up with wacky and fun excuses. The person
          with the best excuse won the Best Excuse Badge and won Pizzeria's vouchers. Their enthusiastic
          response proved that Pizzeria's Fresh Pan Pizza is the Tastiest Pan Pizza. Ever!
        </p>
        <p className="home-story-text">
          Ever since we launched the Tastiest Pan Pizza, people have not been able to resist the
          softest, cheesiest, crunchiest, butteriest Fresh Pan Pizza. They have been leaving the stage
          in the middle of a performance and even finding excuses to be disqualified in a football match.
        </p>
        <p className="home-story-text">
          We launched Fresh Pan Pizza Best Excuse Awards on our Facebook fan page. Fans were given
          situations where they had to come up with wacky and fun excuses. The person with the best
          excuse won the Best Excuse Badge and won Pizzeria's vouchers.
        </p>

        {/* Ingredients section - image left, text right */}
        <div className="home-section">
          <div className="home-section-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
              alt="Pizza Ingredients"
            />
          </div>
          <div className="home-section-text">
            <h4>Ingredients</h4>
            <p>
              We are ruthless about goodness. We have no qualms about tearing up a day-old lettuce
              leaf straight from the farm, or steaming a baby carrot. Cut. Chop. Steam. Stir.
              While they are still young and fresh — that is our motto. It makes the kitchen a
              better place.
            </p>
          </div>
        </div>

        {/* Our Chefs section - text left, image right */}
        <div className="home-section reverse">
          <div className="home-section-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700"
              alt="Our Chefs"
            />
          </div>
          <div className="home-section-text">
            <h4>Our Chefs</h4>
            <p>
              They make sauces sing and salads dance. They create magic with skill, knowledge,
              passion, and stirring spoons among other things. They make goodness so good it
              does not know what to do with itself. We do though. We send it to you.
            </p>
          </div>
        </div>

        {/* 45 min delivery */}
        <div className="home-delivery-wrap">
          <div className="home-delivery-img">
            <img
              src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400"
              alt="45 minute delivery"
            />
          </div>
          <div className="home-delivery-text">45 min delivery</div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Home;
