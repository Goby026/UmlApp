import axios from "axios";

const API_URL = 'http://localhost:8082/api/v1/cargos';

export const getCargos = async ()=>{
    const response = await axios.get(API_URL);
    return response.data.cargos;
}

export const createCargo = async (cargo)=>{
    return await axios.post(API_URL, cargo)
}

export const updateCargo = async (id, cargo)=>{
    return await axios.put(`${API_URL}/${id}`, cargo);
}

export const deleteCargo = async (id)=>{
    return await axios.delete(`${API_URL}/${id}`)
}