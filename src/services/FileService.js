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

    post(endPoint, formData) {
        console.log(formData);
    
        // Set headers for JSON content type
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        // Make sure formData is an object expected to be sent as JSON
        // Axios will automatically convert JavaScript objects to JSON
        httpLocal.post(endPoint, formData, config).then(response => {
            console.log('Post response:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error posting data:', error.response ? error.response.data : error);
            throw error; // Throw error to handle it in the component
        });
    }
    



    

}

export default new FileService();




