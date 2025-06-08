import Hero from "../../components/Hero";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <Hero
        image="https://images.unsplash.com/photo-1573497491208-6b1acb260507?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        title="About This Project"
        subtitle="Learn more about the idea, the creator, and what's coming next."
      />

      <section className="mx-auto mt-10 mb-16 max-w-3xl space-y-6 px-4 text-lg text-gray-700 dark:text-gray-300">
        <p>
          Welcome to my first full React project! 🎉 This app was built to learn
          how to work with React, handle API requests using Axios, design modern
          UIs with Flowbite, and build a real-world system like a business card
          manager.
        </p>

        <p>
          The system allows you to login, browse business cards from a real API,
          and practice skills like routing, state management, and component
          reuse.
        </p>

        <p>
          I'm constantly learning and improving this project. In the future, I
          plan to add new features like:
        </p>

        <ul className="ml-4 list-inside list-disc">
          <li>🌟 User profile page</li>
          <li>📝 Create/edit/delete cards</li>
          <li>🔍 Search and filter functionality</li>
          <li>🎨 Dark/light theme switching</li>
        </ul>

        <p className="pt-4 pb-8">Thanks for checking it out – you're awesome! 🚀</p>
      </section>
    </div>
  );
}
