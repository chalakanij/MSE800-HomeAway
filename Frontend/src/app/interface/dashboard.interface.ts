export interface EmployeeStatus {
    status: string;
    count: number;
  }
  
  export interface ProjectStatus {
    status: string;
    count: number;
  }
  
  export interface ProjectHours {
    project_id: number;
    work_hours: number;
    calculated: number;
  }
  
  export interface DashboardData {
    employees: EmployeeStatus[];
    project_status: ProjectStatus[];
    project_hours: ProjectHours[];
  }

  export interface ProjectStatus {
    status: string;
    count: number;
  }
  
  export interface EventData {
    projects: ProjectStatus[];
    last_checkin: string;   
    last_checkout: string; 
  }