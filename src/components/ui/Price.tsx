import React from "react";
import { formatCurrency } from "../../lib/utils";

/**
 * Props for the PriceDisplay component.
 *
 * @param regularPrice - The original price (required).
 * @param salePrice - The discounted price (optional). If provided, the component shows both prices.
 * @param currency - Currency symbol or text (e.g., "$", "€"). Default: "$".
 * @param currencyPosition - Position of the currency symbol ("left" or "right"). Default: "left".
 * @param className - Additional CSS classes for custom styling.
 * @param decimalPlaces - Number of decimal places to display. Default: 2.
 * @param showStrikeThrough - If `true` and `salePrice` is set, the regular price will have a strikethrough. Default: true.
 */

type PriceDisplayProps = {
  regularPrice: number;
  salePrice?: number;

  /**
   * e.g., "$", "€", "<b>₹</b>"
   */
  currency?: string | React.JSX.Element;
  currencyPosition?: "left" | "right";
  className?: string;
  decimalPlaces?: number;
  showStrikeThrough?: boolean; // If true, shows regular price with strikethrough
};

/**
 * A reusable component for displaying prices with optional sale discounts and currency formatting.
 * Handles validation for invalid prices and supports customizable decimal places and currency positioning.
 */

const RenderPrice: React.FC<PriceDisplayProps> = ({
  regularPrice,
  salePrice,
  currency = "AED",
  currencyPosition = "left",
  className = "",
  decimalPlaces = 2,
  showStrikeThrough = true,
}) => {
  // Validate prices
  if (isNaN(regularPrice)) {
    return <span className="error">Invalid price</span>;
  }

  if (salePrice !== undefined && isNaN(salePrice)) {
    return <span className="error">Invalid sale price</span>;
  }

  // Format the price with fixed decimals
  const formatPrice = (price: number) => {
    return formatCurrency({ price, fractionDigits: decimalPlaces });
  };

  return (
    <span className={`price-container ${className}`}>
      {/* Sale Price (if available) */}
      {salePrice !== undefined && salePrice < regularPrice && (
        <span className="text-">
          {currencyPosition === "left" && (
            <span className="text-bold">{currency}</span>
          )}{" "}
          {formatPrice(salePrice)}
          {currencyPosition === "right" && (
            <span className="text-bold">{currency}</span>
          )}
        </span>
      )}{" "}
      <span
        className={`regular-price  ${
          salePrice !== undefined &&
          salePrice < regularPrice &&
          showStrikeThrough
            ? "line-through text-sm"
            : ""
        }`}
      >
        {currencyPosition === "left" && (
          <span className="text-bold">{currency}</span>
        )}{" "}
        {formatPrice(regularPrice)}{" "}
        {currencyPosition === "right" && (
          <span className="text-bold">{currency}</span>
        )}
      </span>
    </span>
  );
};

export default RenderPrice;
