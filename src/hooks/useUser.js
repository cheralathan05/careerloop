// src/hooks/useUser.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // ✅ Match file name
import { useAuth } from "./useAuth";

/**
 * Custom hook to fetch and store user data from Firestore
 * Automatically updates when Firebase Auth user changes
 */
export const useUser = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!user) {
        if (isMounted) {
          setUserData(null);
          setLoading(false);
        }
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          isMounted && setUserData({ ...userSnap.data(), uid: user.uid });
        } else {
          isMounted && setUserData({ uid: user.uid, email: user.email });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        isMounted && setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { userData, loading };
};
