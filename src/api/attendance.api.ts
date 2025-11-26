import api from './axios';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  MANUAL_PRESENT = 'manual_present',
}

export interface AttendanceRequest {
  status: AttendanceStatus;
  isManual?: boolean;
}


export interface Attendance {
  id: number;
  sessionId: number;
  studentId: number;
  status: 'present' | 'absent' | 'manual_present';
  isManual: boolean;
  markedBy?: number;
  markedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  student?: {
    id: number;
    name: string;
    email: string;
  };
  session?: {
    id: number;
    date: string;
    topic?: string;
  };
}

export interface MarkAttendanceRequest {
  studentId: number;
  status: 'present' | 'absent' | 'manual_present';
  isManual?: boolean;
}

export interface PunchInRequest {
  photo?: string;
  fingerprint?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

export interface PunchOutRequest {
  photo?: string;
  fingerprint?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

export interface StudentPunch {
  id: number;
  userId: number;
  date: string;
  punchInAt?: string;
  punchOutAt?: string;
  punchInPhoto?: string;
  punchOutPhoto?: string;
  punchInFingerprint?: string;
  punchOutFingerprint?: string;
  punchInLocation?: any;
  punchOutLocation?: any;
  effectiveHours?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PunchResponse {
  status: string;
  message: string;
  data: {
    punch: StudentPunch;
    punchInAt?: string;
    punchOutAt?: string;
    effectiveWorkingHours?: number;
  };
}

export interface TodayPunchResponse {
  status: string;
  data: {
    punch: StudentPunch | null;
    hasPunchedIn: boolean;
    hasPunchedOut: boolean;
  };
}

export interface AttendanceResponse {
  status: string;
  data: {
    attendance: Attendance;
  };
}

export interface AttendancesResponse {
  status: string;
  data: {
    attendances: Attendance[];
  };
}

export const attendanceAPI = {
  getSessionAttendances: async (sessionId: number): Promise<AttendancesResponse> => {
    const response = await api.get<AttendancesResponse>(`/sessions/${sessionId}/attendance`);
    return response.data;
  },
  markAttendance: async (sessionId: number, data: MarkAttendanceRequest): Promise<AttendanceResponse> => {
    const response = await api.post<AttendanceResponse>(`/sessions/${sessionId}/attendance`, data);
    return response.data;
  },
  getStudentAttendance: async (studentId: number, params?: { from?: string; to?: string }): Promise<AttendancesResponse> => {
    const response = await api.get<AttendancesResponse>(`/students/${studentId}/attendance`, { params });
    return response.data;
  },
  // Student Punch In/Out
  punchIn: async (data: PunchInRequest): Promise<PunchResponse> => {
    const response = await api.post<PunchResponse>('/student-attendance/punch-in', data);
    return response.data;
  },
  punchOut: async (data: PunchOutRequest): Promise<PunchResponse> => {
    const response = await api.post<PunchResponse>('/student-attendance/punch-out', data);
    return response.data;
  },
  getTodayPunch: async (): Promise<TodayPunchResponse> => {
    const response = await api.get<TodayPunchResponse>('/student-attendance/today');
    return response.data;
  },
  getStudentPunchHistory: async (params?: { from?: string; to?: string }): Promise<{ status: string; data: { punches: StudentPunch[] } }> => {
    const response = await api.get('/student-attendance/history', { params });
    return response.data;
  },
};

