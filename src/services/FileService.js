// import http from "../http-common";
import { httpClient,httpLocal} from '../http-common';




class FileService{

    read(fileName){


        httpClient.get(`/data/${fileName}.json`) 
            .then(response => {
                console.log('Data received:', response.data);
                
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        return  httpClient.get(`/data/${fileName}.json`);

    }

    post(endPoint, formData, config) {
        return httpLocal.post(endPoint, formData, config)
            .then(response => {
                console.log('Post response status:', response.status);
                return response; // Return the full response object
            })
            .catch(error => {
                console.error('Error posting data:', error.response ? error.response.data : error);
                throw error; // Throw the error to ensure it can be caught by the caller
            });
    }

    get(endPoint) {
        return httpLocal.get(endPoint)
            .then(response => {
                console.log('Get response status:', response.status);
                return response; 
            })
            .catch(error => {
                console.error('Error getting data:', error.response ? error.response.data : error);
                throw error; // Throw the error to ensure it can be caught by the caller
            });
    }
    



    

}

export default new FileService();




