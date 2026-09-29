"use client";

import { useState } from "react";

import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import {
  Container,
  Text,
} from "@/components";

export default function ContactPage() {
  // =========================
  // FORM STATE
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Enquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10 digit phone number";
    }
    // Email
    if (
      formData.email &&
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      newErrors.email =
        "Enter a valid email address";
    }
    // Message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const message = `
*New Contact Form*

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
`;

  const whatsappNumber = "9885161899"; // Your WhatsApp number

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

  // =========================
  // CALL FUNCTION
  // =========================

  const handleCallPrimary = () => {
    window.location.href = "tel:+919885161899";
  };

  const handleCallSecondary = () => {
    window.location.href = "tel:+919849845670";
  };
  const outlets = [
    {
      id: 1,
      branch: "Guntur Branch",
      city: "Guntur",
      address:
        "Old Club Rd, Opp. Karumuri Hospitals, Gunturvari Thota, Kothapeta, Andhra Pradesh 522001",
      map: "https://maps.app.goo.gl/iEdbdRRpacaRmaCz8",
    },
    {
      id: 2,
      branch: "Ponnur Branch",
      city: "Ponnur",
      address: "Ponnur, Andhra Pradesh",
      map: "https://maps.app.goo.gl/e3XEWELRcyBWGuBy8",
    },
    {
      id: 3,
      branch: "Chirala Branch",
      city: "Chirala",
      address: "Chirala, Andhra Pradesh",
      map: "https://maps.app.goo.gl/8kzq8wfrnkkYUbjE6",
    },
    {
      id: 4,
      branch: "Ongole Branch",
      city: "Ongole",
      address: "Ongole, Andhra Pradesh",
      map: "https://maps.app.goo.gl/9wcvJqcPDT1dgthM7",
    },
    {
      id: 5,
      branch: "Vijayawada Branch",
      city: "Vijayawada",
      address: "Vijayawada, Andhra Pradesh",
      map: "https://maps.app.goo.gl/fqsdaNZ6SXz21YxH8",
    },
    {
      id: 6,
      branch: "Eluru Branch",
      city: "Eluru",
      address: "Eluru, Andhra Pradesh",
      map: "https://maps.app.goo.gl/bFfZzaKd9KWtA7K89",
    },
    {
      id: 7,
      branch: "Kakinada Branch",
      city: "Kakinada",
      address: "Kakinada, Andhra Pradesh",
      map: "https://maps.app.goo.gl/ikKyQommvwWzPzeHA",
    },
    {
      id: 8,
      branch: "Tirupati Branch",
      city: "Tirupati",
      address: "Tirupati, Andhra Pradesh",
      map: "https://maps.app.goo.gl/tc7EgETxwXp1BPyg9",
    },
  ];

  return (
    <section className="py-12 md:py-12">
      <Container className="max-w-[1700px] px-6 lg:px-10 xl:px-12">
        <div className="mb-10 text-center">
          <Text
            variant="h2"
            className="mb-2 text-black"
          >
            Get in Touch
          </Text>

          <Text variant="bodySmall">
            We typically respond within
            2 hours during business
            hours
          </Text>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <Text
              variant="h5"
              className="mb-5 text-black"
            >
              Send Us a Message
            </Text>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border px-4 outline-none focus:border-[var(--color-text-primary)]"
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border px-4 outline-none focus:border-[var(--color-text-primary)]"
                  />

                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border px-4 outline-none focus:border-[var(--color-text-primary)]"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Subject
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border px-4 outline-none focus:border-[var(--color-text-primary)]"
                >
                  <option>
                    General Enquiry
                  </option>

                  <option>
                    Product Enquiry
                  </option>

                  <option>
                    Order Support
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Message *
                </label>

                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-4 outline-none focus:border-[var(--color-text-primary)]"
                />

                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-[var(--color-accent)] font-medium text-white transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {/* Phone */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Phone
                    size={18}
                    className="text-[var(--color-text-primary)]"
                  />
                </div>

                <div>
                  <Text
                    variant="h6"
                    className="mb-1 text-black"
                  >
                    Call Us
                  </Text>

                  <button
                    onClick={handleCallPrimary}
                    className="block text-left text-sm text-gray-600 hover:text-[var(--color-text-primary)]"
                  >
                    +91 9885161899
                  </button>

                  <button
                    onClick={handleCallSecondary}
                    className="block text-left text-sm text-gray-600 hover:text-[var(--color-text-primary)]"
                  >
                    +91 9849845670
                  </button>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Mail
                    size={18}
                    className="text-[var(--color-text-primary)]"
                  />
                </div>

                <div>
                  <Text
                    variant="h6"
                    className="mb-1 text-black"
                  >
                    Email
                  </Text>

                  <a
                    href="mailto:surgicalworldgnt@gmail.com"
                    className="text-sm text-gray-600 hover:text-[var(--color-text-primary)]"
                  >
                    surgicalworldgnt@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            {/* Our Outlets */}
{/* Our Outlets */}
<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <div className="flex gap-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
      <MapPin
        size={18}
        className="text-[var(--color-text-primary)]"
      />
    </div>

    <div className="w-full">
      <Text
        variant="h6"
        className="mb-4 text-black"
      >
        Our Outlets
      </Text>

      <div className="grid gap-3 sm:grid-cols-2">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="rounded-lg border p-3"
          >
            {outlet.map?.startsWith("http") ? (
              <a
                href={outlet.map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block cursor-pointer font-semibold text-[var(--color-text-primary)] transition-colors hover:text-blue-600 hover:underline"
              >
                {outlet.city}
              </a>
            ) : (
              <p className="font-semibold text-[var(--color-text-primary)]">
                {outlet.city}
              </p>
            )}
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {outlet.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

            {/* Google Map */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <iframe
                title="SURGICAL WORLD Location"
                src="https://maps.google.com/maps?q=Old%20Club%20Rd%20Guntur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                loading="lazy"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}