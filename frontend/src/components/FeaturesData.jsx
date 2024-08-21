import React from "react";

const Features = () => {
  const features = [
    {
      title: "Create Students",
      description:
        "Easily add new students to the system and manage their details.",
    },
    {
      title: "Track Payments",
      description: "Keep track of monthly payments for each student with ease.",
    },
    {
      title: "Update Status",
      description: "Quickly update the payment status for any student.",
    },
    {
      title: "Print Feature",
      description:
        "Easily print student details and payment status for records.",
    },
  ];

  return (
    <section className="p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
