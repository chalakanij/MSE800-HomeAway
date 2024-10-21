export interface CreateProjectData {
    id: number;
    title: string;
    description: string;
    work_hours: string;
    status?: string;
    user_id?: number;
}

export interface AssignProjectData {
    id?: number;
    title: string;
    description: string;
    work_hours: string;
    status?: string;
    user_id?: number;
}

export interface EmployeeByProjectData {
    employee_id: number;
    project_id: number;
}

