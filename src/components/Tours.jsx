"use client";
import { getAllTours } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ToursList from "./ToursList";

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["tours", searchTerm],
    queryFn: () => getAllTours(searchTerm),
  });

  return (
    <>
      <form className="max-w-lg mb-12">
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="Enter city or country name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <button
            className="btn btn-primary join-item"
            type="button"
            disabled={isPending}
            onClick={() => setSearchTerm("")}
          >
            {isPending ? "Please wait" : "Reset"}
          </button>
        </div>
      </form>
      {isPending ? (
        <span className="loading"></span>
      ) : (
        <ToursList data={data} />
      )}
    </>
  );
};

export default Tours;
