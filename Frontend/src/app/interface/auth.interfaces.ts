export interface LoginUserData {
    username: string;
    password: string;
    grant_type: string;    
    scope?: string;        
    client_id: string;     
    client_secret: string; 
  }
  

export interface RegisterUserData {
    title: string;            
    firstName: string;      
    lastName: string;       
    email: string;           
    password: string;       
    phoneNumber: string;    
    companyName: string;     
}

export interface RegisterEmployeeData {
  title: string;            
  firstName: string;      
  lastName: string;       
  email: string;           
  password: string;       
  phoneNumber: string;    
  employerCode: string;     
}