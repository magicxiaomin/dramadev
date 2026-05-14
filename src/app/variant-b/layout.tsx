export default function VariantBLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[390px] bg-scene-bg px-4 py-5 text-scene-ink [padding-bottom:calc(1.25rem+env(safe-area-inset-bottom))] [padding-left:calc(1rem+env(safe-area-inset-left))] [padding-right:calc(1rem+env(safe-area-inset-right))] [padding-top:calc(1.25rem+env(safe-area-inset-top))]">
      {children}
    </main>
  );
}
