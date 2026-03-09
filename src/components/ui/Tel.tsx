import { Link } from "react-router-dom";

/**
 * Renders a link that initiates a telephone call to the specified number.
 *
 * @param number - The telephone number to be used in the link. If not provided, the component renders nothing.
 * @param label - Optional label to display for the link. If not provided, the number itself is displayed.
 * @returns A React element representing a clickable telephone link, or nothing if no number is provided.
 */
export function Tel(number?: string, label?: string) {
  if (!number) return;
  return (
    <Link to={`tel:${number}`} className="cursor-pointer ">
      {label || number}
    </Link>
  );
}
