import axios from "axios";

const HOSTED_PORT = `https://lakeside-commons.herokuapp.com/`;
const LOCAL_PORT = `http://localhost:3002/`;

const getData = async (route) => {
  console.log(route);
  const res = await axios.get(`${HOSTED_PORT}${route}`).catch((err) => {
    console.log(err);
    return false;
  });
  return res.data;
};

export default getData;
