"use client";
import React, { useState, useEffect } from "react";

const DATE_OPTIONS = [
    { value: "12th March", label: "12th March 2026" },
    { value: "13th March", label: "13th March 2026" },
    { value: "14th March", label: "14th March 2026" },
    { value: "15th March", label: "15th March 2026" },
];

export default function AccommodationForm({ user }) {
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        fromDate: "",
        toDate: "",
        gender: "",
    });
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [registered, setRegistered] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);
    const [message, setMessage] = useState(null);

    // Check if already registered on mount
    useEffect(() => {
        const checkRegistration = async () => {
            if (!user?.uniqueId) {
                setChecking(false);
                return;
            }
            try {
                const res = await fetch(`/api/accommodation?uniqueId=${encodeURIComponent(user.uniqueId)}`);
                const data = await res.json();
                if (data.success && data.registered) {
                    setRegistered(true);
                    setRegisteredData(data.data);
                }
            } catch (err) {
                console.error("Failed to check accommodation status:", err);
            } finally {
                setChecking(false);
            }
        };
        checkRegistration();
    }, [user?.uniqueId]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!formData.address || !formData.city || !formData.fromDate || !formData.toDate || !formData.gender) {
            setMessage({ type: "error", text: "All fields are required." });
            return;
        }

        const fromIdx = DATE_OPTIONS.findIndex(d => d.value === formData.fromDate);
        const toIdx = DATE_OPTIONS.findIndex(d => d.value === formData.toDate);
        if (toIdx < fromIdx) {
            setMessage({ type: "error", text: "To date cannot be before From date." });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/accommodation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uniqueId: user.uniqueId,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    college: user.college,
                    year: user.year,
                    fromDate: formData.fromDate,
                    toDate: formData.toDate,
                    city: formData.city,
                    address: formData.address,
                    gender: formData.gender,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: "Accommodation registered successfully!" });
                setRegistered(true);
                setRegisteredData({
                    fromDate: formData.fromDate,
                    toDate: formData.toDate,
                    city: formData.city,
                    address: formData.address,
                    gender: formData.gender,
                });
            } else {
                setMessage({ type: "error", text: data.message || "Registration failed." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const selectClasses = "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 font-circular-web text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 transition-colors appearance-none cursor-pointer [color-scheme:dark]";

    const supportSection = (
        <div className="mt-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md p-5">
            <h3 className="font-general text-xs text-gray-400 uppercase tracking-wider mb-3">Accommodation Support</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="tel:+919531967544" className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-circular-web text-sm text-white">Siddharth</p>
                        <p className="font-general text-xs text-gray-400">+91 9531967544</p>
                    </div>
                </a>
                <a href="tel:+918838401957" className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-circular-web text-sm text-white">Kanishka</p>
                        <p className="font-general text-xs text-gray-400">+91 8838401957</p>
                    </div>
                </a>
            </div>
        </div>
    );

    // Loading state
    if (checking) {
        return (
            <section className="min-h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-general text-sm uppercase tracking-wider text-gray-400">Checking accommodation status...</p>
                </div>
            </section>
        );
    }

    // Already registered
    if (registered) {
        return (
            <>
                <section className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-400">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white"><b>Accommodation</b></h2>
                            <p className="font-general text-xs text-emerald-400 uppercase tracking-wider mt-1">Registered</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <p className="font-general text-xs text-gray-500 uppercase tracking-wider mb-1">From Date</p>
                            <p className="font-circular-web text-white">{registeredData?.fromDate || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <p className="font-general text-xs text-gray-500 uppercase tracking-wider mb-1">To Date</p>
                            <p className="font-circular-web text-white">{registeredData?.toDate || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <p className="font-general text-xs text-gray-500 uppercase tracking-wider mb-1">City</p>
                            <p className="font-circular-web text-white">{registeredData?.city || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <p className="font-general text-xs text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                            <p className="font-circular-web text-white">{registeredData?.gender || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:col-span-2">
                            <p className="font-general text-xs text-gray-500 uppercase tracking-wider mb-1">Residential Address</p>
                            <p className="font-circular-web text-white">{registeredData?.address || "—"}</p>
                        </div>
                    </div>
                </section>
                {supportSection}
            </>
        );
    }

    // Registration form
    return (
        <>
            <section className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-md p-6">
                <h2 className="special-font text-2xl md:text-3xl uppercase text-white mb-6"><b>Accommodation</b></h2>

                {message && (
                    <div className={`rounded-lg p-3 border mb-4 ${message.type === "success"
                        ? "bg-emerald-500/10 border-emerald-400/30"
                        : "bg-red-500/10 border-red-400/30"
                        }`}>
                        <p className={`font-circular-web text-sm ${message.type === "success" ? "text-emerald-300" : "text-red-300"
                            }`}>
                            {message.text}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-general text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Residential Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter your residential address"
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 font-circular-web text-sm text-white placeholder-gray-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block font-general text-xs text-gray-400 uppercase tracking-wider mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 font-circular-web text-sm text-white placeholder-gray-600 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-general text-xs text-gray-400 uppercase tracking-wider mb-2">
                                From Date
                            </label>
                            <select
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                                className={selectClasses}
                            >
                                <option value="" disabled>Select date</option>
                                {DATE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-general text-xs text-gray-400 uppercase tracking-wider mb-2">
                                To Date
                            </label>
                            <select
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                                className={selectClasses}
                            >
                                <option value="" disabled>Select date</option>
                                {DATE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-general text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={selectClasses}
                        >
                            <option value="" disabled>Select gender</option>
                            <option value="Male" className="bg-gray-900">Male</option>
                            <option value="Female" className="bg-gray-900">Female</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-general text-xs uppercase tracking-widest text-white transition-all duration-300 border ${loading
                            ? "border-gray-500/30 bg-gray-600/30 cursor-not-allowed opacity-60"
                            : "border-blue-400/30 bg-blue-500/20 hover:bg-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98] cursor-pointer"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : (
                            "Register for Accommodation"
                        )}
                    </button>
                </form>
            </section>
            {supportSection}
        </>
    );
}
