import { Suspense } from 'react';
import { PassStub } from './pass-stub';

export default function PassPage() {
  return (
    <Suspense fallback={<p data-testid="variant-b-pass-loading">Loading pass stub…</p>}>
      <PassStub />
    </Suspense>
  );
}
