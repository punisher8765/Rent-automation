import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './routes';
import './App.css';
import { checkAndGenerateBills } from './utils/billing';
import { loadUser } from './store/slices/authSlice'; // To ensure user is loaded
import { setRooms } from './store/slices/roomSlice'; // To load initial rooms
import { setBills } from './store/slices/billSlice'; // To load initial bills

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { rooms } = useSelector((state) => state.room);
  const { bills } = useSelector((state) => state.bill);

  // Load initial user, rooms, and bills from localStorage or other sources
  useEffect(() => {
    dispatch(loadUser()); // Load user session

    // Simulate loading initial rooms and bills from localStorage
    // In a real app, this might be an API call
    try {
      const storedRooms = JSON.parse(localStorage.getItem('rooms')) || [];
      dispatch(setRooms(storedRooms));
    } catch (e) {
      console.error("Error loading initial rooms from localStorage:", e);
    }

    try {
      const storedBills = JSON.parse(localStorage.getItem('bills')) || [];
      dispatch(setBills(storedBills));
    } catch (e) {
      console.error("Error loading initial bills from localStorage:", e);
    }
  }, [dispatch]);

  // Effect for bill generation
  useEffect(() => {
    // Only run if authenticated, user is an owner, and rooms/bills data is available
    if (isAuthenticated && user?.userType === 'owner' && rooms.length > 0) {
      console.log("App.js: User is owner, attempting to generate bills.");
      // Pass allRooms, allBills, and dispatch to the utility function
      checkAndGenerateBills(rooms, bills, dispatch);
    }
  }, [isAuthenticated, user, rooms, bills, dispatch]); // Dependencies for the effect

  return (
    <AppRouter /> // Render the AppRouter
  );
}

export default App;
