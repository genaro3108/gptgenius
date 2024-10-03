"use client";
import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
  fetchUserTokensById,
  substractTokens,
} from "@/utils/actions";
import TourInfo from "./TourInfo";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const {
    mutate: getTour,
    isPending: gettingTour,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      debugger;
      const existingTour = await getExistingTour(destination);
      if (existingTour) return existingTour;
      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 300) {
        toast.error("Token balance to low");
        return null;
      }
      const newTourResponse = await generateTourResponse(destination);
      const newTour = newTourResponse.tour;
      if (!newTour) {
        toast.error("No matching city found");
        return null;
      }
      await createNewTour(newTour);
      queryClient.invalidateQueries({
        queryKey: ["tours"],
      });
      const newTokens = await substractTokens(userId, newTourResponse.tokens);
      toast.success(`${newTokens} tokens remaining`);
      return newTour;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    getTour(destination);
  };

  if (gettingTour) return <span className="loading loading-lg"></span>;

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full mb-12">
          <input
            type="text"
            className="input join-item w-full"
            placeholder="City"
            name="city"
            required
          />

          <input
            type="text"
            className="input join-item w-full"
            placeholder="Country"
            name="country"
            required
          />

          <button className="btn btn-primary join-item" type="submit">
            Create
          </button>
        </div>
        <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
      </form>
    </>
  );
};

export default NewTour;
