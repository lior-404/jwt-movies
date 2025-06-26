import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  function getRefreshToken() {
    fetch(import.meta.env.VITE_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          setUser({});
          setLoading(false);
        } else {
          const data = await response.json();
          setUser((oldValue) => {
            return { ...oldValue, token: data.token, username: data.username };
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setUser({});
        setLoading(false);
      })
      .finally();
  }

  useEffect(() => {
    getRefreshToken();
    setInterval(() => {
      getRefreshToken();
    }, 13 * 60 * 1000);
  }, []);

  return (
    <UserContext.Provider value={[user, setUser, loading]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
