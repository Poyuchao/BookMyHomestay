import http from "../http-common";

class FileService{

    read(fileName){

        return http.get(`/data/${fileName}.json`);

    }

}

export default new FileService();