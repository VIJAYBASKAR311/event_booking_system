// EventBooking.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';


const EventBooking = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    fetch('/data.json') // Load JSON data here
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load events');
        setLoading(false);
      });
  }, []);

  const handleBooking = (eventId) => {
    if (!isLoggedIn) {
      login();
      return;
    }

    setFilteredEvents(events.map(event => {
      if (event.id === eventId && event.availableSeats > 0) {
        return { ...event, availableSeats: event.availableSeats - 1 };
      }
      return event;
    }));
  };

  const handleFilter = () => {
    let filtered = events;
    if (category) {
      filtered = filtered.filter(event => event.category === category);
    }
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [category, search]);

  const paginatedEvents = useMemo(() => {
    const itemsPerPage = 5;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  

  return (
    <div>
      <h1>Event Booking System</h1>

      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Conference">Conference</option>
          {/* Add more categories */}
        </select>
      </div>

      <div>
        {paginatedEvents.map((event) => (
          <div key={event.id}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Category: {event.category}</p>
            <p>Date: {event.date}</p>
            <p>Available Seats: {event.availableSeats}</p>
            <p>Price: ${event.price}</p>
            {event.availableSeats > 0 ? (
              <button onClick={() => handleBooking(event.id)}>Book Ticket</button>
            ) : (
              <p>Fully Booked</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev * 5 < filteredEvents.length ? prev + 1 : prev))
          }
          disabled={currentPage * 5 >= filteredEvents.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventBooking;