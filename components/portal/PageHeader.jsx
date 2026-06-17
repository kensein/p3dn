export default function PageHeader({ title, description, icon: Icon }) {
  return (
    <section className="bg-gradient-to-r from-[#003366] to-[#0066CC] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {Icon ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Icon className="h-6 w-6 text-white" />
            </div>
          ) : null}
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-3xl text-sm text-blue-100 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
