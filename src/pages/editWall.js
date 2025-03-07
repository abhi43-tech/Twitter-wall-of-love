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
                const initialSocialLinks = wallData.socialLinks
                    ? [...wallData.socialLinks]
                    : [];
                setSocialLinks(initialSocialLinks);
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
            const invalidLinks = socialLinks.filter(
                (link) => !link.platform || !link.link || link.link.trim() === ""
            );
            if (invalidLinks.length > 0) {
                throw new Error(
                    "All social links must have a platform and a non-empty URL"
                );
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("is_public", isPublic);
            if (logo) formData.append("image", logo);
            formData.append("social_links", JSON.stringify(socialLinks)); // Always send, even if empty

            await api.put(API_ENDPOINTS.UPDATE_WALL(wallId), formData); // Fixed to use wallId
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
                API_ENDPOINTS.GET_EMBED_CODE(wallId) // Fixed to use wallId
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
                await api.delete(API_ENDPOINTS.DELETE_SOCIAL_LINK(wallId, linkToRemove.id));
            }
            setSocialLinks(socialLinks.filter((_, i) => i !== index));
        } catch (err) {
            setError("Failed to remove social link");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!wall) return <div>Wall not found</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Wall</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Logo</label>
                    <input
                        type="file"
                        onChange={(e) => setLogo(e.target.files[0])}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Public</label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Make public
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
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>

            <div className="mt-6">
                <button
                    onClick={handleGenerateSharableLink}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
                >
                    Generate Sharable Link
                </button>
                <button
                    onClick={handleGenerateEmbedCode}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Generate Embed Code
                </button>
                {sharableLink && (
                    <p className="mt-2">Sharable Link: {sharableLink}</p>
                )}
                {embedCode && <p className="mt-2">Embed Code: {embedCode}</p>}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleDeleteWall}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Delete Wall
                </button>
            </div>
        </div>
    );
};

export default EditWall;