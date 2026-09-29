"use client";

import { useEffect, useState } from "react";

import { createAddressService,
  
  getAddressesService,
  deleteAddressService,
  updateAddressService, 
  getAddressServicebyid} from "@/services/address.service";

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  address_type: "home",
  is_default: false,
};

export default function useAddress() {
  const [formData, setFormData] = useState(initialState);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [apiError, setApiError] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // Validations
  // =========================
  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length < 3) {
      newErrors.full_name = "Minimum 3 characters required";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid Indian phone number";
    }

    // Address Line 1
    if (!formData.address_line1.trim()) {
      newErrors.address_line1 = "Address line 1 is required";
    } else if (formData.address_line1.length < 5) {
      newErrors.address_line1 = "Address is too short";
    }

    // City
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Pincode
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid pincode";
    }

    // Address Type
    if (!formData.address_type.trim()) {
      newErrors.address_type = "Address type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Create / Update Address
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccess(false);

    if (!validate()) return;

    try {
      setSubmitLoading(true);

      if (isEdit && editingAddressId) {
        await updateAddressService(editingAddressId, formData);
      } else {
        await createAddressService(formData);
      }

      await fetchAddresses();

      setSuccess(true);

      resetForm();
    } catch (error) {
      console.error(error);

      setApiError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // =========================
  // Fetch All Addresses
  // =========================
  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAddressesService();

      setAddresses(response?.data || response || []);
    } catch (error) {
      console.error(error);

      setApiError("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Single Address
  // =========================
  const fetchAddress = async (addressId) => {
    try {
      setLoading(true);

      const response = await getAddressServicebyid(addressId);

      const addressData = response?.data || response;

      setSelectedAddress(addressData);

      setFormData({
        full_name: addressData?.full_name || "",
        email: addressData?.email || "",
        phone: addressData?.phone || "",
        address_line1: addressData?.address_line1 || "",
        address_line2: addressData?.address_line2 || "",
        landmark: addressData?.landmark || "",
        city: addressData?.city || "",
        state: addressData?.state || "",
        pincode: addressData?.pincode || "",
        country: addressData?.country || "India",
        address_type: addressData?.address_type || "home",
        is_default: addressData?.is_default || false,
      });

      setIsEdit(true);

      setEditingAddressId(addressId);
    } catch (error) {
      console.error(error);

      setApiError("Failed to fetch address");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Address
  // =========================
  const handleDelete = async (addressId) => {
    try {
      setDeleteLoading(true);

      await deleteAddressService(addressId);

      await fetchAddresses();
    } catch (error) {
      console.error(error);

      setApiError(
        error?.response?.data?.message ||
          "Failed to delete address"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================
  // Reset Form
  // =========================
  const resetForm = () => {
    setFormData(initialState);

    setErrors({});

    setIsEdit(false);

    setEditingAddressId(null);

    setSelectedAddress(null);
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
  // States
  formData,
  addresses,
  selectedAddress,
  errors,
  loading,
  submitLoading,
  deleteLoading,
  success,
  apiError,
  isEdit,

  // Functions
  handleChange,
  handleSubmit,
  fetchAddresses,
  fetchAddress,
  handleDelete,
 resetForm,
  setFormData,
  setSelectedAddress, // ADD THIS
};
}