type HeroProps = {
  image: string;
  title: string;
  subtitle: string;
};

const Hero = ({ image, title, subtitle }: HeroProps) => {
  return (
    <div className="relative h-[450px] w-full overflow-hidden">
      <img
        src={image}
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover transform hover:scale-105 transition-transform duration-3000"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-black/60"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <div className="max-w-4xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 rounded bg-purple-500"></div>
          <p className="mb-8 max-w-2xl text-lg font-medium text-gray-100 md:text-xl lg:mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
