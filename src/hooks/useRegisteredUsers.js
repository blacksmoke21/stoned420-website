import { useEffect, useState } from "react";

export const useRegisteredUsers = () => {
  const [users, setUsers] = useState();

  const loadUsers = async () => {
    const response = await fetch("https://stoned420.fun/.well-known/nostr.json");
    const data = await response.json();
    const users = data.names;
    return users;
  };

  // initially load users
  useEffect(() => {
    loadUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return users;
};
