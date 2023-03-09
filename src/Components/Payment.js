import { React, useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./payment.css";
import { app } from "../Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import VanillaTilt from "vanilla-tilt";
import chip from "../imgs/chip.png";
import american from "../imgs/american.png";
import visa from "../imgs/visa2.png";
import master from "../imgs/master.png";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

function Payment() {
  const [user, setUser] = useState([]);
  const [Country, setCountry] = useState("");
  const [Name, setName] = useState("");
  const [Number, setNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [Address, setAddress] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [NumberError, setNumberError] = useState("");
  const [CountryError, setCountryError] = useState("");
  const [NameError, setNameError] = useState("");
  const [AddressError, setAddressError] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [cardName, setcardName] = useState("");
  const [cardNumber, setcardNumber] = useState();
  const [cardCVV, setcardCVV] = useState();
  const [cardEXP, setcardEXP] = useState("");
  const tiltRef = useRef(null);

  const handleCountry = (event) => {
    setCountry(event.target.value);
  };
  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleNumber = (event) => {
    setNumber(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const radioChange = (event) => {
    setPaymentMode(event.target.value);
  };

  // VALIDATION

  const handleEmailBlur = (event) => {
    if (
      event.target.value === "" ||
      !event.target.value.includes("@") ||
      !event.target.value.includes(".com")
    ) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleNumberBlur = (event) => {
    if (event.target.value === "") {
      setNumberError("Please enter a valid contact number.");
    } else if (event.target.value.includes("+")) {
      setNumberError("Country code isn't required.");
    } else {
      setNumberError("");
    }
  };

  const handleCountryBlur = (event) => {
    if (event.target.value === "") {
      setCountryError("Please enter your Country's name.");
    } else {
      setCountryError("");
    }
  };

  const handleNameBlur = (event) => {
    if (event.target.value === "") {
      setNameError("Please enter your name.");
    } else {
      setNameError("");
    }
  };

  const handleAddressBlur = (event) => {
    if (event.target.value === "") {
      setAddressError("Please enter your address.");
    } else {
      setAddressError("");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    VanillaTilt.init(tiltRef.current, {
      max: 10,
      speed: 100,
      glare: true,
      "max-glare": 0.3,
      transition: true,
      easing: "ease-out",
    });
  }, []);

  const TotalAmount = localStorage.getItem("TotalAmount");

  const AddUserData = async () => {
    try {
      await addDoc(collection(db, "Users"), {
        name: Name,
        mail: Email,
        number: Number,
        country: Country,
        address: Address,
      });
    } catch (e) {
      console.error(e);
    }
  };

  function detectCreditCardType(cardNumber) {
    // Visa
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
      return "Visa";
    }
    // Mastercard
    if (/^5[1-5][0-9]{14}$/.test(cardNumber)) {
      return "Mastercard";
    }
    // American Express
    if (/^3[47][0-9]{13}$/.test(cardNumber)) {
      return "American Express";
    }
    // Unknown card type
    return "Unknown";
  }

  const accName = (event) => {
    setcardName(event.target.value);
  };

  const accNumber = (event) => {
    setcardNumber(event.target.value);
  };

  const accCVV = (event) => {
    setcardCVV(event.target.value);
  };

  const accEXP = (event) => {
    setcardEXP(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="more-data">
          <div className="shipping-data">
            <div className="shipping-head">Shipping details</div>
            <div className="user-data-form">
              <div className="country">
                <p className="country-name">Country*</p>
                <input
                  type="text"
                  placeholder="India"
                  onChange={handleCountry}
                  onBlur={handleCountryBlur}
                  value={Country}
                  disabled={isDisabled}
                  required
                />
                {CountryError && (
                  <div className="error-message">{CountryError}</div>
                )}
              </div>
              <div className="user-name">
                <p className="user-fullname">Name*</p>
                <input
                  type="text"
                  placeholder="Full name"
                  onChange={handleName}
                  onBlur={handleNameBlur}
                  value={Name}
                  disabled={isDisabled}
                  required
                />
                {NameError && <div className="error-message">{NameError}</div>}
              </div>
              <div className="user-contact">
                <p className="user-number">Contact Number*</p>
                <input
                  type="text"
                  placeholder="Number"
                  onChange={handleNumber}
                  onBlur={handleNumberBlur}
                  value={Number}
                  disabled={isDisabled}
                  required
                />
                {NumberError && (
                  <div className="error-message">{NumberError}</div>
                )}
              </div>
              <div className="user-email">
                <p className="user-fullname">Email address*</p>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={handleEmail}
                  onBlur={handleEmailBlur}
                  value={Email}
                  disabled={isDisabled}
                  required
                />
                {emailError && (
                  <div className="error-message">{emailError}</div>
                )}
              </div>
              <div className="user-address">
                <p className="user-fulladdress">Home Address*</p>
                <input
                  type="text"
                  placeholder="Address"
                  onBlur={handleAddressBlur}
                  onChange={handleAddress}
                  value={Address}
                  disabled={isDisabled}
                  required
                />
                {AddressError && (
                  <div className="error-message">{AddressError}</div>
                )}
              </div>
              <button
                onClick={() => {
                  AddUserData();
                  setDisabled(true);
                }}
                className="save-address"
                disabled={
                  !Name || !Country || !Email || !Address || !Number
                    ? true
                    : false
                }
              >
                Save
              </button>
            </div>
          </div>
          <div className="payment-data">
            <div className="payment-option">
              <p className="payment-method">Choose your payment method</p>
              <div className="choose-option">
                <div className="cod">
                  <input
                    type="radio"
                    name="payment-method"
                    onChange={radioChange}
                    value="COD"
                    defaultChecked
                  />
                  Cash on delivery (COD)
                </div>
                <div className="credit">
                  <input
                    type="radio"
                    name="payment-method"
                    onChange={radioChange}
                    value="Credit"
                  />
                  Credit/Debit card
                </div>
                <div className="upi">
                  <input
                    type="radio"
                    name="payment-method"
                    onChange={radioChange}
                    value="UPI"
                  />
                  UPI Payment
                </div>
              </div>
              <div className="online-card-section">
                <div ref={tiltRef} className="credit-body">
                  <div className="first-layer">
                    <img src={chip} className="credit-chip" />
                    <img src={visa} className="card-company" />
                  </div>
                  <div className="middle-layer">
                    <p className="account-number">
                      {cardNumber && cardNumber.slice(0, 16) + ""}
                    </p>
                  </div>
                  <div className="last-layer">
                    <p className="holder-name">{(cardName.toUpperCase()).slice(0,15)}</p>
                    <p className="cvv-number">
                      {cardCVV && cardCVV.slice(0, 3) + ""}
                    </p>
                    <p className="exp-date">{cardEXP && cardEXP.slice(0,2) + "/" + cardEXP.slice(2,4)}</p>
                  </div>
                </div>
                <div className="online-card-form">
                  <p className="card-head-details">Card Details</p>
                  <div className="acc-number">
                    <p className="acc-number-head">Account Number*</p>
                    <input
                      type="number"
                      className="acc-number-inp"
                      onChange={accNumber}
                      placeholder="1234-4567-8901-2345"
                      value={cardNumber}
                      maxLength="16"
                    />
                  </div>
                  <div className="acc-name">
                    <p className="acc-name-head">Card Holder's Name*</p>
                    <input
                      type="text"
                      className="acc-name-inp"
                      onChange={accName}
                      value={cardName}
                      placeholder="Ex: John Doe"
                    />
                  </div>
                  <div className="acc-cvv">
                    <p className="acc-cvv-head">CVV Number*</p>
                    <input
                      type="number"
                      className="acc-cvv-inp"
                      onChange={accCVV}
                      placeholder="123"
                      maxLength="3"
                      value={cardCVV}
                    />
                  </div>
                  <div className="acc-exp">
                    <p className="acc-exp-head">Expiry Date*</p>
                    <input
                      type="number"
                      className="acc-exp-inp"
                      onChange={accEXP}
                      placeholder="01/20"
                      value={cardEXP}
                    />
                  </div>
                </div>
              </div>
              <div className="paying-data"></div>
              <div className="total-amount">
                <p className="subtotal-amount">Total Amount :</p>
                <p className="main-amount">${TotalAmount}</p>
              </div>
              <button className="confirm-btn">Place Order</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Payment;
