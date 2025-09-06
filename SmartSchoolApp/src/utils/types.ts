export type Student = {
id: number;
firstName: string;
lastName: string;
admissionNumber: string;
schoolClass?: { id: number; name: string };
};


export type Teacher = {
id: number;
firstName: string;
lastName: string;
email: string;
subjects?: { id: number; name: string }[];
schoolClasses?: { id: number; name: string }[];
photoUrl?: string; // 👈 add this
};


export type SchoolClass = { id: number; name: string };


export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';


export type AttendanceRecord = {
id?: number;
studentId: number;
schoolClassId: number;
teacherId?: number | null;
status: AttendanceStatus;
date?: string;
};