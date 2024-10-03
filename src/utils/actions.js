"use server";
import OpenAI from "openai";
import prisma from "./db";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "you are a helpful assistant" },
        ...chatMessages,
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 100,
    });
    return {
      message: response.choices[0].message,
      tokens: response.usage.total_tokens,
    };
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a city named ${city}  in this country ${country}.
  If ${city} in ${country} exists, create a list of things families can do in this ${city},${country}. 
  Once you have a list, create a one-day tour. Response should be in the following JSON format: 
  {
    "tour": {
      "city": "${city}",
      "country": "${country}",
      "title": "title of the tour",
      "description": "description of the city and tour",
      "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
    }
  }
  If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, 
  or it is not located in the following ${country} return { "tour": null }, with no additional characters.`;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a tour guide for people between 25 and 35 years old",
        },
        { role: "user", content: query },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });
    const tourData = JSON.parse(response?.choices[0]?.message?.content);
    return {
      tour: tourData?.tour || null,
      tokens: response.usage.total_tokens,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateTourImage = async ({ city, country }) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `A panoramic view of city ${city} of country ${country}`,
      n: 1,
      size: "512x512",
    });
    return tourImage?.data[0]?.url;
  } catch (error) {
    return null;
  }
};

export const getExistingTour = async ({ city, country }) => {
  const existingTour = await prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
  return existingTour;
};

export const createNewTour = async (tour) => {
  return prisma.tour.create({
    data: tour,
  });
};

export const getAllTours = async (searchTerm) => {
  if (!searchTerm) {
    return await prisma.tour.findMany({
      orderBy: {
        city: "asc",
      },
    });
  }
  return await prisma.tour.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
          },
        },
        {
          country: {
            contains: searchTerm,
          },
        },
      ],
    },
    orderBy: {
      city: "asc",
    },
  });
};

export const findSingleTour = async (id) =>
  await prisma.tour.findUnique({
    where: {
      id,
    },
  });

export const fetchUserTokensById = async (clerkId) => {
  const result = await prisma.token.findUnique({
    where: {
      clerkId,
    },
  });
  return result?.tokens;
};

export const generateUserTokensForId = async (clerkId) => {
  const result = await prisma.token.create({
    data: {
      clerkId,
    },
  });
  return result?.tokens;
};

export const fetchOrGenerateTokens = async (clerkId) => {
  const existing = await fetchUserTokensById(clerkId);
  if (existing) return existing;
  return await generateUserTokensForId(clerkId);
};

export const substractTokens = async (clerkId, totalTokens) => {
  const result = await prisma.token.update({
    where: {
      clerkId,
    },
    data: {
      tokens: {
        decrement: totalTokens,
      },
    },
  });
  revalidatePath("/profile");
  return result.tokens;
};
