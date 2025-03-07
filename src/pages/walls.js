import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { API_ENDPOINTS } from '../services/apiEndpoints';
import Wall from '../components/wall';

const PublicWall = () => {
  const { id } = useParams();
  const [wallData, setWallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallData = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.GET_PUBLIC_WALL(id));
        setWallData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load wall data');
        setLoading(false);
      }
    };

    fetchWallData();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <Wall
      title={wallData.title}
      logo={wallData.logo}
      tweets={wallData.tweet}
      socialLinks={wallData.social_links}
    />
  );
};

export default PublicWall;