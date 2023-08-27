import axios from "axios";
export default function request(config){
    const req = axios.create({
        baseURL:"http://localhost:8081",
        timeout:10000,
        withCredentials: true,
    })
    return req(config)
}