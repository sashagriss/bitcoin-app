import axios from "axios";
// import { API_COIN } from "@react-native-dotenv";

export const fetchCoins = async () => {
    try {
        const response = await axios.post(
            "https://api.livecoinwatch.com/coins/list",
            {
                currency: "USD",
                sort: "rank",
                order: "ascending",
                offset: 0,
                limit: 50,
                meta: true
            }, 
            {
                headers: {
                    "x-api-key": 
                    // API_COIN 
                },
            }
        );

        console.log("Coins Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Request Error:", error);
    }
};