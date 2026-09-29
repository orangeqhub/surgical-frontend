"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutInput from "./CheckoutInput";
import Text from "@/components/ui/Text";

import useAddress from "@/hooks/useAddress";
import useShippingServiceability from "@/hooks/useDelivery";

export default function CheckoutForm() {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [serviceabilityError, setServiceabilityError] = useState("");

  const {
    formData,
    addresses,
    selectedAddress,
    setSelectedAddress,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchAddress,
    resetForm,
    submitLoading,
    deleteLoading,
    apiError,
    isEdit,
  } = useAddress();

  const { checkServiceability, loading: checkingPincode } =
    useShippingServiceability();

  const shouldShowForm = addresses?.length === 0 || showForm || isEdit;

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    handleChange({
      target: {
        name,
        value: type === "checkbox" ? checked : value,
      },
    });

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleContinuePayment = async () => {
    setServiceabilityError("");

    if (!selectedAddress) {
      alert("Please select an address first");
      return;
    }

    if (!selectedAddress.pincode) {
      setServiceabilityError("Selected address is missing a valid PIN code.");
      return;
    }

    const result = await checkServiceability(selectedAddress.pincode);

    if (result && (result.delivery_available === true || result.data?.delivery_available === true)) {
      localStorage.setItem(
        "selected_address",
        JSON.stringify(selectedAddress)
      );

      router.push("/payment");
    } else {
      setServiceabilityError(
        `Delivery is not available for this address (PIN Code: ${selectedAddress.pincode}). Please select or add another address.`
      );
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full Name is required";
    }

    const cleanedPhone = formData.phone?.replace(/\D/g, "") || "";
    if (!cleanedPhone) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(cleanedPhone)) {
      newErrors.phone = "Phone Number must contain exactly 10 digits";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const address = formData.address_line1?.trim() || "";
    if (!address) {
      newErrors.address_line1 = "Address Line 1 is required";
    } else if (address.length < 15) {
      newErrors.address_line1 = "Address must contain at least 15 characters";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state?.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode?.trim()) {
      newErrors.pincode = "PIN Code is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "PIN Code must be 6 digits";
    }

    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const response = await handleSubmit(e);

    if (response !== false) {
      setShowForm(false);
      resetForm();
      setValidationErrors({});
    }
  };

  useEffect(() => {
    if (addresses?.length === 1 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
      localStorage.setItem(
        "selected_address",
        JSON.stringify(addresses[0])
      );
    }
  }, [addresses, selectedAddress, setSelectedAddress]);
  console.log("vgsgvsgvg")

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <Text variant="h5" className="mb-6 text-black">
        Billing & Shipping Address
      </Text>

      {/* SAVED ADDRESSES */}
      {addresses?.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Text variant="h6" className="text-black">
              Saved Addresses
            </Text>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
                setSelectedAddress(null);
                setValidationErrors({});
                setServiceabilityError("");
              }}
              className="rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
            >
              + Add New Address
            </button>
          </div>

          <div className="space-y-4">
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address?.id;

              return (
                <div
                  key={address?.id}
                  onClick={() => {
                    setSelectedAddress(address);
                    setServiceabilityError("");
                    localStorage.setItem(
                      "selected_address",
                      JSON.stringify(address)
                    );
                  }}
                  className={`cursor-pointer rounded-xl border p-4 transition duration-200 ${
                    isSelected
                      ? "border-green-500 bg-green-50/60"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 w-full overflow-hidden">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-black truncate">
                          {address?.full_name}
                        </h3>
                        {address?.address_type && (
                          <span className="capitalize text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 shrink-0">
                            {address?.address_type}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 break-words leading-relaxed">
                        {address?.address_line1}
                      </p>

                      <p className="text-sm text-gray-600 truncate">
                        {address?.city}, {address?.state} - {address?.pincode}
                      </p>

                      <p className="text-sm text-gray-600 font-medium">
                        📞 {address?.phone}
                      </p>
                    </div>

                    <div className="w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 flex items-center justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowForm(true);
                          fetchAddress(address?.id);
                          setValidationErrors({});
                          setServiceabilityError("");
                        }}
                        className="flex-1 md:flex-initial text-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black bg-white hover:bg-gray-50 active:scale-95 transition-transform"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deleteLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(address?.id);
                        }}
                        className="flex-1 md:flex-initial text-center rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 bg-white hover:bg-red-50 disabled:opacity-50 active:scale-95 transition-transform"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SERVICEABILITY ERROR DISPLAY */}
          {serviceabilityError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
              ⚠️ {serviceabilityError}
            </div>
          )}

          {(selectedAddress || addresses?.length === 1) && (
            <button
              type="button"
              disabled={checkingPincode}
              onClick={handleContinuePayment}
              className="mt-6 h-12 w-full rounded-lg bg-green-500 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-70 transition-all"
            >
              {checkingPincode
                ? "Checking Serviceability..."
                : "Continue To Payment →"}
            </button>
          )}
        </div>
      )}

      {/* NEW/EDIT ADDRESS FORM */}
      {shouldShowForm && (
        <>
          {addresses?.length > 0 && <div className="my-8 border-t pt-8" />}

          <form onSubmit={handleAddressSubmit}>
            <div className="mb-5 flex items-center justify-between">
              <Text variant="h6" className="text-black">
                {isEdit ? "Edit Address" : "Add New Address"}
              </Text>

              {addresses?.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                    setValidationErrors({});
                    setServiceabilityError("");
                  }}
                  className="text-sm font-medium text-red-500"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <CheckoutInput
                  label="Full Name *"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFieldChange}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.full_name}
                </p>
              </div>

              <div>
                <CheckoutInput
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    handleFieldChange({
                      target: {
                        name: "phone",
                        value: onlyNumbers.slice(0, 10),
                      },
                    });
                  }}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.phone}
                </p>
              </div>

              <div>
                <CheckoutInput
                  label="Email Address *"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleFieldChange}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.email}
                </p>
              </div>

              <div>
                <CheckoutInput
                  label="Address Line 1 *"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleFieldChange}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.address_line1}
                </p>
              </div>

              <div>
                <CheckoutInput
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleFieldChange}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.city}
                </p>
              </div>

              <div>
                <CheckoutInput
                  label="State *"
                  name="state"
                  value={formData.state}
                  onChange={handleFieldChange}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.state}
                </p>
              </div>

              <div>
                <CheckoutInput
                  label="PIN Code *"
                  name="pincode"
                  value={formData.pincode}
                  maxLength={6}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    handleFieldChange({
                      target: {
                        name: "pincode",
                        value: onlyNumbers.slice(0, 6),
                      },
                    });
                  }}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.pincode}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address Type
                </label>
                <select
                  name="address_type"
                  value={formData.address_type}
                  onChange={handleFieldChange}
                  className="h-12 w-full rounded-lg border border-gray-300 px-3 text-sm"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleFieldChange}
                  className="h-4 w-4"
                />
                <label className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            {apiError && (
              <p className="mt-4 text-sm text-red-500">{apiError}</p>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="mt-8 h-12 w-full rounded-lg bg-black text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
            >
              {submitLoading
                ? "Saving..."
                : isEdit
                ? "Update Address"
                : "Save Address"}
            </button>
          </form>
        </>
      )}

      <p className="mt-4 text-center text-xs text-gray-500">
        Need Help? Call us: +91 98765 43210
      </p>
    </div>
  );
}