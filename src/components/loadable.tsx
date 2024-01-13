import { LazyExoticComponent, Suspense } from "react";

import { lazy } from "react";
// import { Spinner } from "@material-tailwind/react";

const Spinner = (props: any) => "Loading...";

export function ExpandedSpinner() {
  return (
    <div className='pin-center h-[500px]'>
      <Spinner color="purple" className="w-28 h-28" />
    </div>
  );
}

export default function loadable(
  Comp: LazyExoticComponent<any>,
  fallback?: NonNullable<React.ReactNode>
): React.ComponentType {
  if (fallback === undefined) fallback = <ExpandedSpinner />;

  return () => (
    <Suspense fallback={fallback}>
      <Comp />
    </Suspense>
  );
}

export function lazyload(
  Comp: Parameters<typeof lazy>[0],
  fallback?: NonNullable<React.ReactNode>
): React.ComponentType {
  return loadable(lazy(Comp), fallback);
}
