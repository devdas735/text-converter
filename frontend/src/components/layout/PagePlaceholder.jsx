function PagePlaceholder({ title, description }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      <p className="max-w-3xl text-slate-300">{description}</p>
    </section>
  );
}

export default PagePlaceholder;
