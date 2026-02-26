"use client";
import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { IoClose, IoCloudUpload, IoEye, IoCheckmarkCircle, IoRefresh } from "react-icons/io5";
import { authService } from "@/services/authService";

const ID_CARD_ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
const ID_CARD_MAX_SIZE = 5 * 1024 * 1024; // 5MB

const BONAFIDE_ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
const BONAFIDE_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const IdCardSection = forwardRef(({ user, onRefresh }, ref) => {
    const fileInputRef = useRef(null);
    const bonafideFileInputRef = useRef(null);

    // Expose triggerUpload and triggerBonafideUpload to parent via ref
    useImperativeHandle(ref, () => ({
        triggerUpload: () => fileInputRef.current?.click(),
        triggerBonafideUpload: () => bonafideFileInputRef.current?.click()
    }));

    // === ID Card Upload State ===
    const [isUploading, setIsUploading] = useState(false);
    const [stagedFile, setStagedFile] = useState(null);
    const [stagedPreviewUrl, setStagedPreviewUrl] = useState(null);
    const [stagedFileType, setStagedFileType] = useState(null);

    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewPreviewUrl, setViewPreviewUrl] = useState(null);
    const [viewFileType, setViewFileType] = useState(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    // === Bonafide Upload State ===
    const [isBonafideUploading, setIsBonafideUploading] = useState(false);
    const [stagedBonafideFile, setStagedBonafideFile] = useState(null);
    const [stagedBonafidePreviewUrl, setStagedBonafidePreviewUrl] = useState(null);
    const [stagedBonafideFileType, setStagedBonafideFileType] = useState(null);

    const [isBonafideViewerOpen, setIsBonafideViewerOpen] = useState(false);
    const [bonafideViewPreviewUrl, setBonafideViewPreviewUrl] = useState(null);
    const [bonafideViewFileType, setBonafideViewFileType] = useState(null);
    const [isBonafideViewLoading, setIsBonafideViewLoading] = useState(false);

    const hasUploadedIdCard = !!user?.idCardUrl;
    const hasUploadedBonafide = !!user?.bonafideUrl;

    // ==================== ID CARD HANDLERS ====================
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";

        if (!ID_CARD_ALLOWED_TYPES.includes(file.type)) {
            alert("Invalid file type. Please upload a PDF, JPG, PNG, or WebP file.");
            return;
        }

        if (file.size > ID_CARD_MAX_SIZE) {
            alert("File is too large. Maximum allowed size is 5MB.");
            return;
        }

        const blobUrl = URL.createObjectURL(file);
        const fileType = file.type === "application/pdf" ? "pdf" : "image";

        setStagedFile(file);
        setStagedPreviewUrl(blobUrl);
        setStagedFileType(fileType);
    };

    const cancelStaged = () => {
        if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
        setStagedFile(null);
        setStagedPreviewUrl(null);
        setStagedFileType(null);
    };

    const confirmUpload = async () => {
        if (!stagedFile) return;
        setIsUploading(true);
        try {
            await authService.uploadIdCard(stagedFile);
            cancelStaged();
            alert("ID card uploaded successfully!");
            if (onRefresh) await onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to upload ID card. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleViewId = async () => {
        if (!user?.idCardUrl) return;
        setIsViewLoading(true);
        try {
            const response = await authService.getIdCardFile(user.idCardUrl);
            const blob = response.data;
            const blobUrl = URL.createObjectURL(blob);
            const type = blob.type === "application/pdf" ? "pdf" : "image";
            setViewPreviewUrl(blobUrl);
            setViewFileType(type);
            setIsViewerOpen(true);
        } catch (err) {
            alert("Failed to load ID card. Please try again.");
        } finally {
            setIsViewLoading(false);
        }
    };

    const closeViewer = () => {
        if (viewPreviewUrl) URL.revokeObjectURL(viewPreviewUrl);
        setViewPreviewUrl(null);
        setViewFileType(null);
        setIsViewerOpen(false);
    };

    // ==================== BONAFIDE HANDLERS ====================
    const handleBonafideFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";

        if (!BONAFIDE_ALLOWED_TYPES.includes(file.type)) {
            alert("Invalid file type. Please upload a PDF, JPG, PNG, or WebP file.");
            return;
        }

        if (file.size > BONAFIDE_MAX_SIZE) {
            alert("File is too large. Maximum allowed size is 10MB.");
            return;
        }

        const blobUrl = URL.createObjectURL(file);
        const fileType = file.type === "application/pdf" ? "pdf" : "image";

        setStagedBonafideFile(file);
        setStagedBonafidePreviewUrl(blobUrl);
        setStagedBonafideFileType(fileType);
    };

    const cancelStagedBonafide = () => {
        if (stagedBonafidePreviewUrl) URL.revokeObjectURL(stagedBonafidePreviewUrl);
        setStagedBonafideFile(null);
        setStagedBonafidePreviewUrl(null);
        setStagedBonafideFileType(null);
    };

    const confirmBonafideUpload = async () => {
        if (!stagedBonafideFile) return;
        setIsBonafideUploading(true);
        try {
            await authService.uploadBonafide(stagedBonafideFile);
            cancelStagedBonafide();
            alert("Bonafide certificate uploaded successfully!");
            if (onRefresh) await onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to upload bonafide certificate. Please try again.");
        } finally {
            setIsBonafideUploading(false);
        }
    };

    const handleViewBonafide = async () => {
        if (!user?.bonafideUrl) return;
        setIsBonafideViewLoading(true);
        try {
            const response = await authService.getBonafideFile(user.bonafideUrl);
            const blob = response.data;
            const blobUrl = URL.createObjectURL(blob);
            const type = blob.type === "application/pdf" ? "pdf" : "image";
            setBonafideViewPreviewUrl(blobUrl);
            setBonafideViewFileType(type);
            setIsBonafideViewerOpen(true);
        } catch (err) {
            alert("Failed to load bonafide certificate. Please try again.");
        } finally {
            setIsBonafideViewLoading(false);
        }
    };

    const closeBonafideViewer = () => {
        if (bonafideViewPreviewUrl) URL.revokeObjectURL(bonafideViewPreviewUrl);
        setBonafideViewPreviewUrl(null);
        setBonafideViewFileType(null);
        setIsBonafideViewerOpen(false);
    };

    return (
        <>
            {/* Hidden File Inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFileSelect}
            />
            <input
                ref={bonafideFileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleBonafideFileSelect}
            />

            {/* ==================== ID Card Card ==================== */}
            <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                        <b>ID Card</b>
                    </h2>
                    {hasUploadedIdCard && (
                        <div className="flex items-center gap-1.5 text-green-400 text-sm font-general">
                            <IoCheckmarkCircle className="text-lg" />
                            <span className="hidden sm:inline">ID Card Uploaded</span>
                            <span className="sm:hidden">Uploaded</span>
                        </div>
                    )}
                </div>

                <p className="font-general text-xs text-gray-400 mb-4 uppercase tracking-wide">
                    Upload your college ID card (PDF, JPG, PNG or WebP • Max 5MB)
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {hasUploadedIdCard ? (
                            <>
                                <IoRefresh className="text-lg" />
                                Re-upload
                            </>
                        ) : (
                            <>
                                <IoCloudUpload className="text-lg" />
                                Upload
                            </>
                        )}
                    </button>

                    {hasUploadedIdCard && (
                        <button
                            onClick={handleViewId}
                            disabled={isViewLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IoEye className="text-lg" />
                            {isViewLoading ? "Loading..." : "View ID"}
                        </button>
                    )}
                </div>
            </div>

            {/* ==================== Bonafide Certificate Card ==================== */}
            <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5 mt-6">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                        <b>Bonafide Certificate</b>
                    </h2>
                    {hasUploadedBonafide && (
                        <div className="flex items-center gap-1.5 text-green-400 text-sm font-general">
                            <IoCheckmarkCircle className="text-lg" />
                            <span className="hidden sm:inline">Bonafide Uploaded</span>
                            <span className="sm:hidden">Uploaded</span>
                        </div>
                    )}
                </div>

                <p className="font-general text-xs text-gray-400 mb-4 uppercase tracking-wide">
                    Upload your bonafide certificate (PDF, JPG, PNG or WebP • Max 10MB)
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => bonafideFileInputRef.current?.click()}
                        disabled={isBonafideUploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {hasUploadedBonafide ? (
                            <>
                                <IoRefresh className="text-lg" />
                                Re-upload
                            </>
                        ) : (
                            <>
                                <IoCloudUpload className="text-lg" />
                                Upload
                            </>
                        )}
                    </button>

                    {hasUploadedBonafide && (
                        <button
                            onClick={handleViewBonafide}
                            disabled={isBonafideViewLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IoEye className="text-lg" />
                            {isBonafideViewLoading ? "Loading..." : "View Bonafide"}
                        </button>
                    )}
                </div>
            </div>

            {/* ==================== ID Card Preview / Confirm Overlay ==================== */}
            {stagedFile && typeof window !== "undefined" && ReactDOM.createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={cancelStaged}
                            disabled={isUploading}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        <div className="p-6 pb-3 border-b border-white/5">
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                                <b>Preview ID Card</b>
                            </h2>
                            <p className="font-general text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                Review before uploading
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[200px]">
                            {stagedFileType === "image" ? (
                                <img
                                    src={stagedPreviewUrl}
                                    alt="ID Card Preview"
                                    className="max-w-full max-h-[50vh] object-contain rounded-lg border border-white/10"
                                />
                            ) : (
                                <embed
                                    src={stagedPreviewUrl}
                                    type="application/pdf"
                                    className="w-full h-[50vh] rounded-lg border border-white/10"
                                />
                            )}
                        </div>

                        <div className="border-t border-white/10 p-6 pt-4 bg-black/50 backdrop-blur-md">
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelStaged}
                                    disabled={isUploading}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUpload}
                                    disabled={isUploading}
                                    className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isUploading ? "Uploading..." : "Confirm Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ==================== Bonafide Preview / Confirm Overlay ==================== */}
            {stagedBonafideFile && typeof window !== "undefined" && ReactDOM.createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={cancelStagedBonafide}
                            disabled={isBonafideUploading}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        <div className="p-6 pb-3 border-b border-white/5">
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                                <b>Preview Bonafide</b>
                            </h2>
                            <p className="font-general text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                Review before uploading
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[200px]">
                            {stagedBonafideFileType === "image" ? (
                                <img
                                    src={stagedBonafidePreviewUrl}
                                    alt="Bonafide Preview"
                                    className="max-w-full max-h-[50vh] object-contain rounded-lg border border-white/10"
                                />
                            ) : (
                                <embed
                                    src={stagedBonafidePreviewUrl}
                                    type="application/pdf"
                                    className="w-full h-[50vh] rounded-lg border border-white/10"
                                />
                            )}
                        </div>

                        <div className="border-t border-white/10 p-6 pt-4 bg-black/50 backdrop-blur-md">
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelStagedBonafide}
                                    disabled={isBonafideUploading}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmBonafideUpload}
                                    disabled={isBonafideUploading}
                                    className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isBonafideUploading ? "Uploading..." : "Confirm Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ==================== View ID Card Modal ==================== */}
            {isViewerOpen && typeof window !== "undefined" && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    onClick={closeViewer}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeViewer}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        <div className="p-6 pb-3 border-b border-white/5">
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                                <b>Your ID Card</b>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[300px]">
                            {viewFileType === "image" ? (
                                <img
                                    src={viewPreviewUrl}
                                    alt="ID Card"
                                    className="max-w-full max-h-[60vh] object-contain rounded-lg"
                                />
                            ) : (
                                <embed
                                    src={viewPreviewUrl}
                                    type="application/pdf"
                                    className="w-full h-[60vh] rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ==================== View Bonafide Modal ==================== */}
            {isBonafideViewerOpen && typeof window !== "undefined" && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    onClick={closeBonafideViewer}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeBonafideViewer}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        <div className="p-6 pb-3 border-b border-white/5">
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                                <b>Your Bonafide Certificate</b>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[300px]">
                            {bonafideViewFileType === "image" ? (
                                <img
                                    src={bonafideViewPreviewUrl}
                                    alt="Bonafide Certificate"
                                    className="max-w-full max-h-[60vh] object-contain rounded-lg"
                                />
                            ) : (
                                <embed
                                    src={bonafideViewPreviewUrl}
                                    type="application/pdf"
                                    className="w-full h-[60vh] rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
});

export default IdCardSection;
