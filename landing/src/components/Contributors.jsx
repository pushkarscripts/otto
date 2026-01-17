const contributors = [
  {
    name: "John Doe",
    role: "Developer",
  },
  {
    name: "Jane Smith",
    role: "Designer",
  },
  {
    name: "Sam Wilson",
    role: "Researcher",
  },
  {
    name: "Alice Johnson",
    role: "Developer",
  },
];

const Contributors = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-serif font-bold mb-12">Contributors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contributors.map((contributor) => (
            <div key={contributor.name} className="bg-white/10 rounded-full w-32 h-32 flex items-center justify-center flex-col mx-auto border border-black/5 transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <h3 className="text-md font-semibold text-center">{contributor.name}</h3>
              <p className="text-primary-text/70 text-sm text-center">{contributor.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contributors;
