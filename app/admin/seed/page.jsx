export default function Page() {
  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <section className="mx-auto max-w-2xl border border-red-900/60 bg-gray-900 p-6">
        <h1 className="text-xl font-semibold">Wallet credential management disabled</h1>
        <p className="mt-3 text-gray-300">
          Recovery phrases, private keys, and keystore passwords must never be collected or viewed by administrators.
        </p>
      </section>
    </main>
  );
}
