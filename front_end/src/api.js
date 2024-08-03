import axios from "axios";


// Base URL for the API, switch between production and development URLs
export const BASE_URL = "https://polyadic2-6ea021d6a043.herokuapp.com/";

/**
 * Create an axios instance with the base URL set to the API's base URL.
 * This instance can be used throughout the application to make HTTP requests.
 */
export const api = axios.create({
  baseURL: BASE_URL,
});
