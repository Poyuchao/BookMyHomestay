// import axios from "axios";
// export default axios.create({
//     baseURL:"https://poyuchao.github.io/BookMyHomestay/"
// })

import axios from "axios";

// Instance for GET requests
const httpClient = axios.create({
  baseURL: "https://poyuchao.github.io/BookMyHomestay/",
});

// Instance for POST requests
const httpLocal = axios.create({
  baseURL: "http://localhost/index.php/",
});

export { httpClient, httpLocal };
