export const fetchData = async (
  token: string,
  collection: "authors" | "posts",
) => {
  const res = await fetch(
    `http://localhost:1337/api/${collection}?populate=*&locale=en`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { data } = await res.json();

  return data;
};
