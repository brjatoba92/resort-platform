import React from 'react';
import { useParams } from 'react-router-dom';

export default function RoomDetails() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Room Details</h1>
      {/* TODO: Implement room details for room {id} */}
    </div>
  );
}