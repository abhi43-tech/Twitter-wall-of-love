import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";

const EditWall = () => {
    const { wallId } = useParams();
    const navigate = useNavigate();
    const [wall, setWall] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [socialLinks, setSocialLinks] = useState([]);
    const [sharableLink, setSharableLink] = useState("");
    const [embedCode, setEmbedCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const response = await api.get(
                    API_ENDPOINTS.GET_WALL_BY_ID(wallId)
                );
                const wallData = response.data;
                setWall(wallData);
                setTitle(wallData.title || "");
                setDescription(wallData.description || "");
                setIsPublic(wallData.is_public ?? true);
                setSocialLinks(
                    wallData.socialLinks ? [...wallData.socialLinks] : []
                );
                setLoading(false);
            } catch (err) {
                setError("Failed to load wall");
                setLoading(false);
            }
        };
        fetchWall();
    }, [wallId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            if (
                socialLinks.some((link) => !link.platform || !link.link.trim())
            ) {
                throw new Error(
                    "All social links must have a platform and a non-empty URL."
                );
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("is_public", isPublic);
            if (logo) formData.append("image", logo);
            formData.append("social_links", JSON.stringify(socialLinks));

            await api.put(API_ENDPOINTS.UPDATE_WALL(wallId), formData);
            navigate(`/walls/${wallId}/tweets`);
        } catch (err) {
            setError(err.message || "Failed to save wall");
        }
    };

    const handleDeleteWall = async () => {
        if (window.confirm("Are you sure you want to delete this wall?")) {
            try {
                await api.delete(API_ENDPOINTS.DELETE_WALL(wallId));
                navigate("/dashboard");
            } catch (err) {
                setError("Failed to delete wall");
            }
        }
    };

    const handleGenerateSharableLink = async () => {
        try {
            const response = await api.get(
                API_ENDPOINTS.GENERATE_SHARABLE_LINK(wallId)
            );
            setSharableLink(response.data.link);
        } catch (err) {
            setError("Failed to generate sharable link");
        }
    };

    const handleGenerateEmbedCode = async () => {
        try {
            const response = await api.get(
                API_ENDPOINTS.GET_EMBED_CODE(wallId)
            );
            setEmbedCode(response.data.embedCode);
        } catch (err) {
            setError("Failed to generate embed code");
        }
    };

    const handleAddSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: "twitter", link: "" }]);
    };

    const handleSocialLinkChange = (index, field, value) => {
        const updatedLinks = [...socialLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        setSocialLinks(updatedLinks);
    };

    const handleRemoveSocialLink = async (index) => {
        try {
            const linkToRemove = socialLinks[index];
            if (linkToRemove && linkToRemove.id) {
                await api.delete(
                    API_ENDPOINTS.DELETE_SOCIAL_LINK(wallId, linkToRemove.id)
                );
            }
            setSocialLinks(socialLinks.filter((_, i) => i !== index));
        } catch (err) {
            setError("Failed to remove social link");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading)
        return <div className="text-center text-gray-600">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;
    if (!wall)
        return <div className="text-center text-gray-600">Wall not found</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Edit Wall</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Logo</label>
                        <input
                            type="file"
                            onChange={(e) => setLogo(e.target.files[0])}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4 flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <label className="text-gray-700">Make Public</label>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Social Links
                    </label>
                    {socialLinks.map((link, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <select
                                value={link.platform}
                                onChange={(e) =>
                                    handleSocialLinkChange(
                                        index,
                                        "platform",
                                        e.target.value
                                    )
                                }
                                className="p-2 border rounded"
                            >
                                <option value="twitter">Twitter</option>
                                <option value="instagram">Instagram</option>
                                <option value="facebook">Facebook</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="youtube">YouTube</option>
                            </select>
                            <input
                                type="text"
                                value={link.link || ""}
                                onChange={(e) =>
                                    handleSocialLinkChange(
                                        index,
                                        "link",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded"
                                placeholder="URL"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveSocialLink(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="text-blue-500 hover:underline"
                    >
                        Add Social Link
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>

            <div className="mt-6 space-y-3">
                <button
                    onClick={handleGenerateSharableLink}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                    Generate Sharable Link
                </button>
                {sharableLink && (
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="text"
                            value={sharableLink}
                            readOnly
                            className="w-full p-2 border rounded"
                        />
                        <button
                            onClick={() => copyToClipboard(sharableLink)}
                            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                        >
                            Copy
                        </button>
                    </div>
                )}

                <button
                    onClick={handleGenerateEmbedCode}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                    Generate Embed Code
                </button>
                {embedCode && (
                    <div className="flex items-center space-x-2 mt-2">
                        <textarea
                            value={embedCode}
                            readOnly
                            className="w-full p-2 border rounded"
                        />
                        <button
                            onClick={() => copyToClipboard(embedCode)}
                            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                        >
                            Copy
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleDeleteWall}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                    Delete Wall
                </button>
            </div>
        </div>
    );
};

export default EditWall;
