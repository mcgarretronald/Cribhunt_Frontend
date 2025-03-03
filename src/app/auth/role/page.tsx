"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Role() {
    const router = useRouter();

    const handleSelectRole = (selectedRole: "landlord" | "renter") => {
        const isLandlord = selectedRole === "landlord";
        const isRenter = selectedRole === "renter";

        // Navigate to register page with role state
        router.push(`/auth/register?is_landlord=${isLandlord}&is_renter=${isRenter}`);
    };

    return (
        <div className="relative flex justify-center items-center text-center h-screen bg-gradient-to-br from-[#E6FFF1] to-[#FFFFFF]">

            {/* Blurry Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C767] opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#03624C] opacity-20 rounded-full blur-3xl"></div>

            <div className="md:border border-[#00C767] rounded-4xl p-5 md:shadow-2xl bg-white z-10">
                <Image
                    src="/images/welcome_image.svg"
                    width={300}
                    height={400}
                    alt="Welcome"
                />
                <div className="lg:space-y-8 space-y-16">
                    <div className="text-left">
                        <h1 className="text-2xl mb-2 font-semibold">Select Role</h1>
                        <p className="text-sm font-light">Select as Property Seeker if you are looking for a house</p>
                        <p className="text-sm font-light">Select as Property Owner if you own property</p>
                    </div>
                    <div className="space-y-5 flex flex-col text-sm">
                        <button
                            onClick={() => handleSelectRole("renter")}
                            className="py-3 px-10 shadow-2xl bg-[#DAFCE4] border rounded-md border-[#00C767]"
                        >
                            Property Seeker
                        </button>
                        <button
                            onClick={() => handleSelectRole("landlord")}
                            className="py-3 px-10 border border-[#03624C] shadow-2xl bg-[#03624C] text-white rounded-md"
                        >
                            Property Owner
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
