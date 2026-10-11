import {
  Link,
  useLocation,
  useNavigate,
  useResolvedPath,
  type LinkProps,
} from "react-router-dom";
import { canTransition, startRouteTransition } from "../../lib/routeTransition";

type TransitionLinkProps = Omit<LinkProps, "state"> & {
  /**
   * Step back in history instead of opening `to`, when this page was reached from inside the site.
   * The visitor then lands where they left off; `to` is where anyone who arrived directly goes.
   */
  back?: boolean;
};

/** A router link whose page change morphs shared elements instead of cutting. */
export function TransitionLink({
  to,
  onClick,
  back = false,
  ...props
}: TransitionLinkProps) {
  const navigate = useNavigate();
  const { pathname, key } = useLocation();
  const target = useResolvedPath(to);
  // Tells the next page where it was opened from.
  const state = { from: pathname };
  // The router keys the page a visitor arrived on as "default"; any other was opened from this site.
  const stepBack = back && key !== "default";

  return (
    <Link
      to={to}
      {...props}
      state={state}
      onClick={(event) => {
        onClick?.(event);

        // Leave new-tab clicks, already-handled clicks and same-page links to the browser and router.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          target.pathname === pathname ||
          (!stepBack && !canTransition())
        ) {
          return;
        }

        event.preventDefault();
        startRouteTransition(() => {
          if (stepBack) {
            void navigate(-1);
          } else {
            void navigate(to, { state });
          }
        });
      }}
    />
  );
}
