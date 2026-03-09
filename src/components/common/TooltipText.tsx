export const TOOLTIPS: Record<string, string | React.JSX.Element> = {
  DELIVERY_TYPE: (
    <p>
      Select how the order will be received: Deliver to customer's home, they
      will pick it up, or it's a delivery for someone special.
      <br />
      <strong>Question:</strong>
      <i>
        Should we deliver it to you, you will pick it up, or send it to someone
        else?
      </i>
    </p>
  ),
  CHOSEN_DELIVERY: (
    <p>
      Specify the delivery option selected by the customer.
      <br />
      <strong>Note:</strong>
      <i> This reflects the choice made from the available delivery types.</i>
    </p>
  ),
  CUSTOMER_NAME: (
    <p>
      Enter the name of the person ordering with us.
      <br />
      <strong>Question:</strong>
      <i>
        Could you please tell me your name for me to add to the order record?
      </i>
    </p>
  ),
  CUSTOMER_PHONE: (
    <p>
      Enter the mobile phone number of the person ordering with us.
      <br />
      <strong>Question:</strong>
      <i>
        Could you please tell me your mobile number for me to add to the order
        record?
      </i>
    </p>
  ),
  WHATSAPP_NUMBER: (
    <p>
      Enter the WhatsApp number of the person ordering with us if customer is on
      call. If yes, tick the checkbox. If connected with WhatsApp, enter their
      WhatsApp number.
      <br />
      <strong>Question:</strong>
      <i>
        Is your WhatsApp on this number or another one? Please include country
        code if different.
      </i>
    </p>
  ),
  BUILDING_APARTMENT: (
    <p>
      Enter the building name or building number of the person ordering with us.
      Enter the Apartment Number (Flat Number) as well.
      <br />
      <strong>Question:</strong>
      <i>
        For home delivery purposes, could you please provide the building name
        or building number along with the apartment number for placing the
        order?
      </i>
    </p>
  ),
  MAP_LOCATION_LINK: (
    <p>
      Enter the map location URL for the customer.
      <br />
      <strong>Tip:</strong>
      <i>
        Ask the customer to share their exact location using a Google Maps link.
        This can be easily obtained from the Google Maps app by tapping "Share
        location."
      </i>
    </p>
  ),
  STREET_LANDMARK: (
    <p>
      Enter the street address with necessary landmark information.
      <br />
      <strong>Question:</strong>
      <i>
        Could you please provide the street address along with any nearby
        landmark to help with the delivery?
      </i>
    </p>
  ),
  CITY: (
    <p>
      Ask the customer to share the city where they want to place their order.
      <br />
      <strong>Question:</strong>
      <i>
        Could you please tell me the city where you would like to place your
        order?
      </i>
    </p>
  ),
  AREA: (
    <p>
      Ask the customer to share the area in the city where they want to place
      their order.
      <br />
      <strong>Question:</strong>
      <i>
        Could you please tell me the area within the city where you would like
        to place your order to help with the delivery?
      </i>
    </p>
  ),
};
