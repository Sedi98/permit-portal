export interface NotificationsQueryParams {
  per_page?: number;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  data: {
    permit_application_id: number;
  };
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  status: "success";
  data: {
    data: Notification[];
    total: number;
    current_page: number;
  };
}

export interface UnreadNotificationsCountResponse {
  status: "success";
  data: {
    count: number;
  };
}

export interface MarkAllNotificationsReadResponse {
  status: "success";
  message: string;
}
