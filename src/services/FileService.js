import http from "../http-common";

class FileService{

    read(fileName){

        return http.get(`/BookMyHomestay/data/${fileName}.json`);

    }

}

export default new FileService();