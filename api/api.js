import axios from "axios";

const urlApi = "https://parseapi.back4app.com/classes/WanderWish";
const headers = {
    "X-Parse-Application-Id": "ysnRi8R1K2tIq6XyeyNtYgDhKhjDxrpBSlNR7fxH",
    "X-Parse-REST-API-Key": "PMdK523iYrBgpVcpFVu5vHXmoWpGq2PzT70lwjoW",
};
const headersJSON = {
    ...headers,
    "Content-Type": "application/json",
};

export async function getDestino() {
    const response = await axios.get(urlApi, {headers: headers});
    return response.data.result;
}

export async function addDestino(novoDest) {
    return axios.post(urlApi, novoDest, {
        headers: headersJSON,
    });
}

export async function updateDestino(DestinoAtualizado) {
    return axios.put(`${urlApi}/${DestinoAtualizado.objectId}`, DestinoAtualizado, {
        headers: headersJSON,
    });
}

export const deletarDestino = (Destino) => 
    axios.delete(`${urlApi}/${Destino.objectId}`,{
        headers: headersJSON,
    });