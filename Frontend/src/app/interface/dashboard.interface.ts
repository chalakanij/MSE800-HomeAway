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
    project_title: any,
    project_status: any,
           
  }
  
  export interface EmployerDashboardData {
    employees: EmployeeStatus[];
    projects: ProjectStatus[];
    project_hours: ProjectHours[];
  }

  export interface ProjectStatus {
    status: string;
    count: number;
  }
  
  export interface EmployeeDashboardData {
    projects: ProjectStatus[];
    last_checkin: string;   
    last_checkout: string; 
  }

  export interface CountByStatus {
    status: string;
    count: number;
  }
  
  export interface AdminDashboardData {
    employees: CountByStatus[];
    employers: CountByStatus[];
    projects: CountByStatus[];
  }