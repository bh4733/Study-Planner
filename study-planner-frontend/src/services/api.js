const BASE_URL = "http://localhost:3000/api";

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return res.json();
};

export const getTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: {
      Authorization: token,
    },
  });

  return res.json();
};
