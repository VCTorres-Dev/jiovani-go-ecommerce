import React from "react";

function Testimonials() {
  return (
    <section className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4">
          <p className="italic">
            "Amazing fragrances and excellent customer service. Highly
            recommend!"
          </p>
          <p className="mt-4 text-right">- Customer 1</p>
        </div>
        <div className="p-4">
          <p className="italic">
            "The best perfumes I've ever used. Truly a great experience!"
          </p>
          <p className="mt-4 text-right">- Customer 2</p>
        </div>
        <div className="p-4">
          <p className="italic">
            "Unique and lasting fragrances. Jiovanni Go is now my go-to perfume
            brand!"
          </p>
          <p className="mt-4 text-right">- Customer 3</p>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
