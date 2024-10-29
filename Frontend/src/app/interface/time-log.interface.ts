export interface CreateTimeLogData {
    id: number;
    in_time: string;     
    out_time: string;    
    description: string; 
    user_id: number;     
    project_id: number;  
    status: number;
    project_name?: string;
  }

  export interface TimeLogStatus {
    id: number;
    user_id: number;
    status: number;
    in_time: string;   
    out_time: string | null; 
    description: string;
    project_id: number;
  }
  
  

