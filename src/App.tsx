import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './App.css';
import { HeroSelection } from "./components/hero-selection/hero-selection";
import { PreFight } from "./components/pre-fight/pre-fight";

export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to='/hero-selection'/>
    },
    {
      path: '/hero-selection',
      element:  <HeroSelection />
    },
    {
      path: '/pre-fight',
      element: <PreFight />
    }
  ])


  return (
    <RouterProvider router={router}/>
  );
}