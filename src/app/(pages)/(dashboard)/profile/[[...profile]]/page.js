import React from "react";
import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUserTokensById } from "@/utils/actions";

const ProfilePage = async () => {  
  const user = await currentUser();
  const currentTokens = await fetchUserTokensById(user.id);

  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">
        Token Amount:{currentTokens}
      </h2>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
