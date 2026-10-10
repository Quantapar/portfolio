import {
  Link,
  useLocation,
  useNavigate,
  useResolvedPath,
  type LinkProps,
} from "react-router-dom";
import { canTransition, startRouteTransition } from "../../lib/routeTransition";

/** A router link whose page change morphs shared elements instead of cutting. */
export function TransitionLink({ to, onClick, ...props }: LinkProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const target = useResolvedPath(to);

  return (
    <Link
      to={to}
      {...props}
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
          !canTransition()
        ) {
          return;
        }

        event.preventDefault();
        startRouteTransition(() => navigate(to));
      }}
    />
  );
}
