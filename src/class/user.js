class User{
    #email;
    #pass;
    constructor(id,fname,lname,email,pass,gender){
       
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.#email = email;
        this.#pass = pass; 
        this.gender = gender;

    }
    displayInfo(){
        return this;
    }

    get userEmail(){
        return this.#email;
    
    }

 
}

export class client extends User{
   
    constructor(id,fname,lname,email,pass,gender,vegetarian,budget,location,type){
        super(id,fname,lname,email,pass,gender);
        this.vegetarian = vegetarian==1?true:false;
        this.budget = Number(budget);
        this.location = location;
        this.type = type;
    }

    displayInfo(){
        return this;
    }


   
}

export class admin extends User{
   
    constructor(id,fname,lname,email,pass,gender,type,budget=9999){
        super(id,fname,lname,email,pass,gender);
        this.type = type;
        this.budget = Number(budget);
    
    }
    displayInfo(){
        return this;
    }

 
}

export default User;